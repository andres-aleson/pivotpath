import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, financialProfile, userProfile } from "@/lib/db";
import { getCurrentUserId } from "@/lib/current-user";
import { AppShell } from "@/components/AppShell";
import { FinancialCheckInForm } from "@/app/financial/FinancialCheckInForm";

export default async function FinancialCheckInPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const [profileFinancials, profile] = await Promise.all([
    db.query.financialProfile.findFirst({ where: eq(financialProfile.userId, userId) }),
    db.query.userProfile.findFirst({ where: eq(userProfile.userId, userId) }),
  ]);

  return (
    <AppShell active="financial">
      <div className="max-w-container-max mx-auto px-gutter py-space-lg">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl p-space-md md:p-space-lg shadow-sm bg-surface-container-lowest border border-outline-variant/30">
            <div className="mb-space-lg">
              <h1 className="text-headline-lg text-primary mb-2">
                {profileFinancials ? "Update Your Numbers" : "Financial Check-In"}
              </h1>
              <p className="text-body-md text-on-surface-variant">
                A few numbers so we can estimate your runway and point you toward relevant
                budget tips — self-reported only, never linked accounts or payment info.
              </p>
            </div>
            <FinancialCheckInForm
              defaultValues={{
                monthlyIncomeDuringTransition: profileFinancials?.monthlyIncomeDuringTransition,
                essentialMonthlyExpenses: profileFinancials?.essentialMonthlyExpenses,
                currentSavings: profileFinancials?.currentSavings,
                financialConcernType:
                  profileFinancials?.financialConcernType ?? profile?.financialConcernType ?? undefined,
              }}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
