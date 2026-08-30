import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";

/** The farthest step this account may access. Defaults to 1 for brand-new accounts. */
export async function getReachedStep(): Promise<number> {
  const userId = await getCurrentUserId();
  if (!userId) return 1;

  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { onboardingStep: true },
  });
  return profile?.onboardingStep ?? 1;
}

export async function isOnboardingComplete(): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { onboardingCompletedAt: true },
  });
  return profile?.onboardingCompletedAt != null;
}

export async function getCurrentProfile() {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  return prisma.userProfile.findUnique({ where: { userId } });
}
