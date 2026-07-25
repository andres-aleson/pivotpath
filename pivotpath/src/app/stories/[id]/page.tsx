import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/AppShell";
import { initials } from "@/lib/stories/initials";

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = await prisma.transitionStory.findUnique({ where: { id } });
  if (!story || !story.isPublished) notFound();

  return (
    <AppShell active="stories">
      <div className="max-w-container-max mx-auto px-gutter py-space-lg">
        <nav className="flex items-center gap-space-xs text-label-md text-on-surface-variant mb-space-md">
          <Link href="/stories" className="hover:text-secondary transition-colors">
            Success Stories &amp; Mentors
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-secondary font-bold">{story.displayName}</span>
        </nav>

        <div className="max-w-3xl">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-md md:p-space-lg shadow-sm">
            <div className="flex items-start gap-space-md mb-space-lg">
              {story.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={story.photoUrl}
                  alt={story.displayName}
                  className="w-20 h-20 rounded-lg shrink-0 object-cover border border-outline-variant"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg shrink-0 bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-headline-lg">
                  {initials(story.displayName)}
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-headline-xl text-primary leading-tight">{story.displayName}</h1>
                <p className="text-body-lg text-on-surface-variant mt-1">{story.toRole}</p>
                <div className="mt-2 inline-flex items-center px-2 py-0.5 bg-tertiary-container/10 text-on-tertiary-fixed-variant rounded text-xs font-bold uppercase tracking-wider">
                  Transitioned from: <span className="text-on-surface ml-1">{story.fromRole}</span>
                </div>
                <span className="ml-2 inline-block px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-label-sm">
                  {story.industry}
                </span>
              </div>
              <button
                type="button"
                disabled
                title="Messaging is coming soon"
                className="px-8 py-3 border border-secondary text-secondary rounded-lg font-bold flex items-center gap-2 opacity-50 cursor-not-allowed whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[18px]">mail</span> Message
              </button>
            </div>

            <div className="mb-space-lg">
              <h2 className="text-headline-md text-primary mb-base">The steps I took</h2>
              <p className="text-body-md text-on-surface-variant whitespace-pre-line">
                {story.stepsTaken}
              </p>
            </div>

            <div className="pt-space-md border-t border-outline-variant/30">
              <h2 className="text-headline-md text-primary mb-base">Tips for you</h2>
              <p className="text-body-md text-on-surface-variant whitespace-pre-line">
                {story.tips}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
