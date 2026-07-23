import { redirect } from "next/navigation";
import { OnboardingHeader } from "@/app/onboarding/components/OnboardingHeader";
import { StepCard } from "@/app/onboarding/components/StepCard";
import { Step2Form } from "@/app/onboarding/components/Step2Form";
import { getCurrentProfile, getReachedStep } from "@/lib/onboarding/data";

export default async function Step2Page() {
  const reachedStep = await getReachedStep();
  if (reachedStep < 2) redirect(`/onboarding/step-${reachedStep}`);

  const profile = await getCurrentProfile();

  return (
    <>
      <OnboardingHeader step={2} />
      <StepCard
        title="Where are you headed?"
        description="Give us a target — or tell us you're still deciding — so we can start shaping a roadmap around it."
      >
        <Step2Form
          defaultValues={{
            targetRole: profile?.targetRole ?? undefined,
            stillDecidingRole: profile?.stillDecidingRole ?? undefined,
            transitionMotivation: profile?.transitionMotivation ?? undefined,
          }}
        />
      </StepCard>
    </>
  );
}
