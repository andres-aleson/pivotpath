"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShareStoryForm } from "@/app/stories/share/ShareStoryForm";
import { getJourney } from "@/lib/journey/store";

type Defaults = {
  displayName: string;
  photoDataUrl?: string;
  fromRole: string;
  toRole: string;
  industry?: string;
  stepsTaken: string;
  tips: string;
};

export default function ShareStoryPage() {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<Defaults | null>(null);
  const [storyId, setStoryId] = useState<string | undefined>(undefined);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const journey = getJourney();
    if (!journey.roadmap?.transitionCompletedAt) {
      router.replace("/roadmap");
      return;
    }

    const industries = journey.profile?.industriesOfInterest ?? [];
    const draftStepsTaken =
      journey.story?.stepsTaken ??
      journey.roadmap.milestones.map((m) => `${m.title} — ${m.description}`).join("\n\n");

    setStoryId(journey.story?.id);
    setIsEdit(Boolean(journey.story));
    setDefaultValues({
      displayName: journey.story?.displayName ?? "",
      photoDataUrl: journey.story?.photoDataUrl ?? "",
      fromRole: journey.story?.fromRole ?? journey.profile?.currentJobTitle ?? "",
      toRole: journey.story?.toRole ?? journey.roadmap.targetRole,
      industry: journey.story?.industry ?? industries[0],
      stepsTaken: draftStepsTaken,
      tips: journey.story?.tips ?? "",
    });
  }, [router]);

  if (!defaultValues) return null;

  return (
    <main className="min-h-screen flex items-start justify-center px-gutter py-space-xl bg-gradient-to-b from-background to-surface-container">
      <div className="w-full max-w-2xl">
        <div className="rounded-xl p-space-md md:p-space-lg shadow-sm bg-surface-container-lowest border border-outline-variant/30">
          <div className="mb-space-lg">
            <h1 className="text-headline-lg text-primary mb-2">
              {isEdit ? "Edit Your Story" : "Share Your Story"}
            </h1>
            <p className="text-body-md text-on-surface-variant">
              We've pulled in what we already know from your questionnaire and roadmap — edit,
              remove, or add anything before it goes public.
            </p>
          </div>
          <ShareStoryForm defaultValues={defaultValues} storyId={storyId} />
        </div>
      </div>
    </main>
  );
}
