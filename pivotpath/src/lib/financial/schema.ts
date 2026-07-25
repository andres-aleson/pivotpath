import { z } from "zod";
import { FINANCIAL_CONCERN_OPTIONS } from "@/lib/onboarding/schema";

export const financialProfileSchema = z.object({
  monthlyIncomeDuringTransition: z
    .number({ message: "Enter a number" })
    .min(0, "Enter 0 or more"),
  essentialMonthlyExpenses: z
    .number({ message: "Enter a number" })
    .positive("Enter your essential monthly expenses"),
  currentSavings: z.number({ message: "Enter a number" }).min(0, "Enter 0 or more"),
  financialConcernType: z.enum(
    FINANCIAL_CONCERN_OPTIONS.map((o) => o.value) as [string, ...string[]],
    { message: "Choose your biggest financial concern" }
  ),
});

export type FinancialProfileInput = z.infer<typeof financialProfileSchema>;
