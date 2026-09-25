import Link from "next/link";
import {
  FINANCIAL_CONCERN_OPTIONS,
  TIMELINE_URGENCY_OPTIONS,
} from "@/lib/onboarding/schema";
import { submitOnboarding } from "@/app/onboarding/actions";
import type { UserProfile } from "@/lib/db";

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">
        {label}
      </span>
      <span className="text-body-md text-primary">{value || "—"}</span>
    </div>
  );
}

function ReviewSection({
  title,
  editHref,
  children,
}: {
  title: string;
  editHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-outline-variant p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-label-md text-primary uppercase tracking-wider">{title}</h2>
        <Link href={editHref} className="text-label-sm text-secondary hover:underline">
          Edit
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

export function ReviewStep({ profile }: { profile: UserProfile }) {
  const skills = (profile.topSkills as string[] | null) ?? [];
  const industries = (profile.industriesOfInterest as string[] | null) ?? [];
  const financialConcern = FINANCIAL_CONCERN_OPTIONS.find(
    (o) => o.value === profile.financialConcernType
  )?.label;
  const timeline = TIMELINE_URGENCY_OPTIONS.find(
    (o) => o.value === profile.timelineUrgency
  )?.label;

  return (
    <div className="space-y-space-lg">
      <ReviewSection title="Your Profile" editHref="/onboarding/step-1">
        <ReviewRow label="Current job title" value={profile.currentJobTitle ?? ""} />
        <ReviewRow label="Top skills" value={skills.join(", ")} />
        <ReviewRow label="Financial concern" value={financialConcern ?? ""} />
        <ReviewRow label="Industries of interest" value={industries.join(", ")} />
      </ReviewSection>

      <ReviewSection title="Career Goal" editHref="/onboarding/step-2">
        <ReviewRow
          label="Target role"
          value={profile.stillDecidingRole ? "Still deciding" : profile.targetRole ?? ""}
        />
        <ReviewRow label="Motivation" value={profile.transitionMotivation ?? ""} />
      </ReviewSection>

      <ReviewSection title="Background & Timeline" editHref="/onboarding/step-3">
        <ReviewRow label="Experience" value={profile.yearsExperience ?? ""} />
        <ReviewRow label="Education" value={profile.educationLevel ?? ""} />
        <ReviewRow label="Weekly time available" value={profile.weeklyTimeCommitment ?? ""} />
        <ReviewRow label="Timeline" value={timeline ?? ""} />
      </ReviewSection>

      <form
        action={submitOnboarding}
        className="flex items-center justify-between pt-space-lg border-t border-outline-variant/30"
      >
        <Link
          href="/onboarding/step-3"
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-primary text-label-md hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back
        </Link>
        <button
          type="submit"
          className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white text-label-md hover:opacity-90 transition-opacity shadow-md"
        >
          Submit
          <span className="material-symbols-outlined text-[20px]">check</span>
        </button>
      </form>
    </div>
  );
}
