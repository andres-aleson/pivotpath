"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/onboarding/session";
import { financialProfileSchema, type FinancialProfileInput } from "@/lib/financial/schema";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function saveFinancialProfile(input: FinancialProfileInput): Promise<ActionResult> {
  const parsed = financialProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const sessionId = await getOrCreateSessionId();

  await prisma.financialProfile.upsert({
    where: { sessionId },
    create: { sessionId, ...parsed.data },
    update: { ...parsed.data },
  });

  redirect("/financial/plan");
}
