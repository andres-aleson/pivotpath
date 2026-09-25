"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, milestone, roadmap, userProfile, type UserProfile } from "@/lib/db";
import { gemini, GEMINI_MODEL } from "@/lib/gemini";
import {
  roadmapResponseJsonSchema,
  roadmapSchema,
  type RoadmapGeneration,
  type MilestoneStatus,
} from "@/lib/roadmap/schema";
import { getCurrentUserId } from "@/lib/current-user";
import {
  FINANCIAL_CONCERN_OPTIONS,
  TIMELINE_URGENCY_OPTIONS,
} from "@/lib/onboarding/schema";

type ActionResult = { ok: true } | { ok: false; error: string };

function buildPrompt(profile: UserProfile): string {
  const skills = ((profile.topSkills as string[] | null) ?? []).join(", ");
  const industries = ((profile.industriesOfInterest as string[] | null) ?? []).join(", ");
  const financialConcern = FINANCIAL_CONCERN_OPTIONS.find(
    (o) => o.value === profile.financialConcernType
  )?.label;
  const timeline = TIMELINE_URGENCY_OPTIONS.find(
    (o) => o.value === profile.timelineUrgency
  )?.label;

  return `You are a career transition coach. Build a personalized, realistic career transition roadmap for this person, based only on the details below — no generic advice that could apply to anyone.

Current job title: ${profile.currentJobTitle}
Top skills: ${skills}
Industries they're interested in: ${industries}

Target role: ${
    profile.stillDecidingRole
      ? "Not decided yet — recommend the single best-fit role based on the profile below"
      : profile.targetRole
  }
What's motivating the change: ${profile.transitionMotivation}

Years of experience: ${profile.yearsExperience}
Education: ${profile.educationLevel}
Time available per week for retraining: ${profile.weeklyTimeCommitment}
Where they are in the process: ${timeline}
Biggest financial concern about transitioning: ${financialConcern}

Produce 5-7 ordered milestones that take them from where they are now to the target role, sequenced realistically given their weekly time availability. Each milestone should reference something specific from their background — their current skills, their timeline, or their stated concern — not boilerplate advice that could apply to anyone.`;
}

export async function generateRoadmap(): Promise<ActionResult> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const existing = await db.query.roadmap.findFirst({ where: eq(roadmap.userId, userId) });
  if (existing) redirect("/roadmap");

  const profile = await db.query.userProfile.findFirst({ where: eq(userProfile.userId, userId) });
  if (!profile?.onboardingCompletedAt) redirect("/onboarding");

  let parsed: RoadmapGeneration;
  try {
    const response = await gemini.interactions.create({
      model: GEMINI_MODEL,
      input: buildPrompt(profile),
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: roadmapResponseJsonSchema,
      },
    });

    const raw = response.output_text;
    if (!raw) {
      return { ok: false, error: "The model didn't return anything. Please try again." };
    }

    const result = roadmapSchema.safeParse(JSON.parse(raw));
    if (!result.success) {
      return {
        ok: false,
        error: "Couldn't make sense of the generated roadmap. Please try again.",
      };
    }
    parsed = result.data;
  } catch (err) {
    console.error("Roadmap generation failed:", err);
    return { ok: false, error: "Couldn't generate your roadmap right now. Please try again." };
  }

  try {
    await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(roadmap)
        .values({ userId, targetRole: parsed.targetRole })
        .returning({ id: roadmap.id });

      // The first milestone starts "in progress" so a fresh roadmap has
      // an obvious next step instead of everything looking equally distant.
      await tx.insert(milestone).values(
        parsed.milestones.map((m, index) => ({
          roadmapId: created.id,
          title: m.title,
          description: m.description,
          order: index,
          status: index === 0 ? "in_progress" : "todo",
        }))
      );
    });
  } catch (err) {
    // A concurrent request already created this session's roadmap first — that's fine,
    // just show it rather than surfacing a duplicate-key error.
    const isDuplicate =
      typeof err === "object" && err !== null && "code" in err && err.code === "23505";
    if (!isDuplicate) throw err;
  }

  redirect("/roadmap");
}

export async function markTransitionComplete() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const existing = await db.query.roadmap.findFirst({ where: eq(roadmap.userId, userId) });
  if (!existing) redirect("/roadmap");

  if (!existing.transitionCompletedAt) {
    await db
      .update(roadmap)
      .set({ transitionCompletedAt: new Date() })
      .where(eq(roadmap.userId, userId));
  }

  redirect("/transition-complete");
}

export async function updateMilestoneStatus(milestoneId: string, status: MilestoneStatus) {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const found = await db.query.milestone.findFirst({
    where: eq(milestone.id, milestoneId),
    with: { roadmap: { columns: { userId: true } } },
  });
  if (found?.roadmap.userId !== userId) return;

  await db
    .update(milestone)
    .set({ status, completedAt: status === "done" ? new Date() : null })
    .where(eq(milestone.id, milestoneId));

  revalidatePath("/roadmap");
}
