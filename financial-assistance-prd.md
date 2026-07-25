# Mini-PRD: Financial Assistance Questionnaire & Plan

## The industry-standard pattern

Runway/budget tools (YNAB, personal-finance-app "can I afford to quit" calculators, etc.) converge on a pattern that's worth following deliberately here, because it's different from how we built the roadmap:

1. **Plain math, not AI.** Runway and budget-trimming math is deterministic — `savings ÷ monthly burn`. Apps in this space don't run self-reported income/expenses through a model; they compute transparently so the user can trust and audit the number. This matters more here than it did for the roadmap: the roadmap being slightly generic is a minor inconvenience, but a black-box number about someone's financial runway needs to be verifiably correct.
2. **One short form, not a wizard.** Four fields don't need a multi-step flow with a progress bar — that's the onboarding questionnaire's pattern, not this one.
3. **Recompute on save, not "Generate."** Because it's just arithmetic, there's no async generation step, no loading screen, no risk of going stale — the plan should just always reflect whatever numbers are currently saved.
4. **Edit-in-place, always current.** No version history or snapshots needed for v1 — updating a number immediately updates the plan.
5. **Higher data sensitivity than anything else in the app so far.** This is the first feature touching real income/savings numbers. That changes a recommendation below.

## Recommendation: skip the AI, use static rules

For the roadmap, we sent self-reported career info to Gemini's free tier, which trains on it — you explicitly accepted that tradeoff at the time. I'd **not** make the same call here. Income, expenses, and savings are meaningfully more sensitive than "I'm a marketing manager who wants to be a PM," and the main PRD already flags this store as sensitive/restricted (§6.4). Recommended approach: compute runway with plain math, and pull budget-trimming tips and income-opportunity ideas from a small static, curated set keyed off `financial_concern_type` (the same enum already collected in onboarding Step 1) — nothing user-specific ever leaves the server. If you'd rather have Gemini generate more personalized tips the way it does the roadmap, say so and I'll adjust, but my default here is no third-party call at all.

## What it is

Covers **Screens 11–12** from the main PRD: a short check-in form (income during transition, essential monthly expenses, current savings, financial concern) and a resulting Financial Plan (runway in months, budget-trimming suggestions, income-opportunity categories). This is what the Dashboard's "Financial Guide" card links to, replacing the current "coming soon" placeholder at `/financial`.

## Screens touched

| Screen | Purpose |
|---|---|
| Financial Check-In | One-screen form: monthly income during transition (can be $0), essential monthly expenses, current savings, financial concern type (pre-filled from `UserProfile.financialConcernType`, editable). |
| Your Financial Plan | Runway ("X months at your current savings and spending"), budget-trimming suggestions, income-opportunity categories — all derived live from the numbers above. An "Update My Numbers" action reopens the check-in form pre-filled with the current values. |

Entry point: the Dashboard's Financial Guide card. First visit → Check-In form. Once numbers exist, the card and `/financial` go straight to the Plan screen instead.

## Data saved

One `FinancialProfile` per session (same `sessionId`-keyed, no-login pattern as the rest of the app — same caveat as everywhere else that this becomes account-keyed once real auth exists):

| Field | Notes |
|---|---|
| `sessionId` | unique |
| `monthlyIncomeDuringTransition` | required, number, ≥ 0 (0 is valid — no income during transition) |
| `essentialMonthlyExpenses` | required, number, > 0 |
| `currentSavings` | required, number, ≥ 0 |
| `financialConcernType` | required, same enum as onboarding (income_gap / training_costs / retirement_plans / market_risk), pre-filled but editable |
| `createdAt` / `updatedAt` | |

No separate `FinancialPlan` table: since the plan is pure math + static content keyed off the profile fields, it's computed on every page load rather than stored and regenerated. Simpler than the roadmap's persisted-generation approach, and it also means the numbers can never go stale relative to what's saved. (If you want AI-generated, cached content instead — see the recommendation above — that would change this and bring back something closer to the `FinancialPlan` entity sketched in the main PRD.)

## Calculation logic (deterministic)

- `monthlyBurn = essentialMonthlyExpenses − monthlyIncomeDuringTransition`
- If `monthlyBurn > 0`: `runwayMonths = currentSavings ÷ monthlyBurn`, shown as "You have about N months of runway at this pace."
- If `monthlyBurn ≤ 0` (income covers expenses): no countdown — show a "You're currently breaking even or better" state instead of a runway number.
- Budget-trimming suggestions and income-opportunity categories: 3–4 static tips per `financial_concern_type`, plus a couple of concern-agnostic ones (e.g. "look into COBRA/insurance cost changes before resigning," "check whether your state offers retraining unemployment benefits").

## In scope

- Financial Check-In form (single screen, React Hook Form + Zod, matching existing form patterns) with validation (non-negative numbers, required fields)
- Live runway calculation and static, concern-type-keyed budget/income-opportunity content
- Financial Plan screen, revisitable anytime from the Dashboard
- "Update My Numbers" edit flow that recalculates immediately on save
- Replacing the current `/financial` placeholder with this real flow

## Out of scope

- **Any AI-generated financial advice** — recommended against above; flag if you want this reconsidered
- **Real bank-linking, billing, or payment data** — never, by design, per the main PRD
- **Licensed investment/personalized financial advice** — this is budget/runway math only; if asked, the app should point users to a licensed advisor, not answer as one
- **Real grant or funding matching** (e.g. the mockup's "$2,500 Tech Transition Grant") — that implies an eligibility engine and a real grants database that don't exist; already left out of the Dashboard for the same reason
- **Plan history/versioning** — always reflects the latest saved numbers, no snapshots
- **Multi-currency support**
- Real accounts — same standing dependency as the rest of the app

## Open question for you

Confirm the "static rules, no AI" call above — that's the one real decision point in this feature. Everything else follows established patterns from the onboarding form and the roadmap dashboard.
