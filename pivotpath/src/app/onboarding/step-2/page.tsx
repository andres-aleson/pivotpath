"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingHeader } from "@/app/onboarding/components/OnboardingHeader";
import { StepCard } from "@/app/onboarding/components/StepCard";
import { Step2Form } from "@/app/onboarding/components/Step2Form";
import { getJourney } from "@/lib/journey/store";
import { step1Schema, type Step2Input } from "@/lib/onboarding/schema";

export default function Step2Page() {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<Partial<Step2Input> | null>(null);

  useEffect(() => {
    const profile = getJourney().profile ?? {};
    if (!step1Schema.safeParse(profile).success) {
      router.replace("/onboarding/step-1");
      return;
    }
    setDefaultValues(profile);
  }, [router]);

  if (!defaultValues) return null;

  return (
    <>
      <OnboardingHeader step={2} />
      <StepCard
        title="Where are you headed?"
        description="Give us a target — or tell us you're still deciding — so we can start shaping a roadmap around it."
      >
        <Step2Form defaultValues={defaultValues} />
      </StepCard>
    </>
  );
}
