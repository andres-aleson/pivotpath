import { redirect } from "next/navigation";
import { OnboardingHeader } from "@/app/onboarding/components/OnboardingHeader";
import { StepCard } from "@/app/onboarding/components/StepCard";
import { ReviewStep } from "@/app/onboarding/components/ReviewStep";
import { getCurrentProfile, getReachedStep } from "@/lib/onboarding/data";

export default async function Step4Page() {
  const reachedStep = await getReachedStep();
  if (reachedStep < 4) redirect(`/onboarding/step-${reachedStep}`);

  const profile = await getCurrentProfile();
  if (!profile) redirect("/onboarding/step-1");

  return (
    <>
      <OnboardingHeader step={4} />
      <StepCard
        title="Review your answers"
        description="Here's everything we've got. Edit anything that's changed, then submit to finish up."
      >
        <ReviewStep profile={profile} />
      </StepCard>
    </>
  );
}
