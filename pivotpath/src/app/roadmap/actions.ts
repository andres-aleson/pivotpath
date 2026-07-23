"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { gemini, GEMINI_MODEL } from "@/lib/gemini";
import {
  roadmapResponseJsonSchema,
  roadmapSchema,
  type RoadmapGeneration,
  type MilestoneStatus,
} from "@/lib/roadmap/schema";
import { getOrCreateSessionId, getSessionId } from "@/lib/onboarding/session";
import {
  FINANCIAL_CONCERN_OPTIONS,
  TIMELINE_URGENCY_OPTIONS,
} from "@/lib/onboarding/schema";
import { Prisma, type UserProfile } from "@/generated/prisma/client";

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
  const sessionId = await getOrCreateSessionId();

  const existing = await prisma.roadmap.findUnique({ where: { sessionId } });
  if (existing) redirect("/roadmap");

  const profile = await prisma.userProfile.findUnique({ where: { sessionId } });
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
    await prisma.roadmap.create({
      data: {
        sessionId,
        targetRole: parsed.targetRole,
        milestones: {
          create: parsed.milestones.map((m, index) => ({
            title: m.title,
            description: m.description,
            order: index,
          })),
        },
      },
    });
  } catch (err) {
    // A concurrent request already created this session's roadmap first — that's fine,
    // just show it rather than surfacing a duplicate-key error.
    const isDuplicate =
      err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
    if (!isDuplicate) throw err;
  }

  redirect("/roadmap");
}

export async function updateMilestoneStatus(milestoneId: string, status: MilestoneStatus) {
  const sessionId = await getSessionId();
  if (!sessionId) return;

  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    select: { roadmap: { select: { sessionId: true } } },
  });
  if (milestone?.roadmap.sessionId !== sessionId) return;

  await prisma.milestone.update({
    where: { id: milestoneId },
    data: { status, completedAt: status === "done" ? new Date() : null },
  });

  revalidatePath("/roadmap");
}
