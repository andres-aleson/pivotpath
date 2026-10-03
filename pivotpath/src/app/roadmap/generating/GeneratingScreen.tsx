"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { generateRoadmap } from "@/app/roadmap/actions";
import { getJourney, setJourney } from "@/lib/journey/store";
import { step1Schema, step2Schema, step3Schema } from "@/lib/onboarding/schema";
import type { OnboardingProfile } from "@/lib/journey/types";

export function GeneratingScreen() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const hasStarted = useRef(false);

  function run() {
    const journey = getJourney();
    if (journey.roadmap) {
      router.replace("/roadmap");
      return;
    }

    const profile = journey.profile ?? {};
    const isComplete =
      step1Schema.safeParse(profile).success &&
      step2Schema.safeParse(profile).success &&
      step3Schema.safeParse(profile).success;
    if (!isComplete || !journey.onboardingCompletedAt) {
      router.replace("/onboarding/step-1");
      return;
    }

    const targetRole = profile.stillDecidingRole
      ? journey.selectedTargetRole
      : profile.targetRole;
    if (!targetRole) {
      router.replace("/roadmap/suggestions");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await generateRoadmap(profile as OnboardingProfile, targetRole);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      setJourney({
        roadmap: {
          targetRole,
          milestones: result.data.milestones.map((m, index) => ({
            id: crypto.randomUUID(),
            title: m.title,
            description: m.description,
            status: index === 0 ? "in_progress" : "todo",
            completedAt: null,
          })),
          transitionCompletedAt: null,
        },
      });
      router.push("/roadmap");
    });
  }

  useEffect(() => {
    // React Strict Mode double-invokes effects in dev — guard so generation
    // (a real, billed API call) only ever fires once per mount.
    if (hasStarted.current) return;
    hasStarted.current = true;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-gutter bg-gradient-to-b from-background to-surface-container">
      <div className="max-w-lg w-full text-center space-y-space-md rounded-xl p-space-lg shadow-sm bg-surface-container-lowest border border-outline-variant/30">
        {error ? (
          <>
            <div className="w-14 h-14 mx-auto rounded-full bg-error-container flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-3xl">error</span>
            </div>
            <h1 className="text-headline-lg text-primary">Something went wrong</h1>
            <p className="text-body-md text-on-surface-variant">{error}</p>
            <button
              onClick={run}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white text-label-md hover:opacity-90 transition-opacity shadow-md disabled:opacity-40"
            >
              {isPending ? "Retrying..." : "Try Again"}
            </button>
          </>
        ) : (
          <>
            <div className="w-14 h-14 mx-auto rounded-full bg-surface-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-3xl animate-spin">
                progress_activity
              </span>
            </div>
            <h1 className="text-headline-lg text-primary">Building your roadmap...</h1>
            <p className="text-body-md text-on-surface-variant">
              We&apos;re mapping out the steps from where you are today to where you want to be.
              This usually takes a few seconds.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
