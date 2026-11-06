"use server";

import { isAdzunaConfigured, searchAdzuna } from "@/lib/jobs/adzuna";
import { US_STATES } from "@/lib/onboarding/schema";
import type { JobSearchResult } from "@/lib/jobs/types";

export async function searchJobOpenings(
  role: string,
  city: string,
  state: string
): Promise<JobSearchResult> {
  const cleanRole = role.trim().slice(0, 100);
  const cleanCity = city.trim().slice(0, 80);
  const validState = US_STATES.some(([code]) => code === state);
  if (!cleanRole || !cleanCity || !validState) return { ok: false, reason: "error" };

  if (!isAdzunaConfigured()) return { ok: false, reason: "not_configured" };

  try {
    return { ok: true, listings: await searchAdzuna(cleanRole, cleanCity, state) };
  } catch (err) {
    console.error("Job search failed:", err);
    return { ok: false, reason: "error" };
  }
}
