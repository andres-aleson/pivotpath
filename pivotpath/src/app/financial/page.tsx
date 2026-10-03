"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { FinancialCheckInForm } from "@/app/financial/FinancialCheckInForm";
import { getJourney } from "@/lib/journey/store";
import type { FinancialProfileInput } from "@/lib/financial/schema";

export default function FinancialCheckInPage() {
  const [defaultValues, setDefaultValues] = useState<Partial<FinancialProfileInput> | null>(null);
  const [hasExisting, setHasExisting] = useState(false);

  useEffect(() => {
    const journey = getJourney();
    setHasExisting(Boolean(journey.financialProfile));
    setDefaultValues({
      ...journey.financialProfile,
      financialConcernType:
        journey.financialProfile?.financialConcernType ?? journey.profile?.financialConcernType,
    });
  }, []);

  if (!defaultValues) return null;

  return (
    <AppShell active="financial">
      <div className="max-w-container-max mx-auto px-gutter py-space-lg">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl p-space-md md:p-space-lg shadow-sm bg-surface-container-lowest border border-outline-variant/30">
            <div className="mb-space-lg">
              <h1 className="text-headline-lg text-primary mb-2">
                {hasExisting ? "Update Your Numbers" : "Financial Check-In"}
              </h1>
              <p className="text-body-md text-on-surface-variant">
                A few numbers so we can estimate your runway and point you toward relevant
                budget tips — nothing you enter here is saved, it only lives in this browser
                tab for your current visit.
              </p>
            </div>
            <FinancialCheckInForm defaultValues={defaultValues} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
