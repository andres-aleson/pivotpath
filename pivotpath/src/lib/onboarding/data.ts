import { eq } from "drizzle-orm";
import { db, userProfile } from "@/lib/db";
import { getCurrentUserId } from "@/lib/current-user";

/** The farthest step this account may access. Defaults to 1 for brand-new accounts. */
export async function getReachedStep(): Promise<number> {
  const userId = await getCurrentUserId();
  if (!userId) return 1;

  const profile = await db.query.userProfile.findFirst({
    where: eq(userProfile.userId, userId),
    columns: { onboardingStep: true },
  });
  return profile?.onboardingStep ?? 1;
}

export async function isOnboardingComplete(): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const profile = await db.query.userProfile.findFirst({
    where: eq(userProfile.userId, userId),
    columns: { onboardingCompletedAt: true },
  });
  return profile?.onboardingCompletedAt != null;
}

export async function getCurrentProfile() {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  return (await db.query.userProfile.findFirst({ where: eq(userProfile.userId, userId) })) ?? null;
}
