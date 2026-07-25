import { z } from "zod";
import { INDUSTRY_OPTIONS } from "@/lib/onboarding/schema";

// Photos are stored as inline data URLs (no file storage infra yet — see
// success-stories-prd.md). Cap the source file at 2MB; base64 inflates that
// by ~4/3, so allow a little headroom on the encoded string length.
export const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const MAX_PHOTO_DATA_URL_LENGTH = Math.ceil(MAX_PHOTO_BYTES * 1.4);

export const shareStorySchema = z.object({
  displayName: z.string().trim().min(1, "Enter the name you'd like shown"),
  photoDataUrl: z
    .string()
    .startsWith("data:image/", "Photo must be an image file")
    .max(MAX_PHOTO_DATA_URL_LENGTH, "Photo is too large — please use one under 2MB")
    .optional()
    .or(z.literal("")),
  fromRole: z.string().trim().min(1, "Enter the role you transitioned from"),
  toRole: z.string().trim().min(1, "Enter the role you transitioned to"),
  industry: z.enum(INDUSTRY_OPTIONS, { message: "Pick an industry" }),
  stepsTaken: z.string().trim().min(1, "Share the steps you took"),
  tips: z.string().trim().min(1, "Add a tip or two for others"),
  consent: z.literal(true, {
    message: "You need to confirm you'd like to publish this story",
  }),
});

export type ShareStoryInput = z.infer<typeof shareStorySchema>;
