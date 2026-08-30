import Link from "next/link";
import { restartQuestionnaire } from "@/app/onboarding/actions";
import { logOut } from "@/lib/auth/actions";
import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

type NavKey = "dashboard" | "stories" | "financial";

const NAV_LINK = "flex items-center gap-space-md px-space-md py-3 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg text-label-md";
const NAV_LINK_ACTIVE = "flex items-center gap-space-md px-space-md py-3 bg-secondary-container text-on-secondary-container rounded-lg font-bold text-label-md";

export async function AppShell({
  active,
  children,
}: {
  active?: NavKey;
  children: React.ReactNode;
}) {
  const userId = await getCurrentUserId();
  const hasFinancialProfile = userId
    ? Boolean(
        await prisma.financialProfile.findUnique({ where: { userId }, select: { id: true } })
      )
    : false;
  const financialHref = hasFinancialProfile ? "/financial/plan" : "/financial";

  return (
    <>
      {/* Top Nav Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface shadow-sm h-16 flex justify-between items-center px-gutter w-full">
        <Link href="/" className="text-headline-md font-bold text-primary">
          PivotPath
        </Link>
        <div className="flex items-center gap-space-md">
          <span className="material-symbols-outlined text-on-surface-variant/50">notifications</span>
          <form action={logOut}>
            <button
              type="submit"
              title="Log out"
              className="material-symbols-outlined text-on-surface-variant/50 hover:text-secondary transition-colors"
            >
              account_circle
            </button>
          </form>
        </div>
      </nav>

      {/* Side Nav Bar */}
      <aside className="hidden md:flex flex-col h-screen p-base fixed left-0 top-0 z-40 w-64 bg-surface-container-low shadow-md pt-20">
        <nav className="flex-1 space-y-1">
          <Link href="/" className={NAV_LINK}>
            <span className="material-symbols-outlined">home</span>
            <span>Home</span>
          </Link>
          <Link href="/roadmap" className={active === "dashboard" ? NAV_LINK_ACTIVE : NAV_LINK}>
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link href="/stories" className={active === "stories" ? NAV_LINK_ACTIVE : NAV_LINK}>
            <span className="material-symbols-outlined">stars</span>
            <span>Success Stories</span>
          </Link>
          <Link href={financialHref} className={active === "financial" ? NAV_LINK_ACTIVE : NAV_LINK}>
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span>Financial</span>
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
            active === "dashboard"
              ? "flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1"
              : "flex flex-col items-center justify-center text-on-surface-variant hover:text-secondary"
          }
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-label-sm">Dashboard</span>
        </Link>
        <Link
          href="/stories"
          className={
            active === "stories"
              ? "flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1"
              : "flex flex-col items-center justify-center text-on-surface-variant hover:text-secondary"
          }
        >
          <span className="material-symbols-outlined">stars</span>
          <span className="text-label-sm">Stories</span>
        </Link>
        <Link
          href={financialHref}
          className={
            active === "financial"
              ? "flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1"
              : "flex flex-col items-center justify-center text-on-surface-variant hover:text-secondary"
          }
        >
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="text-label-sm">Financial</span>
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
