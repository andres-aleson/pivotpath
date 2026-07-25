import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionId } from "@/lib/onboarding/session";
import { AppShell } from "@/components/AppShell";

export default async function FinancialPage() {
  const sessionId = await getSessionId();
  if (!sessionId) redirect("/onboarding");

  return (
    <AppShell active="dashboard">
      <div className="max-w-container-max mx-auto px-gutter py-space-lg">
        <div className="max-w-2xl mx-auto text-center bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg shadow-sm border border-outline-variant/30">
          <div className="w-16 h-16 mx-auto mb-space-md rounded-full bg-surface-container text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl">account_balance_wallet</span>
          </div>
          <h1 className="text-headline-lg text-primary mb-base">Financial Assistance is coming soon</h1>
          <p className="text-body-md text-on-surface-variant mb-space-lg">
            We're building a short questionnaire about your income, expenses, and savings so we
            can give you budget and runway guidance tailored to your transition — self-reported
            numbers only, never linked accounts or payment info.
          </p>
          <Link
            href="/roadmap"
            className="inline-block px-lg py-3 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
