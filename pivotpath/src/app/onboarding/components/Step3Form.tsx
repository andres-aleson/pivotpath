"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  step3Schema,
  YEARS_EXPERIENCE_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  WEEKLY_TIME_OPTIONS,
  TIMELINE_URGENCY_OPTIONS,
  type Step3Input,
} from "@/lib/onboarding/schema";
import { saveStep3 } from "@/app/onboarding/actions";
import Link from "next/link";

const selectClass =
  "w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-body-md";

export function Step3Form({ defaultValues }: { defaultValues: Partial<Step3Input> }) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step3Input>({
    resolver: zodResolver(step3Schema),
    mode: "onChange",
    defaultValues: {
      yearsExperience: defaultValues.yearsExperience,
      educationLevel: defaultValues.educationLevel,
      weeklyTimeCommitment: defaultValues.weeklyTimeCommitment,
      timelineUrgency: defaultValues.timelineUrgency,
    },
  });

  const onSubmit = handleSubmit((data) => {
    setServerError(null);
    startTransition(async () => {
      const result = await saveStep3(data);
      if (!result.ok) setServerError(result.error);
    });
  });

  return (
    <form className="space-y-space-lg" onSubmit={onSubmit}>
      <div className="space-y-space-xs">
        <label className="text-label-md text-primary" htmlFor="years-experience">
          How many years of experience do you have?
        </label>
        <select id="years-experience" className={selectClass} defaultValue="" {...register("yearsExperience")}>
          <option value="" disabled>
            Select one
          </option>
          {YEARS_EXPERIENCE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.yearsExperience && (
          <p className="text-label-sm text-error" role="alert">
            {errors.yearsExperience.message}
          </p>
        )}
      </div>

      <div className="space-y-space-xs">
        <label className="text-label-md text-primary" htmlFor="education-level">
          What&apos;s your highest level of education?
        </label>
        <select id="education-level" className={selectClass} defaultValue="" {...register("educationLevel")}>
          <option value="" disabled>
            Select one
          </option>
          {EDUCATION_LEVEL_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.educationLevel && (
          <p className="text-label-sm text-error" role="alert">
            {errors.educationLevel.message}
          </p>
        )}
      </div>

      <div className="space-y-space-xs">
        <label className="text-label-md text-primary" htmlFor="weekly-time">
          How much time can you commit each week to retraining?
        </label>
        <select id="weekly-time" className={selectClass} defaultValue="" {...register("weeklyTimeCommitment")}>
          <option value="" disabled>
            Select one
          </option>
          {WEEKLY_TIME_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.weeklyTimeCommitment && (
          <p className="text-label-sm text-error" role="alert">
            {errors.weeklyTimeCommitment.message}
          </p>
        )}
      </div>

      <div className="space-y-space-xs">
        <label className="text-label-md text-primary">Where are you in the process?</label>
        <div className="grid grid-cols-1 gap-space-sm">
          {TIMELINE_URGENCY_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="relative flex items-center p-4 rounded-lg border border-outline-variant bg-surface-container-lowest cursor-pointer hover:border-secondary transition-colors has-[:checked]:border-secondary has-[:checked]:bg-surface-variant/30"
            >
              <input
                className="sr-only peer"
                type="radio"
                value={option.value}
                {...register("timelineUrgency")}
              />
              <div className="flex flex-col">
                <span className="text-body-md font-medium text-primary">{option.label}</span>
                <span className="text-label-sm text-on-surface-variant">
                  {option.description}
                </span>
              </div>
              <span className="material-symbols-outlined ml-auto text-secondary opacity-0 peer-checked:opacity-100">
                check_circle
              </span>
            </label>
          ))}
        </div>
        {errors.timelineUrgency && (
          <p className="text-label-sm text-error" role="alert">
            {errors.timelineUrgency.message}
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
          href="/onboarding/step-2"
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
