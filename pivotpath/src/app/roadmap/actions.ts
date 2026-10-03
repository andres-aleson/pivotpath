"use server";

import { gemini, GEMINI_MODEL } from "@/lib/gemini";
import {
  roadmapResponseJsonSchema,
  roadmapSchema,
  roleSuggestionsResponseJsonSchema,
  roleSuggestionsSchema,
  type RoadmapGeneration,
  type RoleSuggestion,
} from "@/lib/roadmap/schema";
import {
  FINANCIAL_CONCERN_OPTIONS,
  TIMELINE_URGENCY_OPTIONS,
} from "@/lib/onboarding/schema";
import type { OnboardingProfile } from "@/lib/journey/types";

type ActionResult = { ok: true; data: RoadmapGeneration } | { ok: false; error: string };
type SuggestResult = { ok: true; roles: RoleSuggestion[] } | { ok: false; error: string };

function describeProfile(profile: OnboardingProfile): string {
  const skills = profile.topSkills.join(", ");
  const industries = profile.industriesOfInterest.join(", ");
  const financialConcern = FINANCIAL_CONCERN_OPTIONS.find(
    (o) => o.value === profile.financialConcernType
  )?.label;
  const timeline = TIMELINE_URGENCY_OPTIONS.find(
    (o) => o.value === profile.timelineUrgency
  )?.label;

  return `Current job title: ${profile.currentJobTitle}
Top skills: ${skills}
Industries they're interested in: ${industries}
What's motivating the change: ${profile.transitionMotivation}

Years of experience: ${profile.yearsExperience}
Education: ${profile.educationLevel}
Time available per week for retraining: ${profile.weeklyTimeCommitment}
Where they are in the process: ${timeline}
Biggest financial concern about transitioning: ${financialConcern}`;
}

function buildRoadmapPrompt(profile: OnboardingProfile, targetRole: string): string {
  return `You are a career transition coach. Build a personalized, realistic career transition roadmap for this person, based only on the details below — no generic advice that could apply to anyone.

${describeProfile(profile)}

Target role: ${targetRole}

Produce 5-7 ordered milestones that take them from where they are now to the target role, sequenced realistically given their weekly time availability. Each milestone should reference something specific from their background — their current skills, their timeline, or their stated concern — not boilerplate advice that could apply to anyone.`;
}

function buildSuggestionsPrompt(profile: OnboardingProfile, exclude: string[]): string {
  return `You are a career transition coach. This person hasn't decided what role to move toward. Suggest exactly 3 distinct, realistic target roles that fit them well, based only on the details below.

${describeProfile(profile)}

Pick roles they could plausibly reach given their background and available time, and make the 3 meaningfully different from each other rather than near-duplicates. For each, explain why it fits this specific person in at most 2 short sentences (under 40 words total).${
    exclude.length > 0
      ? `\n\nThey have already seen and passed on these roles, so do not suggest any of them (or close variants): ${exclude.join(", ")}.`
      : ""
  }`;
}

export async function suggestTargetRoles(
  profile: OnboardingProfile,
  exclude: string[]
): Promise<SuggestResult> {
  try {
    const response = await gemini.interactions.create({
      model: GEMINI_MODEL,
      input: buildSuggestionsPrompt(profile, exclude),
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: roleSuggestionsResponseJsonSchema,
      },
    });

    const raw = response.output_text;
    if (!raw) {
      return { ok: false, error: "The model didn't return anything. Please try again." };
    }

    const result = roleSuggestionsSchema.safeParse(JSON.parse(raw));
    if (!result.success) {
      return { ok: false, error: "Couldn't make sense of the suggestions. Please try again." };
    }

    const seen = new Set(exclude.map((r) => r.toLowerCase()));
    const fresh = result.data.roles.filter((r) => !seen.has(r.title.toLowerCase()));
    if (fresh.length < 3) {
      return { ok: false, error: "Couldn't find three new roles this time. Please try again." };
    }
    return { ok: true, roles: fresh.slice(0, 3) };
  } catch (err) {
    console.error("Role suggestion failed:", err);
    return { ok: false, error: "Couldn't suggest roles right now. Please try again." };
  }
}

export async function generateRoadmap(
  profile: OnboardingProfile,
  targetRole: string
): Promise<ActionResult> {
  try {
    const response = await gemini.interactions.create({
      model: GEMINI_MODEL,
      input: buildRoadmapPrompt(profile, targetRole),
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
    return { ok: true, data: result.data };
  } catch (err) {
    console.error("Roadmap generation failed:", err);
    return { ok: false, error: "Couldn't generate your roadmap right now. Please try again." };
  }
}
