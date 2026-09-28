import type { Journey } from "@/lib/journey/types";

const KEY = "pivotpath:journey";

export function getJourney(): Journey {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Journey) : {};
  } catch {
    return {};
  }
}

export function setJourney(patch: Partial<Journey>): Journey {
  const next = { ...getJourney(), ...patch };
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(KEY, JSON.stringify(next));
  }
  return next;
}

/** Clears the questionnaire and roadmap so a retake starts fresh — published
 * stories and financial numbers already entered are left alone. */
export function resetQuestionnaire(): Journey {
  const current = getJourney();
  const next: Journey = {
    financialProfile: current.financialProfile,
    story: current.story,
  };
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(KEY, JSON.stringify(next));
  }
  return next;
}
