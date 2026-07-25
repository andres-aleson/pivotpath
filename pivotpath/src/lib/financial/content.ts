// Static, curated content keyed off the same financial_concern_type enum used
// in onboarding. No AI-generated advice — see financial-assistance-prd.md.

export const BUDGET_TIPS_BY_CONCERN: Record<string, string[]> = {
  income_gap: [
    "Build a 3-month essential-expenses buffer before giving notice, if you haven't already.",
    "Ask your current employer about a phased exit or reduced hours instead of a hard stop.",
    "Time big purchases or moves for after your first paycheck in the new role, not before.",
  ],
  training_costs: [
    "Look for free or financial-aid versions of paid certifications — many have audit options.",
    "Check if your current employer offers a tuition or certification reimbursement benefit before you leave.",
    "Community colleges and library systems often cover the same fundamentals as paid bootcamps for free.",
  ],
  retirement_plans: [
    "Avoid cashing out a 401(k) early if at all possible — the tax penalty usually outweighs the short-term relief.",
    "If you have an employer match, time your departure around your current vesting schedule.",
    "A rollover IRA keeps retirement savings growing tax-advantaged between jobs.",
  ],
  market_risk: [
    "Diversify your search across 2–3 adjacent industries so one slow-hiring sector doesn't stall you.",
    "Keep a short list of fallback roles in your current field in case the new market takes longer than planned.",
    "Check hiring trends for your target role over the last couple of quarters before committing your timeline.",
  ],
};

export const GENERAL_BUDGET_TIPS = [
  "Look into COBRA or ACA marketplace costs for health insurance before resigning — often the biggest hidden expense.",
  "Check whether your state offers unemployment benefits for approved retraining programs.",
  "Pause or cancel non-essential subscriptions for the transition window.",
];

export const INCOME_OPPORTUNITY_CATEGORIES = [
  "Freelance or contract work in your current field while you transition",
  "Part-time or per-diem work in your current field",
  "Paid tutoring, teaching, or consulting in your area of expertise",
  "Selling unused equipment or assets tied to your old role",
];
