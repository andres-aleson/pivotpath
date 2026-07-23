"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema, type Step2Input } from "@/lib/onboarding/schema";
import { saveStep2 } from "@/app/onboarding/actions";
import Link from "next/link";

export function Step2Form({ defaultValues }: { defaultValues: Partial<Step2Input> }) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<Step2Input>({
    resolver: zodResolver(step2Schema),
    mode: "onChange",
    defaultValues: {
      targetRole: defaultValues.targetRole ?? "",
      stillDecidingRole: defaultValues.stillDecidingRole ?? false,
      transitionMotivation: defaultValues.transitionMotivation ?? "",
    },
  });

  const stillDeciding = watch("stillDecidingRole");

  const onSubmit = handleSubmit((data) => {
    setServerError(null);
    startTransition(async () => {
      const result = await saveStep2(data);
      if (!result.ok) setServerError(result.error);
    });
  });

  return (
    <form className="space-y-space-lg" onSubmit={onSubmit}>
      <div className="space-y-space-xs">
        <label className="text-label-md text-primary" htmlFor="target-role">
          What role are you moving toward?
        </label>
        <input
          id="target-role"
          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-body-md disabled:bg-surface-container disabled:text-on-surface-variant"
          placeholder="e.g. Product Manager"
          type="text"
          disabled={stillDeciding}
          {...register("targetRole")}
        />
        <label className="flex items-center gap-2 pt-1 cursor-pointer text-label-md text-on-surface-variant">
          <input type="checkbox" {...register("stillDecidingRole")} />
          I&apos;m still figuring out my target role
        </label>
        {errors.targetRole && (
          <p className="text-label-sm text-error" role="alert">
            {errors.targetRole.message}
          </p>
        )}
      </div>

      <div className="space-y-space-xs">
        <label className="text-label-md text-primary" htmlFor="motivation">
          What&apos;s motivating this change?
        </label>
        <textarea
          id="motivation"
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-body-md"
          placeholder="e.g. I want more ownership over what I build, and better long-term growth."
          {...register("transitionMotivation")}
        />
        {errors.transitionMotivation && (
          <p className="text-label-sm text-error" role="alert">
            {errors.transitionMotivation.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="text-label-sm text-error" role="alert">
          {serverError}
        </p>
      )}

      <div className="flex items-center justify-between pt-space-lg border-t border-outline-variant/30">
        <Link
          href="/onboarding/step-1"
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-primary text-label-md hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back
        </Link>
        <button
          type="submit"
          disabled={!isValid || isPending}
          className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white text-label-md hover:opacity-90 transition-opacity shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Continue"}
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </form>
  );
}
