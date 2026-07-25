import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/onboarding/session";

export default async function TransitionCompletePage() {
  const sessionId = await getSessionId();
  if (!sessionId) redirect("/onboarding");

  const roadmap = await prisma.roadmap.findUnique({ where: { sessionId } });
  if (!roadmap?.transitionCompletedAt) redirect("/roadmap");

  const story = await prisma.transitionStory.findUnique({ where: { sessionId } });

  return (
    <main className="min-h-screen flex items-center justify-center px-gutter py-space-xl bg-gradient-to-b from-background to-surface-container">
      <div className="w-full max-w-2xl text-center">
        <div className="w-20 h-20 mx-auto mb-space-md rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            celebration
          </span>
        </div>
        <h1 className="text-headline-xl text-primary mb-base">Congratulations!</h1>
        <p className="text-body-lg text-on-surface-variant mb-space-lg">
          You've completed your transition to <span className="font-bold text-primary">{roadmap.targetRole}</span>.
          That's a huge milestone — thanks for sticking with it.
        </p>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-md text-left">
          <h2 className="text-headline-md text-primary mb-2">
            {story ? "Your story is published" : "Would you like to publish your story?"}
          </h2>
          <p className="text-body-md text-on-surface-variant mb-space-md">
            {story
              ? "Other PivotPath users can find your story in Success Stories & Mentors, and it's yours to edit or take down anytime."
              : "Sharing your from-role, to-role, the steps you took, and a few tips helps the next person navigating this exact transition. You'll be able to review and edit everything before it's public, and you can unpublish it anytime — nothing is shared automatically."}
          </p>
          <div className="flex flex-col sm:flex-row gap-space-sm">
            <Link
              href={story ? `/stories/${story.id}` : "/stories/share"}
              className="flex-1 text-center px-8 py-3 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-all"
            >
              {story ? "View My Story" : "Share My Story"}
            </Link>
            <Link
              href="/roadmap"
              className="flex-1 text-center px-8 py-3 border border-outline-variant text-on-surface-variant rounded-lg font-bold hover:border-secondary hover:text-secondary transition-all"
            >
              {story ? "Back to Roadmap" : "Maybe Later"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
