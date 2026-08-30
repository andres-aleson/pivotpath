"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";
import { Prisma } from "@/generated/prisma/client";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  type Step1Input,
  type Step2Input,
  type Step3Input,
} from "@/lib/onboarding/schema";

type ActionResult = { ok: true } | { ok: false; error: string };

function nextStepAfter(existingStep: number, justCompleted: number): number {
  return Math.max(existingStep, Math.min(justCompleted + 1, 4));
}

/**
 * Resets the signed-in account's questionnaire and roadmap so they can go through it
 * again — the account itself, and anything they've published or entered financially,
 * stays untouched.
 */
export async function restartQuestionnaire() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  await prisma.milestone.deleteMany({ where: { roadmap: { userId } } });
  await prisma.roadmap.deleteMany({ where: { userId } });
  await prisma.userProfile.upsert({
    where: { userId },
    create: { userId },
    update: {
      currentJobTitle: null,
      topSkills: Prisma.JsonNull,
      financialConcernType: null,
      industriesOfInterest: Prisma.JsonNull,
      targetRole: null,
      stillDecidingRole: false,
      transitionMotivation: null,
      yearsExperience: null,
      educationLevel: null,
      weeklyTimeCommitment: null,
      timelineUrgency: null,
      onboardingStep: 1,
      onboardingCompletedAt: null,
    },
  });

  redirect("/onboarding/step-1");
}

function redirectTargetAfterSave(existingStep: number, justCompleted: number): string {
  // If they'd already reached Review, saving an earlier step is an edit — send them back there.
  if (existingStep >= 4) return "/onboarding/step-4";
  return `/onboarding/step-${justCompleted + 1}`;
}

export async function saveStep1(input: Step1Input): Promise<ActionResult> {
  const parsed = step1Schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const existing = await prisma.userProfile.findUnique({
    where: { userId },
    select: { onboardingStep: true },
  });
  const existingStep = existing?.onboardingStep ?? 1;

  await prisma.userProfile.upsert({
    where: { userId },
    create: {
      userId,
      ...parsed.data,
      onboardingStep: nextStepAfter(1, 1),
    },
    update: {
      ...parsed.data,
      onboardingStep: nextStepAfter(existingStep, 1),
    },
  });

  redirect(redirectTargetAfterSave(existingStep, 1));
}

export async function saveStep2(input: Step2Input): Promise<ActionResult> {
  const parsed = step2Schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const existing = await prisma.userProfile.findUnique({
    where: { userId },
    select: { onboardingStep: true },
  });
  const existingStep = existing?.onboardingStep ?? 1;

  await prisma.userProfile.update({
    where: { userId },
    data: {
      targetRole: parsed.data.targetRole || null,
      stillDecidingRole: parsed.data.stillDecidingRole,
      transitionMotivation: parsed.data.transitionMotivation,
      onboardingStep: nextStepAfter(existingStep, 2),
    },
  });

  redirect(redirectTargetAfterSave(existingStep, 2));
}

export async function saveStep3(input: Step3Input): Promise<ActionResult> {
  const parsed = step3Schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const existing = await prisma.userProfile.findUnique({
    where: { userId },
    select: { onboardingStep: true },
  });
  const existingStep = existing?.onboardingStep ?? 1;

  await prisma.userProfile.update({
    where: { userId },
    data: {
      ...parsed.data,
      onboardingStep: nextStepAfter(existingStep, 3),
    },
  });

  redirect(redirectTargetAfterSave(existingStep, 3));
}

export async function submitOnboarding(): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const profile = await prisma.userProfile.findUnique({ where: { userId } });

  const step1Check = step1Schema.safeParse({
    currentJobTitle: profile?.currentJobTitle ?? "",
    topSkills: profile?.topSkills ?? [],
    financialConcernType: profile?.financialConcernType ?? "",
    industriesOfInterest: profile?.industriesOfInterest ?? [],
  });
  if (!step1Check.success) redirect("/onboarding/step-1");

  const step2Check = step2Schema.safeParse({
    targetRole: profile?.targetRole ?? undefined,
    stillDecidingRole: profile?.stillDecidingRole ?? false,
    transitionMotivation: profile?.transitionMotivation ?? "",
  });
  if (!step2Check.success) redirect("/onboarding/step-2");

  const step3Check = step3Schema.safeParse({
    yearsExperience: profile?.yearsExperience ?? "",
    educationLevel: profile?.educationLevel ?? "",
    weeklyTimeCommitment: profile?.weeklyTimeCommitment ?? "",
    timelineUrgency: profile?.timelineUrgency ?? "",
  });
  if (!step3Check.success) redirect("/onboarding/step-3");

  await prisma.userProfile.update({
    where: { userId },
    data: { onboardingCompletedAt: new Date() },
  });

  redirect("/roadmap/generating");
}
