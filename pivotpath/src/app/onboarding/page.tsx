import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/current-user";
import { getReachedStep, isOnboardingComplete } from "@/lib/onboarding/data";

export default async function OnboardingEntryPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  if (await isOnboardingComplete()) redirect("/roadmap");

  const step = await getReachedStep();
  redirect(`/onboarding/step-${step}`);
}
