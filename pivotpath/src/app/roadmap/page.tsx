import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/onboarding/session";
import { MilestoneStatusControl } from "@/app/roadmap/components/MilestoneStatusControl";
import { restartQuestionnaire } from "@/app/onboarding/actions";

const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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

  const total = roadmap.milestones.length;
  const completed = roadmap.milestones.filter((m) => m.status === "done").length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const dashOffset = CIRCUMFERENCE * (1 - percent / 100);
  // The first not-yet-started milestone gets the "next step" treatment;
  // later ones read as further-out/locked, matching the mockup's hierarchy.
  const nextUpId = roadmap.milestones.find((m) => m.status === "todo")?.id;

  return (
    <>
      {/* Top Nav Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface shadow-sm h-16 flex justify-between items-center px-gutter w-full">
        <Link href="/" className="text-headline-md font-bold text-primary">
          PivotPath
        </Link>
        <div className="hidden md:flex items-center gap-space-lg text-body-md">
          <span className="text-on-surface-variant/50 cursor-default">Dashboard</span>
          <span className="text-secondary border-b-2 border-secondary pb-1">Roadmap</span>
          <span className="text-on-surface-variant/50 cursor-default">Mentors</span>
        </div>
        <div className="flex items-center gap-space-md">
          <span className="material-symbols-outlined text-on-surface-variant/50">notifications</span>
          <span className="material-symbols-outlined text-on-surface-variant/50">account_circle</span>
        </div>
      </nav>

      {/* Side Nav Bar */}
      <aside className="hidden md:flex flex-col h-screen p-base fixed left-0 top-0 z-40 w-64 bg-surface-container-low shadow-md pt-20">
        <div className="flex flex-col gap-space-xs mb-space-lg px-base">
          <h2 className="text-headline-md font-bold text-primary">PivotPath</h2>
          <p className="text-label-md text-on-surface-variant">Career Transition</p>
        </div>
        <nav className="flex-1 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-space-md px-space-md py-3 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg text-label-md"
          >
            <span className="material-symbols-outlined">home</span>
            <span>Home</span>
          </Link>
          <span className="flex items-center gap-space-md px-space-md py-3 bg-secondary-container text-on-secondary-container rounded-lg font-bold text-label-md">
            <span className="material-symbols-outlined">route</span>
            <span>Roadmap</span>
          </span>
          <span className="flex items-center gap-space-md px-space-md py-3 text-on-surface-variant/50 cursor-default rounded-lg text-label-md">
            <span className="material-symbols-outlined">group</span>
            <span>Mentors</span>
          </span>
          <span className="flex items-center gap-space-md px-space-md py-3 text-on-surface-variant/50 cursor-default rounded-lg text-label-md">
            <span className="material-symbols-outlined">stars</span>
            <span>Success Stories</span>
          </span>
        </nav>
        <div className="mt-auto border-t border-outline-variant pt-base">
          <form action={restartQuestionnaire}>
            <button
              type="submit"
              className="w-full py-3 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-all"
            >
              Retake Questionnaire
            </button>
          </form>
        </div>
      </aside>

      <main className="md:ml-64 pt-16 pb-20 md:pb-0 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-gutter py-space-lg">
          <header className="mb-space-lg">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
              <div>
                <nav className="flex items-center gap-space-xs text-label-md text-on-surface-variant mb-base">
                  <span>My Roadmap</span>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span className="text-secondary font-bold">{roadmap.targetRole}</span>
                </nav>
                <h1 className="text-headline-xl text-primary">{roadmap.targetRole}</h1>
                <p className="text-body-lg text-on-surface-variant mt-space-xs">
                  Your personalized path, generated from your questionnaire answers.
                </p>
              </div>
              <div className="flex items-center gap-space-md bg-surface-container rounded-xl p-space-md shadow-sm border border-outline-variant/30 flex-shrink-0">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90">
                    <circle
                      className="text-outline-variant"
                      cx="32"
                      cy="32"
                      fill="transparent"
                      r={RADIUS}
                      stroke="currentColor"
                      strokeWidth="6"
                    />
                    <circle
                      className="text-secondary"
                      cx="32"
                      cy="32"
                      fill="transparent"
                      r={RADIUS}
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={dashOffset}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-label-md">
                    {percent}%
                  </div>
                </div>
                <div>
                  <span className="text-label-md block">Overall Progress</span>
                  <span className="text-body-md font-bold text-primary">
                    {completed} of {total} Milestones Completed
                  </span>
                </div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
            <div className="lg:col-span-8 space-y-space-md">
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
        </div>
      </main>

      {/* Bottom Nav Bar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 md:hidden bg-surface shadow-[0_-4px_6px_-1px_rgba(9,20,38,0.05)] rounded-t-xl">
        <Link href="/" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-secondary">
          <span className="material-symbols-outlined">home</span>
          <span className="text-label-sm">Home</span>
        </Link>
        <span className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1">
          <span className="material-symbols-outlined">route</span>
          <span className="text-label-sm">Roadmap</span>
        </span>
        <span className="flex flex-col items-center justify-center text-on-surface-variant/50">
          <span className="material-symbols-outlined">group</span>
          <span className="text-label-sm">Mentors</span>
        </span>
        <form action={restartQuestionnaire}>
          <button
            type="submit"
            className="flex flex-col items-center justify-center text-on-surface-variant hover:text-secondary"
          >
            <span className="material-symbols-outlined">refresh</span>
            <span className="text-label-sm">Retake</span>
          </button>
        </form>
      </nav>
    </>
  );
}
