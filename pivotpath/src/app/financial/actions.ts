"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";
import { financialProfileSchema, type FinancialProfileInput } from "@/lib/financial/schema";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function saveFinancialProfile(input: FinancialProfileInput): Promise<ActionResult> {
  const parsed = financialProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  await prisma.financialProfile.upsert({
    where: { userId },
    create: { userId, ...parsed.data },
    update: { ...parsed.data },
  });

  redirect("/financial/plan");
}
