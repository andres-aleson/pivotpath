import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";
import { AppShell } from "@/components/AppShell";
import { calculateRunwayMonths } from "@/lib/financial/plan";
import {
  BUDGET_TIPS_BY_CONCERN,
  GENERAL_BUDGET_TIPS,
  INCOME_OPPORTUNITY_CATEGORIES,
} from "@/lib/financial/content";
import { FINANCIAL_CONCERN_OPTIONS } from "@/lib/onboarding/schema";

export default async function FinancialPlanPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const financialProfile = await prisma.financialProfile.findUnique({ where: { userId } });
  if (!financialProfile) redirect("/financial");

  const runwayMonths = calculateRunwayMonths(financialProfile);
  const concernLabel = FINANCIAL_CONCERN_OPTIONS.find(
    (o) => o.value === financialProfile.financialConcernType
  )?.label;
  const concernTips = BUDGET_TIPS_BY_CONCERN[financialProfile.financialConcernType] ?? [];

  return (
    <AppShell active="financial">
      <div className="max-w-container-max mx-auto px-gutter py-space-lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
          <div>
            <h1 className="text-headline-xl text-primary">Your Financial Plan</h1>
            <p className="text-body-lg text-on-surface-variant mt-space-xs">
              Based on the numbers you entered — informational only, never linked to a real
              account.
            </p>
          </div>
          <Link
            href="/financial"
            className="px-8 py-3 border border-outline-variant text-on-surface-variant rounded-lg font-bold hover:border-secondary hover:text-secondary transition-all whitespace-nowrap text-center"
          >
            Update My Numbers
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Runway (8 columns) */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30">
            <h2 className="text-headline-md text-primary mb-space-md">Runway</h2>
            {runwayMonths === null ? (
              <p className="text-body-lg text-primary">
                Your expected income covers your essential expenses — you're breaking even or
                better during this transition.
              </p>
            ) : (
              <>
                <div className="text-headline-xl text-secondary font-bold">
                  {runwayMonths.toFixed(1)}
                  <span className="text-headline-md text-on-surface-variant font-normal">
                    {" "}
                    months
                  </span>
                </div>
                <p className="text-body-md text-on-surface-variant mt-2">
                  At your current savings and monthly burn, that's how long you can cover
                  essential expenses without additional income.
                </p>
              </>
            )}

            <div className="mt-space-lg pt-space-md border-t border-outline-variant/30">
              <h3 className="text-label-md text-primary uppercase tracking-wider mb-space-sm">
                Budget tips {concernLabel ? `for ${concernLabel.toLowerCase()}` : ""}
              </h3>
              <ul className="space-y-space-sm">
                {[...concernTips, ...GENERAL_BUDGET_TIPS].map((tip) => (
                  <li key={tip} className="flex items-start gap-space-sm text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">
                      lightbulb
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Income opportunities (4 columns) */}
          <aside className="lg:col-span-4 bg-surface-container-high rounded-xl p-space-md shadow-sm">
            <div className="flex items-center gap-2 mb-space-md">
              <span className="material-symbols-outlined text-secondary">trending_up</span>
              <h2 className="text-headline-md text-primary">Income Ideas</h2>
            </div>
            <ul className="space-y-space-sm">
              {INCOME_OPPORTUNITY_CATEGORIES.map((idea) => (
                <li
                  key={idea}
                  className="bg-white p-3 rounded-lg border border-outline-variant/20 text-body-md text-on-surface-variant"
                >
                  {idea}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
