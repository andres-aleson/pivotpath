# Mini-PRD: Account Creation (Sign Up, Log In, Data Migration)

## The industry-standard pattern

Email/password auth in a Next.js app converges on a handful of non-negotiables:

1. **Passwords are hashed (bcrypt), never stored or logged in plain text.** The database holds a one-way hash that can verify a login attempt but can never be reversed back into the original password.
2. **Sessions live in a signed, `httpOnly` cookie**, not `localStorage` — same reasoning as the existing `pp_session` cookie, so this isn't a new concept for this app, just a more durable version of it.
3. **One server-side auth check, used everywhere** (`auth()` in Auth.js), not scattered ad hoc cookie parsing. This replaces `getSessionId()` as the thing every page and server action calls first.
4. **Login errors are generic** — "Invalid email or password," never "no account with that email" — so a login form can't be used to check whether someone has an account (user enumeration).
5. **Signup auto-establishes a session.** No separate "now go log in" step — matches the existing PRD flow where Sign Up leads straight into the questionnaire.

## What it is

Covers **Screens 2–3** from the main PRD (Sign Up, Log In) using **Auth.js with a Credentials provider** (email + password), per your decision — plus the backend migration required to move every existing feature from anonymous `sessionId` cookies to real `userId` accounts. This is the prerequisite the last four features (Success Stories, Financial, the Dashboard) were all built around a stand-in for.

**Screen 4 (Forgot/Reset Password) is explicitly out of scope** — see below.

## Screens touched

| Screen | Purpose |
|---|---|
| Sign Up | Email + password + confirm password. Creates the account, hashes the password, immediately signs them in, and sends them into the questionnaire (Step 1) — same as the current "Get Started" destination. |
| Log In | Email + password. On success, resumes wherever their account left off: mid-questionnaire (existing `onboardingStep` logic, unchanged) or straight to the Dashboard if they'd already finished. |
| Homepage | Add the "Log In" link the main PRD already flagged as missing next to "Get Started." "Get Started" now routes to Sign Up instead of immediately clearing a session cookie. |
| Log Out | The top bar's `account_circle` icon is currently decorative — wire it to a real sign-out action. |

## Data saved

New `User` model:

| Field | Notes |
|---|---|
| `id` | |
| `email` | unique, required |
| `passwordHash` | bcrypt, required — the plain password is never persisted |
| `createdAt` / `updatedAt` | |

**Every existing sessionId-keyed table gets re-keyed to `userId`**: `UserProfile`, `Roadmap`, `TransitionStory`, `FinancialProfile` all currently have `sessionId String @unique` — each becomes `userId String @unique` with a relation to `User`. `getSessionId()` / `getOrCreateSessionId()` / `clearSession()` and the `pp_session` cookie are retired in favor of Auth.js's session helper.

Since none of the current data is tied to a real account, existing dev rows get wiped as part of this migration rather than building a "claim your anonymous session" flow — there's nothing real to preserve yet.

## A behavior change this forces: "Retake Questionnaire"

Today, retaking abandons the session entirely (clears the cookie, orphans the old rows under a random ID that's gone forever) — that was always flagged as temporary in the code. Once someone has a persistent account, that no longer makes sense: retaking should reset *that account's* questionnaire/roadmap data, not abandon the account. This PRD includes fixing that action to update in place under the same `userId` instead of orphaning data.

## In scope

- `User` model, bcrypt password hashing
- Auth.js, Credentials provider, JWT session strategy (no separate `Account`/`Session`/`VerificationToken` tables needed — those are for OAuth or database-backed sessions, neither of which apply here)
- Sign Up and Log In screens, with basic validation (valid email format, minimum password length, "email already registered" on signup, generic "invalid email or password" on login)
- Real Log Out, wired to the existing top-bar icon
- Migrating `UserProfile`, `Roadmap`, `TransitionStory`, and `FinancialProfile` from `sessionId` to `userId`, and updating every server action/page that currently reads `getSessionId()`
- Fixing "Retake Questionnaire" to reset in place rather than orphan the account
- Adding the "Log In" link to the homepage and repointing "Get Started" at Sign Up
- Gating every post-questionnaire route on a real signed-in user instead of "any cookie present"

## Out of scope

- **Forgot/Reset Password** — needs an email-sending service (e.g. Resend) that hasn't been chosen yet; a real password-reset-by-email flow is a separate mini-feature once that dependency is decided
- **Email verification on signup** — same email-service dependency
- **OAuth/social login** — you chose email+password only
- **Account Settings / editing your profile after the fact** (main PRD Screen 22) — separate feature; this PRD only covers creating and logging into the account, not managing it afterward
- **Rate limiting / brute-force login protection** — a real pre-launch gap, same category as the Gemini rate-limiting and content-moderation gaps already flagged; not blocking for continued local development
- **"Remember me" or multi-device session management** beyond Auth.js's default session expiry
- **Database hosting swap (Turso/Neon)** — separate, deploy-time concern, unaffected by this feature; accounts work fine against the local SQLite file for now

## Open question for you

Fine with deferring Forgot/Reset Password until an email service is picked? If someone forgets their password before that exists, there's currently no recovery path other than you manually resetting it in the database. Flag now if you'd rather block on that instead of shipping without it.
