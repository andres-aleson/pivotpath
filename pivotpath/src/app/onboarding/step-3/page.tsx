import { redirect } from "next/navigation";
import { OnboardingHeader } from "@/app/onboarding/components/OnboardingHeader";
import { StepCard } from "@/app/onboarding/components/StepCard";
import { Step3Form } from "@/app/onboarding/components/Step3Form";
import { getCurrentProfile, getReachedStep } from "@/lib/onboarding/data";

export default async function Step3Page() {
  const reachedStep = await getReachedStep();
  if (reachedStep < 3) redirect(`/onboarding/step-${reachedStep}`);

  const profile = await getCurrentProfile();

  return (
    <>
      <OnboardingHeader step={3} />
      <StepCard
        title="Your background and timeline"
        description="A little more context helps us calibrate how aggressive — or gradual — your roadmap should be."
      >
        <Step3Form
          defaultValues={{
            yearsExperience: profile?.yearsExperience ?? undefined,
            educationLevel: profile?.educationLevel ?? undefined,
            weeklyTimeCommitment: profile?.weeklyTimeCommitment ?? undefined,
            timelineUrgency: profile?.timelineUrgency ?? undefined,
          }}
        />
      </StepCard>
    </>
  );
}
