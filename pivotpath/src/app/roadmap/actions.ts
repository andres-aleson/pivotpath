"use server";

import { gemini, GEMINI_MODEL } from "@/lib/gemini";
import {
  roadmapResponseJsonSchema,
  roadmapSchema,
  type RoadmapGeneration,
} from "@/lib/roadmap/schema";
import {
  FINANCIAL_CONCERN_OPTIONS,
  TIMELINE_URGENCY_OPTIONS,
} from "@/lib/onboarding/schema";
import type { OnboardingProfile } from "@/lib/journey/types";

type ActionResult = { ok: true; data: RoadmapGeneration } | { ok: false; error: string };

function buildPrompt(profile: OnboardingProfile): string {
  const skills = profile.topSkills.join(", ");
  const industries = profile.industriesOfInterest.join(", ");
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

export async function generateRoadmap(profile: OnboardingProfile): Promise<ActionResult> {
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
    return { ok: true, data: result.data };
  } catch (err) {
    console.error("Roadmap generation failed:", err);
    return { ok: false, error: "Couldn't generate your roadmap right now. Please try again." };
  }
}
