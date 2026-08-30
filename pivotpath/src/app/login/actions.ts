"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { logInSchema, type LogInInput } from "@/lib/auth/schema";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function logIn(input: LogInInput): Promise<ActionResult> {
  const parsed = logInSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email.trim().toLowerCase(),
      password: parsed.data.password,
      redirectTo: "/onboarding",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "Invalid email or password." };
    }
    throw error;
  }

  return { ok: true };
}
