"use client";

import { useEffect, useState } from "react";
import { OnboardingHeader } from "@/app/onboarding/components/OnboardingHeader";
import { StepCard } from "@/app/onboarding/components/StepCard";
import { Step1Form } from "@/app/onboarding/components/Step1Form";
import { getJourney } from "@/lib/journey/store";
import type { Step1Input } from "@/lib/onboarding/schema";

export default function Step1Page() {
  const [defaultValues, setDefaultValues] = useState<Partial<Step1Input> | null>(null);

  useEffect(() => {
    setDefaultValues(getJourney().profile ?? {});
  }, []);

  if (!defaultValues) return null;

  return (
    <>
      <OnboardingHeader step={1} />
      <StepCard
        title="Build your profile"
        description="Tell us where you are today so we can map out where you're going tomorrow. Nothing you enter is saved — it only lives in this browser tab for your current visit."
      >
        <Step1Form defaultValues={defaultValues} />
      </StepCard>
    </>
  );
}
