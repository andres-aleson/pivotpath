import Link from "next/link";
import { restartQuestionnaire } from "@/app/onboarding/actions";

type NavKey = "roadmap" | "stories";

const NAV_LINK = "flex items-center gap-space-md px-space-md py-3 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg text-label-md";
const NAV_LINK_ACTIVE = "flex items-center gap-space-md px-space-md py-3 bg-secondary-container text-on-secondary-container rounded-lg font-bold text-label-md";

export function AppShell({ active, children }: { active: NavKey; children: React.ReactNode }) {
  return (
    <>
      {/* Top Nav Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface shadow-sm h-16 flex justify-between items-center px-gutter w-full">
        <Link href="/" className="text-headline-md font-bold text-primary">
          PivotPath
        </Link>
        <div className="hidden md:flex items-center gap-space-lg text-body-md">
          <span className="text-on-surface-variant/50 cursor-default">Dashboard</span>
          <Link
            href="/roadmap"
            className={
              active === "roadmap"
                ? "text-secondary border-b-2 border-secondary pb-1"
                : "text-on-surface-variant hover:text-secondary transition-colors"
            }
          >
            Roadmap
          </Link>
          <Link
            href="/stories"
            className={
              active === "stories"
                ? "text-secondary border-b-2 border-secondary pb-1"
                : "text-on-surface-variant hover:text-secondary transition-colors"
            }
          >
            Mentors
          </Link>
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
          <Link href="/" className={NAV_LINK}>
            <span className="material-symbols-outlined">home</span>
            <span>Home</span>
          </Link>
          <Link href="/roadmap" className={active === "roadmap" ? NAV_LINK_ACTIVE : NAV_LINK}>
            <span className="material-symbols-outlined">route</span>
            <span>Roadmap</span>
          </Link>
          <Link href="/stories" className={active === "stories" ? NAV_LINK_ACTIVE : NAV_LINK}>
            <span className="material-symbols-outlined">group</span>
            <span>Mentors</span>
          </Link>
          <Link href="/stories" className={active === "stories" ? NAV_LINK_ACTIVE : NAV_LINK}>
            <span className="material-symbols-outlined">stars</span>
            <span>Success Stories</span>
          </Link>
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

      <main className="md:ml-64 pt-16 pb-20 md:pb-0 min-h-screen bg-background">{children}</main>

      {/* Bottom Nav Bar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 md:hidden bg-surface shadow-[0_-4px_6px_-1px_rgba(9,20,38,0.05)] rounded-t-xl">
        <Link href="/" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-secondary">
          <span className="material-symbols-outlined">home</span>
          <span className="text-label-sm">Home</span>
        </Link>
        <Link
          href="/roadmap"
          className={
            active === "roadmap"
              ? "flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1"
              : "flex flex-col items-center justify-center text-on-surface-variant hover:text-secondary"
          }
        >
          <span className="material-symbols-outlined">route</span>
          <span className="text-label-sm">Roadmap</span>
        </Link>
        <Link
          href="/stories"
          className={
            active === "stories"
              ? "flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1"
              : "flex flex-col items-center justify-center text-on-surface-variant hover:text-secondary"
          }
        >
          <span className="material-symbols-outlined">group</span>
          <span className="text-label-sm">Mentors</span>
        </Link>
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
