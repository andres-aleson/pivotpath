import Link from "next/link";
import { and, desc, eq, like, or } from "drizzle-orm";
import { db, transitionStory } from "@/lib/db";
import { AppShell } from "@/components/AppShell";
import { INDUSTRY_OPTIONS } from "@/lib/onboarding/schema";
import { initials } from "@/lib/stories/initials";

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string; q?: string }>;
}) {
  const { industry, q } = await searchParams;

  const stories = await db.query.transitionStory.findMany({
    where: and(
      eq(transitionStory.isPublished, true),
      industry ? eq(transitionStory.industry, industry) : undefined,
      q
        ? or(
            like(transitionStory.displayName, `%${q}%`),
            like(transitionStory.fromRole, `%${q}%`),
            like(transitionStory.toRole, `%${q}%`)
          )
        : undefined
    ),
    orderBy: desc(transitionStory.publishedAt),
  });

  return (
    <AppShell active="stories">
      <div className="max-w-container-max mx-auto px-gutter py-space-lg">
        <section className="mb-space-lg flex flex-col md:flex-row gap-gutter items-start md:items-center justify-between">
          <div>
            <h1 className="text-headline-lg text-primary mb-2">Success Stories &amp; Mentors</h1>
            <p className="text-on-surface-variant text-body-md">
              Connect with people who've made this exact transition.
            </p>
          </div>
          <form className="flex gap-space-sm w-full md:w-auto" action="/stories">
            {industry && <input type="hidden" name="industry" value={industry} />}
            <div className="relative flex-1 md:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 rounded-full border border-outline-variant bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-secondary text-body-md"
                placeholder="Search stories..."
                type="text"
                name="q"
                defaultValue={q}
              />
            </div>
          </form>
        </section>

        <section className="mb-space-md flex flex-wrap gap-base items-center">
          <span className="text-label-md text-on-surface-variant mr-2">Filter by industry:</span>
          <Link
            href={q ? `/stories?q=${encodeURIComponent(q)}` : "/stories"}
            className={`px-4 py-2 rounded-full border font-label-md transition-colors ${
              !industry
                ? "border-secondary text-secondary bg-secondary-container/10"
                : "border-outline-variant hover:border-secondary"
            }`}
          >
            All
          </Link>
          {INDUSTRY_OPTIONS.map((option) => {
            const params = new URLSearchParams();
            params.set("industry", option);
            if (q) params.set("q", q);
            return (
              <Link
                key={option}
                href={`/stories?${params.toString()}`}
                className={`px-4 py-2 rounded-full border font-label-md transition-colors ${
                  industry === option
                    ? "border-secondary text-secondary bg-secondary-container/10"
                    : "border-outline-variant hover:border-secondary"
                }`}
              >
                {option}
              </Link>
            );
          })}
        </section>

        {stories.length === 0 ? (
          <div className="text-center py-space-xl text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-base block">group_off</span>
            No stories match yet — try a different filter.
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {stories.map((story) => (
              <div
                key={story.id}
                className="rounded-xl p-space-md flex flex-col border border-outline-variant bg-surface-container-lowest hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-space-md mb-space-md">
                  {story.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={story.photoUrl}
                      alt={story.displayName}
                      className="w-16 h-16 rounded-lg shrink-0 object-cover border border-outline-variant"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg shrink-0 bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-headline-md">
                      {initials(story.displayName)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-headline-md text-primary leading-tight">
                      {story.displayName}
                    </h4>
                    <p className="text-label-md text-on-surface-variant">{story.toRole}</p>
                    <div className="mt-2 inline-flex items-center px-2 py-0.5 bg-tertiary-container/10 text-on-tertiary-fixed-variant rounded text-xs font-bold uppercase tracking-wider">
                      Transitioned from: <span className="text-on-surface ml-1">{story.fromRole}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-space-lg">
                  <h5 className="text-label-sm text-secondary uppercase mb-1">Tips for you</h5>
                  <p className="text-body-md text-on-surface-variant line-clamp-3">{story.tips}</p>
                </div>
                <div className="mt-auto flex gap-base">
                  <Link
                    href={`/stories/${story.id}`}
                    className="flex-1 bg-primary text-white py-2 rounded-lg text-label-md text-center hover:opacity-90 transition-colors"
                  >
                    View Story
                  </Link>
                  <button
                    type="button"
                    disabled
                    title="Messaging is coming soon"
                    className="flex-1 border border-secondary text-secondary py-2 rounded-lg text-label-md flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[18px]">mail</span> Message
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </AppShell>
  );
}
