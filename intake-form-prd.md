# Mini-PRD: Onboarding Questionnaire (Intake Form)

## The industry-standard pattern

Multi-step data-collection forms (LinkedIn profile setup, TurboTax, Notion onboarding, etc.) converge on the same pattern, and we should follow it exactly because it's what makes this easy to build correctly:

1. **Wizard UI**: a fixed sequence of steps with a visible progress indicator ("Step 2 of 4" / a % bar) — already in your mockup.
2. **Autosave per step, not one big submit at the end.** Each "Continue" click persists that step's answers to the backend immediately (upsert against the user's record), not just to local component state. This is the part apps get wrong when they *don't* follow the standard — if the user closes the tab on step 3, a "submit once at the end" design loses everything they entered. Saving per step means nothing is lost.
3. **One draft record per user**, with a pointer to how far they've gotten. Not a new row per step, not an event log — one row that fills in as they go.
4. **Resumable.** If a signed-in user with an incomplete questionnaire returns to `/onboarding`, they land back on the step they left off at, with prior answers pre-filled.
5. **Step-level validation** (via schema, not ad hoc if-checks) blocks "Continue" until that step's required fields are valid; the final step is a read-only review of everything with "Edit" links back into specific steps.

**Recommended implementation approach** (so the build is straightforward): a Zod schema per step for validation, React Hook Form for step-level form state, and a single upsert API route (`PATCH /api/onboarding`) that saves whatever step's fields are sent and advances the stored step pointer. This is the standard React Hook Form + Zod pairing used across most current Next.js apps for exactly this kind of form.

## What it is

The 4-step questionnaire that collects a new user's current situation, target role, and background so the app can later generate their personalized roadmap. Covers **Screens 5–8** from the main PRD (Questionnaire Steps 1–4). Runs after signup, before the user reaches their Dashboard.

## Screens touched

| Screen | Purpose |
|---|---|
| Step 1: Your Profile | Current job title, top skills, financial concern, industries of interest *(matches existing mockup)* |
| Step 2: Career Goal | Target role (or "help me figure it out"), motivation for transitioning |
| Step 3: Background & Timeline | Years of experience, education level, weekly time available, urgency |
| Step 4: Review | Read-only summary of Steps 1–3 with per-section "Edit" links, and the final Submit action |

## Data saved

One `UserProfile` record per user (this is the same entity already defined in `PRD.md` §6.2 — this feature is what populates it), plus two fields to drive the wizard mechanics:

| Field | From step | Notes |
|---|---|---|
| `current_job_title` | 1 | required, text |
| `top_skills[]` | 1 | required, min 1 |
| `financial_concern_type` | 1 | required, enum: income_gap / training_costs / retirement_plans / market_risk |
| `industries_of_interest[]` | 1 | required, min 1 |
| `target_role` | 2 | optional — nullable if user picks "help me figure it out" |
| `transition_motivation` | 2 | required, text or short select |
| `years_experience` | 3 | required |
| `education_level` | 3 | required, enum |
| `weekly_time_commitment` | 3 | required, enum/number |
| `timeline_urgency` | 3 | required, enum: exploring / planning / already_transitioning |
| `onboarding_step` | wizard state | int, which step to resume at |
| `onboarding_completed_at` | wizard state | nullable timestamp; set on final submit |

Saved via upsert keyed by `user_id` — created on Step 1's first "Continue," updated on every subsequent step.

## In scope

- The 4-step wizard UI (extending the existing Step 1 mockup pattern to Steps 2–4)
- Zod validation schema per step; "Continue" disabled until the current step is valid
- Persisting answers to the backend after each step (not just at the end)
- Resuming at the correct step if the user leaves and comes back to `/onboarding`
- Editing earlier answers via Back or via the Step 4 review screen's edit links
- Marking the questionnaire complete (`onboarding_completed_at`) on final submit
- Basic accessible form semantics — labels, inline error messages, keyboard navigation

## Out of scope (separate features)

- **AI roadmap generation** and the "Generating Your Plan" / "Roadmap Preview" screens (Screens 9–10) — this feature's final Submit just saves the data and hands off to a stub destination until that feature exists
- **Financial Check-In questionnaire** (Screens 11–12) — separate flow entirely
- **Editing profile answers post-onboarding** — that's the Account Settings screen (Screen 22); whether an edit there should trigger roadmap regeneration is that feature's decision, not this one
- **App-wide gating** that blocks access to the Dashboard/other screens until onboarding is complete — this feature only handles resuming *within* the `/onboarding` flow itself; whether other routes redirect incomplete users here is a follow-up for whichever feature builds the Dashboard
- Localization/multi-language support
- Answer history or versioning (only the current draft matters, no audit trail)
- Drop-off analytics/instrumentation

## Open question for you

Step 4's Submit needs to redirect *somewhere*. Since roadmap generation isn't built yet, I'd point it at a placeholder ("Thanks — we're building your roadmap" stub, or straight to the Dashboard shell) until that feature lands. Flag if you'd rather block on that instead of stubbing it.
