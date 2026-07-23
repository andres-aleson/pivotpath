import { OnboardingHeader } from "@/app/onboarding/components/OnboardingHeader";
import { StepCard } from "@/app/onboarding/components/StepCard";
import { Step1Form } from "@/app/onboarding/components/Step1Form";
import { getCurrentProfile } from "@/lib/onboarding/data";

export default async function Step1Page() {
  const profile = await getCurrentProfile();

  return (
    <>
      <OnboardingHeader step={1} />
      <StepCard
        title="Build your profile"
        description="Tell us where you are today so we can map out where you're going tomorrow. Your answers are private and help us personalize your career roadmap."
      >
        <Step1Form
          defaultValues={{
            currentJobTitle: profile?.currentJobTitle ?? undefined,
            topSkills: (profile?.topSkills as string[] | null) ?? undefined,
            financialConcernType: profile?.financialConcernType ?? undefined,
            industriesOfInterest: (profile?.industriesOfInterest as string[] | null) ?? undefined,
          }}
        />
      </StepCard>
    </>
  );
}
