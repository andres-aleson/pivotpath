"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/onboarding/session";
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

  const sessionId = await getOrCreateSessionId();
  const existing = await prisma.userProfile.findUnique({
    where: { sessionId },
    select: { onboardingStep: true },
  });
  const existingStep = existing?.onboardingStep ?? 1;

  await prisma.userProfile.upsert({
    where: { sessionId },
    create: {
      sessionId,
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

  const sessionId = await getOrCreateSessionId();
  const existing = await prisma.userProfile.findUnique({
    where: { sessionId },
    select: { onboardingStep: true },
  });
  const existingStep = existing?.onboardingStep ?? 1;

  await prisma.userProfile.update({
    where: { sessionId },
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

  const sessionId = await getOrCreateSessionId();
  const existing = await prisma.userProfile.findUnique({
    where: { sessionId },
    select: { onboardingStep: true },
  });
  const existingStep = existing?.onboardingStep ?? 1;

  await prisma.userProfile.update({
    where: { sessionId },
    data: {
      ...parsed.data,
      onboardingStep: nextStepAfter(existingStep, 3),
    },
  });

  redirect(redirectTargetAfterSave(existingStep, 3));
}

export async function submitOnboarding(): Promise<void> {
  const sessionId = await getOrCreateSessionId();
  const profile = await prisma.userProfile.findUnique({ where: { sessionId } });

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
    where: { sessionId },
    data: { onboardingCompletedAt: new Date() },
  });

  redirect("/onboarding/complete");
}
