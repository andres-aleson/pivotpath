"use client";

import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shareStorySchema, MAX_PHOTO_BYTES, type ShareStoryInput } from "@/lib/stories/schema";
import { INDUSTRY_OPTIONS } from "@/lib/onboarding/schema";
import { initials } from "@/lib/stories/initials";
import { saveStory } from "@/app/stories/actions";

type Defaults = {
  displayName: string;
  photoDataUrl?: string;
  fromRole: string;
  toRole: string;
  industry?: string;
  stepsTaken: string;
  tips: string;
};

export function ShareStoryForm({ defaultValues }: { defaultValues: Defaults }) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ShareStoryInput>({
    resolver: zodResolver(shareStorySchema),
    mode: "onChange",
    defaultValues: {
      displayName: defaultValues.displayName,
      photoDataUrl: defaultValues.photoDataUrl ?? "",
      fromRole: defaultValues.fromRole,
      toRole: defaultValues.toRole,
      industry: defaultValues.industry as ShareStoryInput["industry"] | undefined,
      stepsTaken: defaultValues.stepsTaken,
      tips: defaultValues.tips,
      consent: undefined,
    },
  });

  const industry = watch("industry");
  const displayName = watch("displayName");
  const photoDataUrl = watch("photoDataUrl");

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setPhotoError(null);
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("Photo is too large — please use one under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setValue("photoDataUrl", reader.result as string, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setValue("photoDataUrl", "", { shouldValidate: true });
    setPhotoError(null);
  }

  const onSubmit = handleSubmit((data) => {
    setServerError(null);
    startTransition(async () => {
      const result = await saveStory(data);
      if (!result.ok) setServerError(result.error);
    });
  });

  return (
    <form className="space-y-space-lg" onSubmit={onSubmit}>
      <div className="space-y-space-xs">
        <label className="text-label-md text-primary" htmlFor="display-name">
          Your name (shown publicly)
        </label>
        <input
          id="display-name"
          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-body-md"
          placeholder="e.g. Sarah Jenkins"
          type="text"
          {...register("displayName")}
        />
        {errors.displayName && (
          <p className="text-label-sm text-error" role="alert">
            {errors.displayName.message}
          </p>
        )}
      </div>

      <div className="space-y-space-xs">
        <label className="text-label-md text-primary">Profile photo (optional)</label>
        <div className="flex items-center gap-space-md">
          {photoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoDataUrl}
              alt="Preview"
              className="w-16 h-16 rounded-lg object-cover border border-outline-variant"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-headline-md">
              {displayName ? initials(displayName) : "?"}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <div className="flex gap-space-sm">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-lg border border-outline-variant text-label-md text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors"
              >
                {photoDataUrl ? "Change Photo" : "Upload Photo"}
              </button>
              {photoDataUrl && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="px-4 py-2 rounded-lg text-label-md text-on-surface-variant hover:text-error transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
            <span className="text-label-sm text-on-surface-variant">JPG or PNG, up to 2MB.</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
        {(photoError || errors.photoDataUrl) && (
          <p className="text-label-sm text-error" role="alert">
            {photoError ?? errors.photoDataUrl?.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <div className="space-y-space-xs">
          <label className="text-label-md text-primary" htmlFor="from-role">
            Transitioned from
          </label>
          <input
            id="from-role"
            className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-body-md"
            type="text"
            {...register("fromRole")}
          />
          {errors.fromRole && (
            <p className="text-label-sm text-error" role="alert">
              {errors.fromRole.message}
            </p>
          )}
        </div>
        <div className="space-y-space-xs">
          <label className="text-label-md text-primary" htmlFor="to-role">
            Transitioned to
          </label>
          <input
            id="to-role"
            className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-body-md"
            type="text"
            {...register("toRole")}
          />
          {errors.toRole && (
            <p className="text-label-sm text-error" role="alert">
              {errors.toRole.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-space-xs">
        <label className="text-label-md text-primary">Industry</label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRY_OPTIONS.map((option) => (
            <label key={option} className="cursor-pointer">
              <input
                className="sr-only peer"
                type="radio"
                value={option}
                checked={industry === option}
                onChange={() => setValue("industry", option, { shouldValidate: true })}
              />
              <span className="px-4 py-2 rounded-full border border-outline-variant text-body-md text-on-surface-variant peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all inline-block">
                {option}
              </span>
            </label>
          ))}
        </div>
        {errors.industry && (
          <p className="text-label-sm text-error" role="alert">
            {errors.industry.message}
          </p>
        )}
      </div>

      <div className="space-y-space-xs">
        <label className="text-label-md text-primary" htmlFor="steps-taken">
          The steps you took
        </label>
        <p className="text-label-sm text-on-surface-variant">
          We started this from your roadmap milestones — edit freely, remove anything, or rewrite
          it in your own words.
        </p>
        <textarea
          id="steps-taken"
          rows={8}
          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-body-md"
          {...register("stepsTaken")}
        />
        {errors.stepsTaken && (
          <p className="text-label-sm text-error" role="alert">
            {errors.stepsTaken.message}
          </p>
        )}
      </div>

      <div className="space-y-space-xs">
        <label className="text-label-md text-primary" htmlFor="tips">
          Tips for someone starting this same transition
        </label>
        <textarea
          id="tips"
          rows={4}
          placeholder="What do you wish you'd known at the start?"
          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-body-md"
          {...register("tips")}
        />
        {errors.tips && (
          <p className="text-label-sm text-error" role="alert">
            {errors.tips.message}
          </p>
        )}
      </div>

      <div className="bg-surface-container rounded-lg p-space-md">
        <label className="flex items-start gap-space-sm cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4 accent-secondary"
            {...register("consent")}
          />
          <span className="text-body-md text-on-surface-variant">
            I'd like to publish this story so other PivotPath users can see it in Success Stories
            &amp; Mentors. I can edit or unpublish it at any time.
          </span>
        </label>
        {errors.consent && (
          <p className="text-label-sm text-error mt-2" role="alert">
            {errors.consent.message}
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
          {isPending ? "Publishing..." : "Post My Story"}
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </form>
  );
}
