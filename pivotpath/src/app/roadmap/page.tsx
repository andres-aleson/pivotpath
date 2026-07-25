import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/onboarding/session";
import { MilestoneStatusControl } from "@/app/roadmap/components/MilestoneStatusControl";
import { markTransitionComplete } from "@/app/roadmap/actions";
import { AppShell } from "@/components/AppShell";

const STATUS_ICON: Record<string, string> = {
  done: "check_circle",
  in_progress: "sync",
  todo: "flag",
};

const DATE_FORMAT: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };

export default async function RoadmapPage() {
  const sessionId = await getSessionId();
  if (!sessionId) redirect("/onboarding");

  const profile = await prisma.userProfile.findUnique({ where: { sessionId } });
  if (!profile?.onboardingCompletedAt) redirect("/onboarding");

  const roadmap = await prisma.roadmap.findUnique({
    where: { sessionId },
    include: { milestones: { orderBy: { order: "asc" } } },
  });
  if (!roadmap) redirect("/roadmap/generating");

  const story = roadmap.transitionCompletedAt
    ? await prisma.transitionStory.findUnique({ where: { sessionId } })
    : null;

  const total = roadmap.milestones.length;
  const completed = roadmap.milestones.filter((m) => m.status === "done").length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  // The first not-yet-started milestone gets the "next step" treatment;
  // later ones read as further-out/locked, matching the mockup's hierarchy.
  const nextUpId = roadmap.milestones.find((m) => m.status === "todo")?.id;

  return (
    <AppShell active="dashboard">
      <div className="max-w-container-max mx-auto px-gutter py-space-lg">
        <section className="mb-space-xl">
          <h1 className="text-headline-xl-mobile md:text-headline-xl text-primary mb-space-xs">
            Welcome back
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Here&apos;s your path forward. You&apos;ve completed {percent}% of your transition to{" "}
            <span className="font-bold text-primary">{roadmap.targetRole}</span>.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Career Roadmap (8 columns) */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30">
            <div className="flex justify-between items-center mb-space-lg">
              <h2 className="text-headline-md text-primary">Career Roadmap</h2>
              <span className="bg-surface-container text-secondary px-3 py-1 rounded-full text-label-sm uppercase tracking-wider">
                {completed}/{total} Milestones
              </span>
            </div>

            <div className="space-y-space-md">
              {roadmap.milestones.map((milestone, index) => {
                const isLast = index === roadmap.milestones.length - 1;
                const isNextUp = milestone.id === nextUpId;

                return (
                  <section
                    key={milestone.id}
                    className={`relative pl-12 step-line ${isLast ? "step-line-last" : ""}`}
                  >
                    {milestone.status === "done" && (
                      <>
                        <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center z-10 shadow-sm">
                          <span
                            className="material-symbols-outlined"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            {STATUS_ICON.done}
                          </span>
                        </div>
                        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-md shadow-sm hover:shadow-md transition-all">
                          <h3 className="text-headline-md text-primary">{milestone.title}</h3>
                          <span className="inline-block mt-1 mb-base text-label-md text-on-tertiary-container bg-tertiary-fixed/30 px-base py-0.5 rounded-full">
                            Completed
                            {milestone.completedAt
                              ? ` ${milestone.completedAt.toLocaleDateString("en-US", DATE_FORMAT)}`
                              : ""}
                          </span>
                          <p className="text-body-md text-on-surface-variant">{milestone.description}</p>
                          <div className="mt-space-md pt-space-md border-t border-outline-variant/30 flex justify-end">
                            <MilestoneStatusControl milestoneId={milestone.id} status="done" />
                          </div>
                        </div>
                      </>
                    )}

                    {milestone.status === "in_progress" && (
                      <>
                        <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center z-10 shadow-sm animate-pulse">
                          <span className="material-symbols-outlined">{STATUS_ICON.in_progress}</span>
                        </div>
                        <div className="bg-surface border-2 border-secondary rounded-xl p-space-md shadow-md relative overflow-hidden">
                          <span className="absolute top-0 right-0 bg-secondary text-on-secondary px-base py-1 rounded-bl-xl rounded-tr-lg text-label-sm font-bold">
                            ACTIVE
                          </span>
                          <h3 className="text-headline-md text-primary mb-space-xs pr-20">
                            {milestone.title}
                          </h3>
                          <p className="text-body-md text-on-surface-variant">{milestone.description}</p>
                          <div className="mt-space-md pt-space-md border-t border-outline-variant/30 flex justify-end">
                            <MilestoneStatusControl milestoneId={milestone.id} status="in_progress" />
                          </div>
                        </div>
                      </>
                    )}

                    {milestone.status === "todo" && (
                      <>
                        <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center z-10 border border-outline-variant">
                          <span className="material-symbols-outlined">{STATUS_ICON.todo}</span>
                        </div>
                        <div
                          className={`bg-surface-container-lowest border border-outline-variant border-dashed rounded-xl p-space-md shadow-sm transition-all ${
                            isNextUp
                              ? "opacity-90 hover:opacity-100 hover:border-solid hover:border-secondary"
                              : "opacity-60"
                          }`}
                        >
                          <h3 className="text-headline-md text-primary">{milestone.title}</h3>
                          <p className="text-body-md text-on-surface-variant mt-space-xs">
                            {milestone.description}
                          </p>
                          <div className="mt-space-md pt-space-md border-t border-outline-variant/30 flex justify-end">
                            <MilestoneStatusControl milestoneId={milestone.id} status="todo" />
                          </div>
                        </div>
                      </>
                    )}
                  </section>
                );
              })}
            </div>
          </div>

          {/* Financial Guide (4 columns) */}
          <aside className="lg:col-span-4 bg-surface-container-high rounded-xl p-space-md shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-space-lg">
              <span className="material-symbols-outlined text-secondary">account_balance_wallet</span>
              <h2 className="text-headline-md text-primary">Financial Guide</h2>
            </div>
            <p className="text-body-md text-on-surface-variant flex-grow">
              Answer a few questions about your income, expenses, and savings and we&apos;ll tailor
              budget and runway guidance to your transition.
            </p>
            <Link
              href="/financial"
              className="mt-space-lg w-full text-center py-3 border-2 border-secondary text-secondary rounded-lg font-bold hover:bg-secondary hover:text-white transition-all"
            >
              Financial Assistance Questionnaire
            </Link>
          </aside>
        </div>

        <div className="mt-space-lg bg-surface-container rounded-xl p-space-md border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          {!roadmap.transitionCompletedAt && (
            <>
              <div>
                <h3 className="text-headline-md text-primary">Landed the new role?</h3>
                <p className="text-body-md text-on-surface-variant mt-1">
                  Mark your transition complete whenever you're ready — you don't need every
                  milestone checked off first.
                </p>
              </div>
              <form action={markTransitionComplete}>
                <button
                  type="submit"
                  className="px-lg py-3 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-all whitespace-nowrap"
                >
                  Completed Transition
                </button>
              </form>
            </>
          )}
          {roadmap.transitionCompletedAt && !story && (
            <>
              <div>
                <h3 className="text-headline-md text-primary">You did it!</h3>
                <p className="text-body-md text-on-surface-variant mt-1">
                  Share your story to help the next person navigating this transition.
                </p>
              </div>
              <Link
                href="/stories/share"
                className="px-lg py-3 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-all whitespace-nowrap text-center"
              >
                Share My Story
              </Link>
            </>
          )}
          {roadmap.transitionCompletedAt && story && (
            <>
              <div>
                <h3 className="text-headline-md text-primary">Your story is live</h3>
                <p className="text-body-md text-on-surface-variant mt-1">
                  Thanks for helping the next person navigating this transition.
                </p>
              </div>
              <div className="flex gap-space-sm">
                <Link
                  href={`/stories/${story.id}`}
                  className="px-lg py-3 border border-secondary text-secondary rounded-lg font-bold hover:bg-secondary-container hover:text-on-secondary-container transition-all whitespace-nowrap text-center"
                >
                  View Story
                </Link>
                <Link
                  href="/stories/share"
                  className="px-lg py-3 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-all whitespace-nowrap text-center"
                >
                  Edit Story
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
