import { z } from "zod";

export const FINANCIAL_CONCERN_OPTIONS = [
  {
    value: "income_gap",
    label: "Income Gap",
    description: "Losing steady salary during transition",
  },
  {
    value: "training_costs",
    label: "Training Costs",
    description: "Expense of new certifications",
  },
  {
    value: "retirement_plans",
    label: "Retirement Plans",
    description: "Impact on long-term savings",
  },
  {
    value: "market_risk",
    label: "Market Risk",
    description: "Changing to an unstable industry",
  },
] as const;

export const INDUSTRY_OPTIONS = [
  "Technology",
  "Sustainability",
  "Healthcare",
  "Creative Arts",
  "Finance",
  "Education",
] as const;

export const YEARS_EXPERIENCE_OPTIONS = [
  "0-2 years",
  "3-5 years",
  "6-10 years",
  "10+ years",
] as const;

export const EDUCATION_LEVEL_OPTIONS = [
  "High school",
  "Associate's degree",
  "Bachelor's degree",
  "Graduate degree",
  "Certification / trade program",
] as const;

export const WEEKLY_TIME_OPTIONS = [
  "Less than 5 hrs/week",
  "5-10 hrs/week",
  "10-20 hrs/week",
  "20+ hrs/week",
] as const;

export const TIMELINE_URGENCY_OPTIONS = [
  {
    value: "exploring",
    label: "Just exploring",
    description: "I'm weighing whether to make a change at all",
  },
  {
    value: "planning",
    label: "Planning to transition in the next 6-12 months",
    description: "I know I'm moving, I'm preparing for it",
  },
  {
    value: "already_transitioning",
    label: "Already in the process",
    description: "I've started applying, training, or job-hunting",
  },
] as const;

export const step1Schema = z.object({
  currentJobTitle: z.string().trim().min(1, "Enter your current job title"),
  topSkills: z.array(z.string().trim().min(1)).min(1, "Add at least one skill"),
  financialConcernType: z.enum(
    FINANCIAL_CONCERN_OPTIONS.map((o) => o.value) as [string, ...string[]],
    { message: "Choose your biggest financial concern" }
  ),
  industriesOfInterest: z
    .array(z.string().trim().min(1))
    .min(1, "Pick at least one industry"),
});

export const step2Schema = z
  .object({
    targetRole: z.string().trim().optional(),
    stillDecidingRole: z.boolean(),
    transitionMotivation: z
      .string()
      .trim()
      .min(3, "Tell us a little about what's motivating this change"),
  })
  .refine((data) => data.stillDecidingRole || (data.targetRole ?? "").length > 0, {
    message: "Enter a target role, or check that you're still deciding",
    path: ["targetRole"],
  });

export const step3Schema = z.object({
  yearsExperience: z.enum(YEARS_EXPERIENCE_OPTIONS as unknown as [string, ...string[]], {
    message: "Select your years of experience",
  }),
  educationLevel: z.enum(EDUCATION_LEVEL_OPTIONS as unknown as [string, ...string[]], {
    message: "Select your education level",
  }),
  weeklyTimeCommitment: z.enum(WEEKLY_TIME_OPTIONS as unknown as [string, ...string[]], {
    message: "Select how much time you can commit",
  }),
  timelineUrgency: z.enum(
    TIMELINE_URGENCY_OPTIONS.map((o) => o.value) as [string, ...string[]],
    { message: "Select your timeline" }
  ),
});

export type Step1Input = z.infer<typeof step1Schema>;
export type Step2Input = z.infer<typeof step2Schema>;
export type Step3Input = z.infer<typeof step3Schema>;
