import type { Step1Input, Step2Input, Step3Input } from "@/lib/onboarding/schema";
import type { MilestoneStatus, RoleSuggestion } from "@/lib/roadmap/schema";
import type { FinancialProfileInput } from "@/lib/financial/schema";
import type { ShareStoryInput } from "@/lib/stories/schema";
import type { JobListing } from "@/lib/jobs/types";

export type OnboardingProfile = Step1Input & Step2Input & Step3Input;

export type JourneyMilestone = {
  id: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  completedAt: string | null;
};

export type JourneyRoadmap = {
  targetRole: string;
  milestones: JourneyMilestone[];
  transitionCompletedAt: string | null;
};

export type JourneyStory = ShareStoryInput & { id: string };

export type Journey = {
  profile?: Partial<OnboardingProfile>;
  onboardingCompletedAt?: string;
  // Only used when the person is still deciding: the 3 roles currently on
  // screen, every role already shown (so "show me different roles" never
  // repeats), and the one they picked.
  roleSuggestions?: { roles: RoleSuggestion[]; seen: string[] };
  selectedTargetRole?: string;
  roadmap?: JourneyRoadmap;
  // Last successful job search, keyed by role + location so revisits don't re-query.
  jobs?: { key: string; listings: JobListing[] };
  financialProfile?: FinancialProfileInput;
  story?: JourneyStory;
};
