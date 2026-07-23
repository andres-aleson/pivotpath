import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/onboarding/data";

export default async function OnboardingCompletePage() {
  const profile = await getCurrentProfile();
  if (!profile?.onboardingCompletedAt) redirect("/onboarding");

  return (
    <main className="min-h-screen flex items-center justify-center px-gutter bg-gradient-to-b from-background to-surface-container">
      <div className="max-w-lg w-full text-center space-y-space-md rounded-xl p-space-lg shadow-sm bg-surface-container-lowest border border-outline-variant/30">
        <div className="w-14 h-14 mx-auto rounded-full bg-surface-container flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined text-3xl">check_circle</span>
        </div>
        <h1 className="text-headline-lg text-primary">You&apos;re all set.</h1>
        <p className="text-body-md text-on-surface-variant">
          Your answers are saved. Roadmap generation isn&apos;t built yet — that&apos;s the next
          feature we&apos;ll add, and it'll pick up right where this left off.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white text-label-md hover:opacity-90 transition-opacity shadow-md"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
