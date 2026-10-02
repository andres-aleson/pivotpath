"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  step1Schema,
  FINANCIAL_CONCERN_OPTIONS,
  INDUSTRY_OPTIONS,
  type Step1Input,
} from "@/lib/onboarding/schema";
import { saveStep1 } from "@/app/onboarding/actions";

export function Step1Form({ defaultValues }: { defaultValues: Partial<Step1Input> }) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<Step1Input>({
    resolver: zodResolver(step1Schema),
    mode: "onChange",
    defaultValues: {
      currentJobTitle: defaultValues.currentJobTitle ?? "",
      topSkills: defaultValues.topSkills ?? [],
      financialConcernType: defaultValues.financialConcernType,
      industriesOfInterest: defaultValues.industriesOfInterest ?? [],
    },
  });

  const topSkills = watch("topSkills");
  const industries = watch("industriesOfInterest");

  const initialOther = (defaultValues.industriesOfInterest ?? []).find(
    (i) => !(INDUSTRY_OPTIONS as readonly string[]).includes(i)
  );
  const [otherChecked, setOtherChecked] = useState(Boolean(initialOther));
  const [otherText, setOtherText] = useState(initialOther ?? "");

  function addSkill() {
    const value = skillInput.trim();
    if (!value || topSkills.includes(value)) return;
    setValue("topSkills", [...topSkills, value], { shouldValidate: true, shouldDirty: true });
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setValue(
      "topSkills",
      topSkills.filter((s) => s !== skill),
      { shouldValidate: true, shouldDirty: true }
    );
  }

  function toggleIndustry(industry: string) {
    const next = industries.includes(industry)
      ? industries.filter((i) => i !== industry)
      : [...industries, industry];
    setValue("industriesOfInterest", next, { shouldValidate: true, shouldDirty: true });
  }

  function toggleOther() {
    const next = !otherChecked;
    setOtherChecked(next);
    if (!next) {
      const trimmed = otherText.trim();
      setValue(
        "industriesOfInterest",
        industries.filter((i) => i !== trimmed),
        { shouldValidate: true, shouldDirty: true }
      );
      setOtherText("");
    }
  }

  function updateOtherText(value: string) {
    const previous = otherText.trim();
    const next = value.trim();
    setOtherText(value);
    let updated = industries.filter((i) => i !== previous);
    if (next) updated = [...updated, next];
    setValue("industriesOfInterest", updated, { shouldValidate: true, shouldDirty: true });
  }

  const onSubmit = handleSubmit((data) => {
    setServerError(null);
    startTransition(async () => {
      const result = await saveStep1(data);
      if (!result.ok) setServerError(result.error);
    });
  });

  return (
    <form className="space-y-space-lg" onSubmit={onSubmit}>
      <div className="space-y-space-xs">
        <label className="text-label-md text-primary" htmlFor="job-title">
          What is your current job title?
        </label>
        <input
          id="job-title"
          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-body-md"
          placeholder="e.g. Senior Marketing Specialist"
          type="text"
          {...register("currentJobTitle")}
        />
        {errors.currentJobTitle && (
          <p className="text-label-sm text-error" role="alert">
            {errors.currentJobTitle.message}
          </p>
        )}
      </div>

      <div className="space-y-space-xs">
        <label className="text-label-md text-primary">What are your top skills?</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {topSkills.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-1 bg-surface-variant text-secondary px-3 py-1 rounded-lg text-label-sm border border-secondary/10"
            >
              {skill}
              <button
                type="button"
                aria-label={`Remove ${skill}`}
                onClick={() => removeSkill(skill)}
                className="material-symbols-outlined text-[16px] cursor-pointer"
              >
                close
              </button>
            </span>
          ))}
        </div>
        <div className="relative">
          <input
            className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-body-md"
            placeholder="Add a skill..."
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <button
            type="button"
            onClick={addSkill}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary text-label-md"
          >
            Add
          </button>
        </div>
        {errors.topSkills && (
          <p className="text-label-sm text-error" role="alert">
            {errors.topSkills.message}
          </p>
        )}
      </div>

      <div className="space-y-space-xs">
        <label className="text-label-md text-primary">
          What is your main financial concern regarding a career change?
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
                {...register("financialConcernType")}
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
        {errors.financialConcernType && (
          <p className="text-label-sm text-error" role="alert">
            {errors.financialConcernType.message}
          </p>
        )}
      </div>

      <div className="space-y-space-xs">
        <label className="text-label-md text-primary">What industries interest you?</label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRY_OPTIONS.map((industry) => {
            const checked = industries.includes(industry);
            return (
              <label key={industry} className="cursor-pointer">
                <input
                  className="sr-only peer"
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleIndustry(industry)}
                />
                <span className="px-4 py-2 rounded-full border border-outline-variant text-body-md text-on-surface-variant peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all inline-block">
                  {industry}
                </span>
              </label>
            );
          })}
          <label className="cursor-pointer">
            <input className="sr-only peer" type="checkbox" checked={otherChecked} onChange={toggleOther} />
            <span className="px-4 py-2 rounded-full border border-outline-variant text-body-md text-on-surface-variant peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all inline-block">
              Other
            </span>
          </label>
        </div>
        {otherChecked && (
          <input
            className="w-full mt-2 px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-body-md"
            placeholder="Enter your industry"
            type="text"
            value={otherText}
            onChange={(e) => updateOtherText(e.target.value)}
          />
        )}
        {errors.industriesOfInterest && (
          <p className="text-label-sm text-error" role="alert">
            {errors.industriesOfInterest.message}
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
          {isPending ? "Saving..." : "Continue"}
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </form>
  );
}
