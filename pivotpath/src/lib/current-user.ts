import { auth } from "@/lib/auth";

/** The signed-in account's id, or null if nobody's logged in. Safe to call anywhere on the server. */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}
