import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const COOKIE_NAME = "pp_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** Read-only. Safe to call from Server Components. */
export async function getSessionId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

/** Reads or creates the session cookie. Only callable from a Server Action or Route Handler. */
export async function getOrCreateSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) return existing;

  const id = randomUUID();
  store.set(COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return id;
}

/**
 * Abandons the current session so the next visit starts a brand-new one.
 * Only callable from a Server Action or Route Handler.
 *
 * TEMPORARY: this is how "retake the questionnaire" works for now — it just
 * orphans the old session's UserProfile/Roadmap rows rather than reusing or
 * deleting them. Revisit once there's a real save/resume feature.
 */
export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
