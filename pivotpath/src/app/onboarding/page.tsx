import { redirect } from "next/navigation";
import { getReachedStep, isOnboardingComplete } from "@/lib/onboarding/data";

export default async function OnboardingEntryPage() {
  if (await isOnboardingComplete()) redirect("/roadmap");

  const step = await getReachedStep();
  redirect(`/onboarding/step-${step}`);
}
