import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/onboarding/session";
import { MilestoneStatusControl } from "@/app/roadmap/components/MilestoneStatusControl";

const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const STATUS_ICON: Record<string, string> = {
  done: "check_circle",
  in_progress: "sync",
  todo: "flag",
};

const STATUS_BADGE: Record<string, string> = {
  done: "Completed",
  in_progress: "Active",
  todo: "Upcoming",
};

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

  return (
    <>
      <header className="sticky top-0 w-full z-50 flex justify-between items-center px-gutter py-4 bg-surface/95 backdrop-blur-sm shadow-sm">
        <Link href="/" className="text-headline-md font-bold text-primary">
          PivotPath
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <span className="text-secondary font-bold border-b-2 border-secondary pb-1">
            Roadmap
          </span>
          <span className="text-on-surface-variant text-label-md">Mentors</span>
          <span className="text-on-surface-variant text-label-md">Resources</span>
        </nav>
      </header>

      <main className="min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-gutter py-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-lg">
            <div>
              <nav className="flex items-center gap-1 text-label-md text-on-surface-variant mb-2">
                <span>My Roadmap</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-secondary font-bold">{roadmap.targetRole}</span>
              </nav>
              <h1 className="text-headline-xl text-primary">{roadmap.targetRole}</h1>
              <p className="text-body-lg text-on-surface-variant mt-1">
                Your personalized path, generated from your questionnaire answers.
              </p>
            </div>
            <div className="flex items-center gap-md bg-surface-container rounded-xl p-md shadow-sm border border-outline-variant/30">
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

          <div className="max-w-3xl space-y-md">
            {roadmap.milestones.map((milestone) => (
              <section key={milestone.id} className="relative pl-12">
                <div
                  className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-sm ${
                    milestone.status === "done"
                      ? "bg-tertiary-fixed text-on-tertiary-fixed"
                      : milestone.status === "in_progress"
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-surface-container-high text-on-surface-variant border border-outline-variant"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined ${
                      milestone.status === "in_progress" ? "animate-spin" : ""
                    }`}
                    style={milestone.status === "done" ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {STATUS_ICON[milestone.status]}
                  </span>
                </div>
                <div
                  className={`rounded-xl p-md shadow-sm border ${
                    milestone.status === "in_progress"
                      ? "border-2 border-secondary bg-surface"
                      : "border-outline-variant bg-surface-container-lowest"
                  } ${milestone.status === "todo" ? "border-dashed opacity-90" : ""}`}
                >
                  <div className="flex justify-between items-start gap-md mb-2">
                    <div>
                      <h3 className="text-headline-md text-primary">{milestone.title}</h3>
                      <span
                        className={`inline-block mt-1 text-label-sm px-2 py-0.5 rounded-full ${
                          milestone.status === "done"
                            ? "text-on-tertiary-container bg-tertiary-fixed/30"
                            : milestone.status === "in_progress"
                              ? "text-on-secondary-container bg-secondary-container/60"
                              : "text-on-surface-variant bg-surface-container"
                        }`}
                      >
                        {STATUS_BADGE[milestone.status]}
                      </span>
                    </div>
                  </div>
                  <p className="text-body-md text-on-surface-variant">{milestone.description}</p>
                  <div className="mt-md pt-md border-t border-outline-variant/30 flex justify-end">
                    <MilestoneStatusControl milestoneId={milestone.id} status={milestone.status as "todo" | "in_progress" | "done"} />
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
