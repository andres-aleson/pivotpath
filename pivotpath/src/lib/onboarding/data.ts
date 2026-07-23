import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/onboarding/session";

/** The farthest step this session may access. Defaults to 1 for brand-new visitors. */
export async function getReachedStep(): Promise<number> {
  const sessionId = await getSessionId();
  if (!sessionId) return 1;

  const profile = await prisma.userProfile.findUnique({
    where: { sessionId },
    select: { onboardingStep: true },
  });
  return profile?.onboardingStep ?? 1;
}

export async function isOnboardingComplete(): Promise<boolean> {
  const sessionId = await getSessionId();
  if (!sessionId) return false;

  const profile = await prisma.userProfile.findUnique({
    where: { sessionId },
    select: { onboardingCompletedAt: true },
  });
  return profile?.onboardingCompletedAt != null;
}

export async function getCurrentProfile() {
  const sessionId = await getSessionId();
  if (!sessionId) return null;

  return prisma.userProfile.findUnique({ where: { sessionId } });
}
