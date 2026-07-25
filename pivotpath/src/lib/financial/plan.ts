/**
 * Deterministic runway math — no AI, no external calls. See financial-assistance-prd.md
 * for why: income/savings numbers are more sensitive than the roadmap's career inputs.
 */
export function calculateRunwayMonths(profile: {
  monthlyIncomeDuringTransition: number;
  essentialMonthlyExpenses: number;
  currentSavings: number;
}): number | null {
  const monthlyBurn = profile.essentialMonthlyExpenses - profile.monthlyIncomeDuringTransition;
  if (monthlyBurn <= 0) return null; // breaking even or better — no countdown to show
  return profile.currentSavings / monthlyBurn;
}
