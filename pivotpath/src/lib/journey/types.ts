import type { Step1Input, Step2Input, Step3Input } from "@/lib/onboarding/schema";
import type { MilestoneStatus } from "@/lib/roadmap/schema";
import type { FinancialProfileInput } from "@/lib/financial/schema";
import type { ShareStoryInput } from "@/lib/stories/schema";

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
  roadmap?: JourneyRoadmap;
  financialProfile?: FinancialProfileInput;
  story?: JourneyStory;
};
