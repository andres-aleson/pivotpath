# Mini-PRD: Roadmap Generation

## The industry-standard pattern for AI in an app

Every production pattern for adding an LLM to an app converges on the same shape, and it's what makes this straightforward to build correctly — this holds regardless of which provider you use:

1. **The API call happens server-side only.** The model provider's API key never reaches the browser — it lives in a server action / API route, same as any other secret. This isn't optional hardening, it's the baseline.
2. **Ask for structured output, not prose to parse.** Since we need discrete, storable fields (milestone title, description, order, status), the standard approach is to constrain the model's response to a JSON schema and validate it — not ask for markdown and regex it apart. Gemini supports this directly (`responseSchema` / JSON mode). We already use Zod everywhere in this codebase for exactly this kind of validation, so the pattern is: define the roadmap shape once as a Zod schema, convert it to the JSON schema Gemini expects, and re-validate whatever comes back against that same Zod schema before saving — defense in depth, since a free-tier model's schema adherence is less strictly guaranteed than what you'd get from a provider's own typed SDK helper.
3. **Generate once, persist, serve from the database after that.** Generation is slow (several seconds). The standard is: generate on an explicit trigger, save the structured result, and every subsequent view reads from the database — never regenerate on page load.
4. **A visible loading state owns the wait.** Since generation takes a few seconds, the UI needs an explicit "working on it" state (matches your mockup's "Generating Your Plan" screen) rather than a frozen button.
5. **Treat model failures as a normal error path, not an edge case.** The call can fail (timeout, rate limit, the model returning something that doesn't fit the schema). Standard handling: surface a retry action, don't show broken partial data.

**Recommended implementation**: Google's official Gemini SDK for Node/TypeScript, called from a Server Action (same architecture as the questionnaire's `saveStep*` actions) — the exact package name has changed as Google has iterated (`@google/generative-ai` → `@google/genai`), so confirm the current one at implementation time rather than trusting this doc. **Model: a current Flash-tier model** (e.g. Gemini 2.5 Flash or newer — Google ships new Flash versions often, so check `ai.google.dev` for whatever's current; Flash-tier is what's free, the Pro-tier models are paid-only). Request JSON-mode structured output constrained to the roadmap schema, then re-validate with Zod before writing to the database.

## What it is

The feature that turns a completed questionnaire into an actual roadmap: a one-time AI call that reads the user's saved answers and produces a named target role plus an ordered list of milestones, which then gets saved and displayed. Covers **Screens 9–10** from the main PRD (Generating Your Plan, Roadmap Preview) and reuses **Screen 14**'s existing mockup (Roadmap Detail) as the page that displays the result.

This replaces the `/onboarding/complete` placeholder built in the questionnaire feature — Step 4's Submit now leads here instead of to a "coming soon" message.

## Screens touched

| Screen | Purpose |
|---|---|
| Generating Your Plan | Loading state shown while the AI call runs; error + retry state if it fails |
| Your Roadmap | The generated roadmap — target role, milestone timeline, status per milestone *(matches your existing `your_career_roadmap_roadmap_assistance_overview` mockup)* |

## Data saved

Two new tables, keyed to the same anonymous session as `UserProfile`:

| Table | Field | Notes |
|---|---|---|
| `Roadmap` | `id` | |
| | `sessionId` | unique — one roadmap per session, enforces "generate once" |
| | `targetRole` | the role the roadmap is built toward (model-confirmed, may refine what the user typed in Step 2) |
| | `generatedAt` | timestamp |
| `Milestone` | `id` | |
| | `roadmapId` | |
| | `title`, `description` | |
| | `order` | int, defines timeline sequence |
| | `status` | `todo` / `in_progress` / `done` — starts at `todo`, user-updatable |
| | `completedAt` | nullable, set when status → `done` |

Overall progress % is computed from milestone statuses at render time, not stored — avoids it silently drifting out of sync.

## In scope

- Server action that reads a session's `UserProfile`, calls Claude (structured output, Zod-validated) to produce a target role + ordered milestone list, and persists it as `Roadmap` + `Milestone` rows
- Generate-once guard: if a `Roadmap` already exists for the session, skip generation and go straight to viewing it
- Loading screen while the call is in flight, with an error state and a "Try Again" action if it fails
- The Roadmap Detail screen displaying the result, matching your existing mockup
- Basic milestone status updates (todo → in progress → done) so the progress bar means something
- Wiring Step 4's Submit to this flow instead of the current placeholder stub

## Out of scope (separate features or later work)

- **Grounding on real success stories.** The product vision is a roadmap "based on other people's successes," but the Transition Stories feature (Screens 16–18) doesn't exist yet — there's no data to ground on. This version generates from the model's own knowledge plus the user's questionnaire answers only. Revisit once Stories exist.
- **Regeneration.** No "Regenerate my roadmap" action, and editing profile answers later (Account Settings, not built) doesn't trigger a new generation. First generation is final for this version.
- **Financial Check-In / Financial Plan** (Screens 11–12) — separate flow.
- **Linking milestones to resources** — the Resource Library doesn't exist yet.
- **Manually editing, adding, reordering, or deleting milestones** — only status can change.
- **Dashboard** (aggregated home screen) — separate feature that will eventually show a roadmap snapshot; not built here.
- **Streaming the generation response** for a live "typing" effect — the loading screen is a simple spinner-and-wait; streaming is a possible later polish, not needed for v1.

## Why Gemini's free tier, and what it actually costs you

Checked current terms at `ai.google.dev` before writing this — two things worth deciding deliberately rather than defaulting into:

1. **Free-tier prompts and outputs are used by Google to improve their products.** Paid tiers explicitly exclude this; the free tier does not. That means, on the free tier, users' career-transition answers (job title, skills, financial concern category, motivation for leaving their job) would be sent to a third party under terms that allow Google to use that content for training. For a product whose whole pitch is helping people through a personal, sometimes financially stressful transition, that's a real privacy tradeoff, not just a technical footnote.
2. **Google positions the free tier for "developers and small projects getting started," explicitly contrasted with paid tiers for "production applications."** There's no uptime/reliability commitment at that tier, and rate limits are tighter than paid. Fine for building and validating; something to graduate off of before this has real users depending on it.

Given that, my recommendation: use the Gemini free tier now, since the goal is validating the feature, not running it at scale yet — but don't treat "free" as the permanent answer. If PivotPath gets real users, moving to a paid tier (Gemini or otherwise) before that data-usage clause applies to their actual financial and career details is worth planning for, not an afterthought.

**Open question for you:** are you okay building against the free tier with that data-usage tradeoff for now, or would you rather I keep this on a paid-but-cheap option (e.g. Claude Haiku, or Gemini's paid tier) from the start so user answers are never used for training, even during early testing?
