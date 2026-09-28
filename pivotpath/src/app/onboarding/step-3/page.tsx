"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingHeader } from "@/app/onboarding/components/OnboardingHeader";
import { StepCard } from "@/app/onboarding/components/StepCard";
import { Step3Form } from "@/app/onboarding/components/Step3Form";
import { getJourney } from "@/lib/journey/store";
import { step1Schema, step2Schema, type Step3Input } from "@/lib/onboarding/schema";

export default function Step3Page() {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<Partial<Step3Input> | null>(null);

  useEffect(() => {
    const profile = getJourney().profile ?? {};
    if (!step1Schema.safeParse(profile).success) {
      router.replace("/onboarding/step-1");
      return;
    }
    if (!step2Schema.safeParse(profile).success) {
      router.replace("/onboarding/step-2");
      return;
    }
    setDefaultValues(profile);
  }, [router]);

  if (!defaultValues) return null;

  return (
    <>
      <OnboardingHeader step={3} />
      <StepCard
        title="Your background and timeline"
        description="A little more context helps us calibrate how aggressive — or gradual — your roadmap should be."
      >
        <Step3Form defaultValues={defaultValues} />
      </StepCard>
    </>
  );
}
