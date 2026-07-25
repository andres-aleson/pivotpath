import { z } from "zod";
import { INDUSTRY_OPTIONS } from "@/lib/onboarding/schema";

export const shareStorySchema = z.object({
  displayName: z.string().trim().min(1, "Enter the name you'd like shown"),
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
