"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, financialProfile } from "@/lib/db";
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

  await db
    .insert(financialProfile)
    .values({ userId, ...parsed.data })
    .onConflictDoUpdate({
      target: financialProfile.userId,
      set: { ...parsed.data, updatedAt: new Date() },
    });

  redirect("/financial/plan");
}
