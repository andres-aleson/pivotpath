import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, roadmap, transitionStory } from "@/lib/db";
import { getCurrentUserId } from "@/lib/current-user";

export default async function TransitionCompletePage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const roadmapData = await db.query.roadmap.findFirst({ where: eq(roadmap.userId, userId) });
  if (!roadmapData?.transitionCompletedAt) redirect("/roadmap");

  const story = await db.query.transitionStory.findFirst({ where: eq(transitionStory.userId, userId) });

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
          You've completed your transition to <span className="font-bold text-primary">{roadmapData.targetRole}</span>.
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
