"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { financialProfileSchema, type FinancialProfileInput } from "@/lib/financial/schema";
import { FINANCIAL_CONCERN_OPTIONS } from "@/lib/onboarding/schema";
import { saveFinancialProfile } from "@/app/financial/actions";

type Defaults = {
  monthlyIncomeDuringTransition?: number;
  essentialMonthlyExpenses?: number;
  currentSavings?: number;
  financialConcernType?: string;
};

export function FinancialCheckInForm({ defaultValues }: { defaultValues: Defaults }) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FinancialProfileInput>({
    resolver: zodResolver(financialProfileSchema),
    mode: "onChange",
    defaultValues: {
      monthlyIncomeDuringTransition: defaultValues.monthlyIncomeDuringTransition ?? 0,
      essentialMonthlyExpenses: defaultValues.essentialMonthlyExpenses,
      currentSavings: defaultValues.currentSavings,
      financialConcernType: defaultValues.financialConcernType as
        | FinancialProfileInput["financialConcernType"]
        | undefined,
    },
  });

  const financialConcernType = watch("financialConcernType");

  const onSubmit = handleSubmit((data) => {
    setServerError(null);
    startTransition(async () => {
      const result = await saveFinancialProfile(data);
      if (!result.ok) setServerError(result.error);
    });
  });

  return (
    <form className="space-y-space-lg" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <div className="space-y-space-xs">
          <label className="text-label-md text-primary" htmlFor="monthly-income">
            Expected monthly income during your transition
          </label>
          <p className="text-label-sm text-on-surface-variant">Enter 0 if you won't have any.</p>
          <input
            id="monthly-income"
            className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-body-md"
            type="number"
            min="0"
            step="1"
            {...register("monthlyIncomeDuringTransition", { valueAsNumber: true })}
          />
          {errors.monthlyIncomeDuringTransition && (
            <p className="text-label-sm text-error" role="alert">
              {errors.monthlyIncomeDuringTransition.message}
            </p>
          )}
        </div>

        <div className="space-y-space-xs">
          <label className="text-label-md text-primary" htmlFor="essential-expenses">
            Essential monthly expenses
          </label>
          <p className="text-label-sm text-on-surface-variant">Rent, food, insurance, etc.</p>
          <input
            id="essential-expenses"
            className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-body-md"
            type="number"
            min="0"
            step="1"
            {...register("essentialMonthlyExpenses", { valueAsNumber: true })}
          />
          {errors.essentialMonthlyExpenses && (
            <p className="text-label-sm text-error" role="alert">
              {errors.essentialMonthlyExpenses.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-space-xs">
        <label className="text-label-md text-primary" htmlFor="current-savings">
          Current savings set aside for this transition
        </label>
        <input
          id="current-savings"
          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-body-md"
          type="number"
          min="0"
          step="1"
          {...register("currentSavings", { valueAsNumber: true })}
        />
        {errors.currentSavings && (
          <p className="text-label-sm text-error" role="alert">
            {errors.currentSavings.message}
          </p>
        )}
      </div>

      <div className="space-y-space-xs">
        <label className="text-label-md text-primary">
          What's your biggest financial concern about this change?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
          {FINANCIAL_CONCERN_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="relative flex items-center p-4 rounded-lg border border-outline-variant bg-surface-container-lowest cursor-pointer hover:border-secondary transition-colors has-[:checked]:border-secondary has-[:checked]:bg-surface-variant/30"
            >
              <input
                className="sr-only peer"
                type="radio"
                value={option.value}
                checked={financialConcernType === option.value}
                onChange={() =>
                  setValue("financialConcernType", option.value, { shouldValidate: true })
                }
              />
              <div className="flex flex-col">
                <span className="text-body-md font-medium text-primary">{option.label}</span>
                <span className="text-label-sm text-on-surface-variant">{option.description}</span>
              </div>
              <span className="material-symbols-outlined ml-auto text-secondary opacity-0 peer-checked:opacity-100">
                check_circle
              </span>
            </label>
          ))}
        </div>
        {errors.financialConcernType && (
          <p className="text-label-sm text-error" role="alert">
            {errors.financialConcernType.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="text-label-sm text-error" role="alert">
          {serverError}
        </p>
      )}

      <div className="flex items-center justify-end pt-space-lg border-t border-outline-variant/30">
        <button
          type="submit"
          disabled={!isValid || isPending}
          className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white text-label-md hover:opacity-90 transition-opacity shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? "Calculating..." : "See My Financial Plan"}
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </form>
  );
}
