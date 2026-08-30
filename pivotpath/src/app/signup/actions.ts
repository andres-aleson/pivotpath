"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { signUpSchema, type SignUpInput } from "@/lib/auth/schema";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function signUp(input: SignUpInput): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const email = parsed.data.email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.create({ data: { email, passwordHash } });

  try {
    await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirectTo: "/onboarding/step-1",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        ok: false,
        error: "Your account was created, but signing you in failed — please log in.",
      };
    }
    throw error;
  }

  return { ok: true };
}
