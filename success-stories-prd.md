# Mini-PRD: Success Stories (Publish & Browse)

## The industry-standard pattern

Apps that let one user publish content for *everyone else* to see (LinkedIn posts, Airbnb host profiles, Glassdoor reviews, Product Hunt launches) converge on the same shape:

1. **Author flow**: a form the creator fills out, saved as their own record — not a message sent to an admin. Nothing to "approve" before it's saved as a draft.
2. **Publish is a status flip, not a separate submission.** The same record has an `is_published` flag. Draft → Published → Unpublished are all just toggles on one row the author owns and can revisit any time. This is what makes editing/unpublishing trivial later instead of needing a whole separate edit pipeline.
3. **Auto-publish, moderate after the fact** (not a pre-publish review queue) is the standard for v1 at this scale — LinkedIn, Product Hunt, etc. all work this way. A review queue only gets added once volume/abuse justifies the overhead. We already flagged this tradeoff in the main PRD: no moderation tooling yet, which is fine for a v1 with a small, trusted user base, but is a known gap before any public launch.
4. **One directory screen, server-filtered**, not client-side search over everything — a search box + filter chips that re-query rather than filtering an already-downloaded full list. Matters once there are more than a couple dozen stories.
5. **Content is attributed to a durable identity**, not a browsing session. This is the one piece that doesn't yet exist in this codebase — see the blocking dependency below before anything else here.

## ⚠️ Blocking dependency: this feature needs real accounts

Right now PivotPath has **no login system** — every visitor gets an anonymous `pp_session` cookie, explicitly marked `TEMPORARY` in the code (`src/lib/onboarding/session.ts`). That's fine for a private, resumable questionnaire, but it cannot support a feature whose entire point is "publish under your name, visible to every other user, indefinitely, and let people message you." A cookie in one browser can't be "the same person" to anyone else, can't survive clearing cookies or switching devices, and can't be who someone else's message is addressed to.

The original PRD always assumed real signup happens before the questionnaire (§3, decision 2) — the anonymous-session approach was a shortcut to get the questionnaire and roadmap built fast. Success Stories is the first feature that actually needs that shortcut resolved.

**Before this can be built, we need a minimal account system**: email/password (or OAuth) signup + login, session tied to a persistent `User` record, and the existing anonymous `UserProfile`/`Roadmap` data linked to that account instead of a bare session id. That's its own mini-PRD-sized chunk of work — happy to write it next if you want to tackle it before Success Stories, since it's a hard prerequisite, not a nice-to-have.

Everything below assumes that dependency is resolved.

## What it is

Lets a user who's completed their career transition publish a **Transition Story** — their own from/to roles, the steps they took, and tips for others — visible to every user in a searchable directory. Covers **Screens 15–18** from the main PRD (Transition Complete → Share Your Story → Success Stories directory → Story Detail). This is the "become a mentor" on-ramp: publishing a story *is* what makes someone a mentor in this app — there's no separate application or admin approval step, matching the earlier decision that mentors are opt-in former users, not an admin-curated pool.

The **Message** button on a story is a stub in this feature — it links toward the in-app messaging system (Screens 19–20), which is separate, not-yet-built scope. Until it exists, clicking Message shows a "Coming soon" state rather than opening a real conversation.

## Screens touched

| Screen | Purpose |
|---|---|
| Transition Complete | Shown once a user's roadmap is fully done (or they explicitly declare it complete). Celebration + "Share Your Story" CTA. *(Minimal — just the on-ramp into Share Your Story, not building out a bigger celebration flow.)* |
| Share Your Story | Create/edit form: display name, optional photo, from role, to role, industry, steps taken, tips. Same form in edit mode later (from wherever story management lives). |
| Success Stories directory | Browse/search/filter published stories by industry and free-text search. Grid of story cards, each linking to its detail page. *(Matches `connect_with_mentors_pivotpath`, with the "Schedule Call" button removed — see below — and the "Story of the Month" hero and "Apply to Mentor" card left out — see Out of Scope.)* |
| Story Detail | Full story (steps taken, tips) + Message button (stub) + basic author info. No Schedule/Call action — messaging-only contact was already decided in the main PRD. |

## Data saved

One `TransitionStory` per author (same entity already sketched in `PRD.md` §6.5):

| Field | Notes |
|---|---|
| `id` | |
| `author_user_id` | requires the account system above |
| `display_name` | required — how they want to appear; doesn't have to match legal/account name |
| `photo_url` | optional. **No file upload infra exists yet either** — ship v1 with an initials avatar fallback (like the mockup's search icon area does elsewhere) and treat real photo upload as a fast-follow, not a blocker |
| `from_role` | required, free text — pre-fillable from their `UserProfile.currentJobTitle` |
| `to_role` | required, free text — pre-fillable from `UserProfile.targetRole` |
| `industry` | required, single-select from the same industries list already used in onboarding (`industriesOfInterest` options), so directory filtering stays consistent |
| `steps_taken` | required, rich text or structured list — the "how I did it" narrative |
| `tips` | required, text — shown as the card excerpt in the directory |
| `is_published` | bool, default true on submit (auto-publish, per the pattern above) |
| `published_at` | set when `is_published` flips true |
| `unpublished_at` | nullable, set when the author takes it down |
| `created_at` / `updated_at` | |

Also needed: some signal that a user is *eligible* to publish (i.e., has completed their transition). Current schema has no such flag — recommend adding `transition_completed_at` (nullable timestamp) to whatever the `Roadmap` record becomes once tied to a real account, set either automatically when all milestones are marked done or via an explicit "I've completed my transition" action.

## In scope

- Share Your Story form (create + edit), gated on `transition_completed_at` being set
- Publish/unpublish toggle, author-owned (no admin approval step)
- Success Stories directory: grid of published stories, industry filter chips (populated from actual data, not hardcoded), free-text search across name/role/industry
- Story Detail page
- Message button as a visible-but-inert CTA (stub) pointing at the not-yet-built messaging feature
- Initials-avatar fallback when no photo is set

## Out of scope (separate features or explicitly deferred)

- **Real accounts/login** — hard prerequisite, described above, not part of this feature's own build
- **In-app messaging** (Screens 19–20) — the Message button is a stub only; wiring it up is its own feature
- **Photo upload** — v1 ships with initials-avatar fallback only; real upload needs file storage infra
- **"Story of the Month" featured banner** — requires an admin curation mechanism that doesn't exist anywhere in this app yet; the mockup's hero section is left out of v1
- **"Apply to Mentor" as a separate flow** — folded into Share Your Story; there's no approval queue to apply into
- **Moderation / report-content tooling** — already flagged as a known pre-launch gap in the main PRD; still not part of this build
- **Comments, likes, or reactions** on stories
- Calendar scheduling or video calls — out of scope app-wide, already decided
- Notifications for story views/replies — depends on both messaging and the notifications system, neither built yet

## Open questions for you

1. Want me to write the account-system mini-PRD next, since it's now a hard blocker? Or handle it differently — e.g. build the Share/Browse/Detail screens now against a placeholder `author_user_id` and swap it in once accounts exist, understanding the feature won't actually work end-to-end until then?
2. Should "transition complete" be automatic (all milestones marked done) or does the user need to explicitly declare it? The mockups don't show this decision point.
