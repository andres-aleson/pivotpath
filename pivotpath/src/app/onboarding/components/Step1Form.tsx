"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  FINANCIAL_CONCERN_OPTIONS,
  INDUSTRY_OPTIONS,
  MAX_RESUME_BYTES,
  MAX_RESUME_CHARS,
  type Step1Input,
} from "@/lib/onboarding/schema";
import { IncompleteFormNotice } from "@/app/onboarding/components/IncompleteFormNotice";
import { extractResumeText } from "@/app/onboarding/actions";
import { getJourney, setJourney } from "@/lib/journey/store";

export function Step1Form({ defaultValues }: { defaultValues: Partial<Step1Input> }) {
  const router = useRouter();
  const [skillInput, setSkillInput] = useState("");
  const [isReadingResume, startResumeTransition] = useTransition();
  const [resumeError, setResumeError] = useState<string | null>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<Step1Input>({
    resolver: zodResolver(step1Schema),
    mode: "onChange",
    defaultValues: {
      currentJobTitle: defaultValues.currentJobTitle ?? "",
      topSkills: defaultValues.topSkills ?? [],
      financialConcernType: defaultValues.financialConcernType,
      industriesOfInterest: defaultValues.industriesOfInterest ?? [],
      resumeText: defaultValues.resumeText,
      resumeFileName: defaultValues.resumeFileName,
    },
  });

  const topSkills = watch("topSkills");
  const industries = watch("industriesOfInterest");
  const resumeText = watch("resumeText");
  const resumeFileName = watch("resumeFileName");

  function setResume(text: string | undefined, name: string | undefined) {
    setValue("resumeText", text, { shouldDirty: true });
    setValue("resumeFileName", name, { shouldDirty: true });
  }

  function handleResumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setResumeError(null);
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isText = file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt");
    if (!isPdf && !isText) {
      setResumeError("Please upload a PDF or plain text (.txt) file.");
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      setResumeError("That file is too large — please use one under 2MB.");
      return;
    }

    if (isText) {
      file.text().then((text) => {
        const trimmed = text.trim();
        if (!trimmed) {
          setResumeError("That file doesn't contain any text.");
          return;
        }
        setResume(trimmed.slice(0, MAX_RESUME_CHARS), file.name);
      });
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    startResumeTransition(async () => {
      const result = await extractResumeText(formData);
      if (!result.ok) {
        setResumeError(result.error);
        return;
      }
      setResume(result.text, file.name);
    });
  }

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
    const previous = getJourney().profile ?? {};
    const hadReachedReview =
      step1Schema.safeParse(previous).success &&
      step2Schema.safeParse(previous).success &&
      step3Schema.safeParse(previous).success;

    setJourney({ profile: { ...previous, ...data } });
    router.push(hadReachedReview ? "/onboarding/step-4" : "/onboarding/step-2");
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
        <p className="text-label-sm text-on-surface-variant">
          Add at least 3{topSkills.length > 0 ? ` (${topSkills.length} added)` : ""}.
        </p>
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

      <div className="space-y-space-xs">
        <label className="text-label-md text-primary">
          Upload your resume <span className="text-on-surface-variant">(optional)</span>
        </label>
        <p className="text-label-sm text-on-surface-variant">
          Adds detail beyond your answers so the suggestions and roadmap fit you better. PDF or
          plain text, up to 2MB. Skipping this is completely fine.
        </p>

        <div className="flex items-start gap-space-sm rounded-lg bg-surface-container p-4">
          <span className="material-symbols-outlined text-secondary text-[20px]">privacy_tip</span>
          <p className="text-label-sm text-on-surface-variant">
            <span className="font-bold text-primary">Privacy notice: </span>
            If you upload a resume, its text is sent to Google&apos;s Gemini AI to personalize your
            role suggestions and roadmap. PivotPath doesn&apos;t save it — it stays in this browser
            tab and is gone when you close it — but Google&apos;s AI processes it and may retain it
            under Google&apos;s own terms. Please don&apos;t upload anything you wouldn&apos;t want an
            AI service to see, and consider removing your phone number, home address, and other
            personal identifiers first.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm pt-1">
          {resumeText ? (
            <div className="flex items-center gap-2 bg-surface-variant text-secondary px-3 py-2 rounded-lg text-label-md border border-secondary/10">
              <span className="material-symbols-outlined text-[18px]">description</span>
              {resumeFileName || "Resume added"}
              <button
                type="button"
                aria-label="Remove resume"
                onClick={() => {
                  setResume(undefined, undefined);
                  setResumeError(null);
                }}
                className="material-symbols-outlined text-[16px] cursor-pointer"
              >
                close
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => resumeInputRef.current?.click()}
              disabled={isReadingResume}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant text-label-md text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors disabled:opacity-40"
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isReadingResume ? "animate-spin" : ""
                }`}
              >
                {isReadingResume ? "progress_activity" : "upload_file"}
              </span>
              {isReadingResume ? "Reading resume..." : "Upload Resume"}
            </button>
          )}
          <input
            ref={resumeInputRef}
            type="file"
            accept=".pdf,.txt,application/pdf,text/plain"
            className="hidden"
            onChange={handleResumeChange}
          />
        </div>
        {resumeError && (
          <p className="text-label-sm text-error" role="alert">
            {resumeError}
          </p>
        )}
      </div>

      <IncompleteFormNotice show={isSubmitted && Object.keys(errors).length > 0} />

      <div className="flex items-center justify-end pt-space-lg border-t border-outline-variant/30">
        <button
          type="submit"
          className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white text-label-md hover:opacity-90 transition-opacity shadow-md"
        >
          Continue
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </form>
  );
}
