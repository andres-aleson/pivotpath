import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/onboarding/session";
import { AppShell } from "@/components/AppShell";
import { FinancialCheckInForm } from "@/app/financial/FinancialCheckInForm";

export default async function FinancialCheckInPage() {
  const sessionId = await getSessionId();
  if (!sessionId) redirect("/onboarding");

  const [financialProfile, profile] = await Promise.all([
    prisma.financialProfile.findUnique({ where: { sessionId } }),
    prisma.userProfile.findUnique({ where: { sessionId } }),
  ]);

  return (
    <AppShell active="dashboard">
      <div className="max-w-container-max mx-auto px-gutter py-space-lg">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl p-space-md md:p-space-lg shadow-sm bg-surface-container-lowest border border-outline-variant/30">
            <div className="mb-space-lg">
              <h1 className="text-headline-lg text-primary mb-2">
                {financialProfile ? "Update Your Numbers" : "Financial Check-In"}
              </h1>
              <p className="text-body-md text-on-surface-variant">
                A few numbers so we can estimate your runway and point you toward relevant
                budget tips — self-reported only, never linked accounts or payment info.
              </p>
            </div>
            <FinancialCheckInForm
              defaultValues={{
                monthlyIncomeDuringTransition: financialProfile?.monthlyIncomeDuringTransition,
                essentialMonthlyExpenses: financialProfile?.essentialMonthlyExpenses,
                currentSavings: financialProfile?.currentSavings,
                financialConcernType:
                  financialProfile?.financialConcernType ?? profile?.financialConcernType ?? undefined,
              }}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
