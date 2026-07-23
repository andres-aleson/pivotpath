"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { generateRoadmap } from "@/app/roadmap/actions";

export function GeneratingScreen() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const hasStarted = useRef(false);

  function run() {
    setError(null);
    startTransition(async () => {
      const result = await generateRoadmap();
      if (!result.ok) setError(result.error);
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
