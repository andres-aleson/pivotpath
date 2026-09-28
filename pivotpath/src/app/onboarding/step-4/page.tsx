"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingHeader } from "@/app/onboarding/components/OnboardingHeader";
import { StepCard } from "@/app/onboarding/components/StepCard";
import { ReviewStep } from "@/app/onboarding/components/ReviewStep";
import { getJourney } from "@/lib/journey/store";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  type Step1Input,
  type Step2Input,
  type Step3Input,
} from "@/lib/onboarding/schema";

type Profile = Step1Input & Step2Input & Step3Input;

export default function Step4Page() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const stored = getJourney().profile ?? {};
    if (!step1Schema.safeParse(stored).success) {
      router.replace("/onboarding/step-1");
      return;
    }
    if (!step2Schema.safeParse(stored).success) {
      router.replace("/onboarding/step-2");
      return;
    }
    if (!step3Schema.safeParse(stored).success) {
      router.replace("/onboarding/step-3");
      return;
    }
    setProfile(stored as Profile);
  }, [router]);

  if (!profile) return null;

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
