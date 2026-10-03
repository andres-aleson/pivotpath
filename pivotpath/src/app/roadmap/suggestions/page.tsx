"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { suggestTargetRoles } from "@/app/roadmap/actions";
import { getJourney, setJourney } from "@/lib/journey/store";
import { step1Schema, step2Schema, step3Schema } from "@/lib/onboarding/schema";
import type { OnboardingProfile } from "@/lib/journey/types";
import type { RoleSuggestion } from "@/lib/roadmap/schema";

export default function RoleSuggestionsPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [roles, setRoles] = useState<RoleSuggestion[]>([]);
  const [seen, setSeen] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasStarted = useRef(false);

  function fetchRoles(forProfile: OnboardingProfile, exclude: string[]) {
    setError(null);
    startTransition(async () => {
      const result = await suggestTargetRoles(forProfile, exclude);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const nextSeen = [...exclude, ...result.roles.map((r) => r.title)];
      setRoles(result.roles);
      setSeen(nextSeen);
      setSelected(null);
      setJourney({
        roleSuggestions: { roles: result.roles, seen: nextSeen },
        selectedTargetRole: undefined,
      });
    });
  }

  useEffect(() => {
    // React Strict Mode double-invokes effects in dev — guard so the (billed)
    // suggestion call only fires once per mount.
    if (hasStarted.current) return;
    hasStarted.current = true;

    const journey = getJourney();
    const stored = journey.profile ?? {};
    const isComplete =
      step1Schema.safeParse(stored).success &&
      step2Schema.safeParse(stored).success &&
      step3Schema.safeParse(stored).success;
    if (!isComplete || !journey.onboardingCompletedAt) {
      router.replace("/onboarding/step-1");
      return;
    }
    if (journey.roadmap) {
      router.replace("/roadmap");
      return;
    }
    if (!stored.stillDecidingRole) {
      router.replace("/roadmap/generating");
      return;
    }

    const fullProfile = stored as OnboardingProfile;
    setProfile(fullProfile);

    if (journey.roleSuggestions) {
      setRoles(journey.roleSuggestions.roles);
      setSeen(journey.roleSuggestions.seen);
      setSelected(journey.selectedTargetRole ?? null);
      return;
    }
    fetchRoles(fullProfile, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  function choose(title: string) {
    setSelected(title);
    setJourney({ selectedTargetRole: title });
  }

  function confirm() {
    if (!selected) return;
    router.push("/roadmap/generating");
  }

  if (!profile) return null;

  const isInitialLoad = roles.length === 0 && !error;

  return (
    <>
      <header className="sticky top-0 w-full z-50 flex justify-between items-center px-gutter py-4 bg-surface/95 backdrop-blur-sm shadow-sm">
        <Link href="/" className="text-headline-md font-bold text-primary">
          PivotPath
        </Link>
        <Link
          href="/"
          className="hidden md:block text-label-md text-on-surface-variant hover:text-secondary transition-colors"
        >
          Exit Questionnaire
        </Link>
      </header>

      <main className="min-h-[calc(100vh-64px)] flex items-start justify-center pt-space-xl pb-space-xl px-gutter bg-gradient-to-b from-background to-surface-container">
        <div className="w-full max-w-2xl">
          <div className="rounded-xl p-space-md md:p-space-lg shadow-sm bg-surface-container-lowest border border-outline-variant/30">
            <div className="mb-space-lg">
              <h1 className="text-headline-lg text-primary mb-2">Pick the role that excites you</h1>
              <p className="text-body-md text-on-surface-variant">
                Based on your skills, experience, and interests, here are three roles that could
                be a strong fit. Choose the one you like best and we&apos;ll build your roadmap
                around it.
              </p>
            </div>

            {isInitialLoad && (
              <div className="py-space-xl text-center space-y-space-sm">
                <div className="w-14 h-14 mx-auto rounded-full bg-surface-container flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-3xl animate-spin">
                    progress_activity
                  </span>
                </div>
                <p className="text-body-md text-on-surface-variant">
                  Finding roles that fit you...
                </p>
              </div>
            )}

            {error && (
              <div className="py-space-lg text-center space-y-space-sm">
                <div className="w-14 h-14 mx-auto rounded-full bg-error-container flex items-center justify-center text-error">
                  <span className="material-symbols-outlined text-3xl">error</span>
                </div>
                <p className="text-body-md text-on-surface-variant" role="alert">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={() => fetchRoles(profile, seen)}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white text-label-md hover:opacity-90 transition-opacity shadow-md disabled:opacity-40"
                >
                  {isPending ? "Retrying..." : "Try Again"}
                </button>
              </div>
            )}

            {roles.length > 0 && (
              <div className="space-y-space-lg">
                <div
                  className={`grid grid-cols-1 gap-space-sm transition-opacity ${
                    isPending ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {roles.map((role, index) => (
                    <label
                      key={role.title}
                      className="relative flex items-start gap-space-sm p-4 rounded-lg border border-outline-variant bg-surface-container-lowest cursor-pointer hover:border-secondary transition-colors has-[:checked]:border-secondary has-[:checked]:bg-surface-variant/30"
                    >
                      <input
                        className="sr-only peer"
                        type="radio"
                        name="target-role"
                        checked={selected === role.title}
                        onChange={() => choose(role.title)}
                      />
                      <div className="flex flex-col gap-1 flex-1">
                        <span className="text-label-sm text-secondary uppercase tracking-wider">
                          Option {index + 1}
                        </span>
                        <span className="text-headline-md text-primary">{role.title}</span>
                        <span className="text-body-md text-on-surface-variant">
                          {role.whyItFits}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-secondary opacity-0 peer-checked:opacity-100">
                        check_circle
                      </span>
                    </label>
                  ))}
                </div>

                <div className="bg-surface-container rounded-lg p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                  <div>
                    <h2 className="text-label-md text-primary">Not seeing the right fit?</h2>
                    <p className="text-label-sm text-on-surface-variant">
                      We can suggest three different roles.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fetchRoles(profile, seen)}
                    disabled={isPending}
                    className="flex items-center justify-center gap-2 px-6 py-2 border border-secondary text-secondary rounded-lg text-label-md font-bold hover:bg-secondary-container hover:text-on-secondary-container transition-all disabled:opacity-40 whitespace-nowrap"
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isPending ? "animate-spin" : ""
                      }`}
                    >
                      refresh
                    </span>
                    {isPending ? "Finding more..." : "Show me different roles"}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-space-lg mt-space-lg border-t border-outline-variant/30">
              <Link
                href="/onboarding/step-4"
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-primary text-label-md hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                Back
              </Link>
              <button
                type="button"
                onClick={confirm}
                disabled={!selected || isPending}
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white text-label-md hover:opacity-90 transition-opacity shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Build My Roadmap
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
