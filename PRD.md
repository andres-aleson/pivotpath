# PivotPath — Product Requirements Document (Draft v2)

## 1. Product Summary

PivotPath is a free web app that helps people navigate a career transition by:
1. Generating a **personalized roadmap** based on the user's current skills, target career, and the paths of similar people who succeeded before them.
2. Connecting users with **real people who've made a similar transition** — these are former users themselves, who chose to publish their story after completing their own transition.
3. Giving **personalized financial guidance** (self-reported numbers only, no billing/bank info) so the user can manage the transition without risking their financial stability.

## 2. Personas (from user stories)

| Persona | Core need | Emotional state |
|---|---|---|
| **The Nervous Wreck** | A clear, concrete, step-by-step plan so they don't have to figure it out alone | Overwhelmed, needs structure |
| **The Uncertain Survivor** | Proof it's possible (peer stories) + a way to not go broke while retraining | Doubtful, financially anxious |

## 3. Key Decisions (confirmed)

1. **Mentors = past users who opted to go public, not admin-curated content.** Once a user completes their own transition, they're invited to publish a story: name, photo (optional), the role they switched from, the role they switched to, the steps they took, and any tips for others. No billing or other personal info is ever included. Once published, any other user can reach them via **in-app messaging only** — no scheduling, no calls, no video. This merges what were two separate "Mentor" and "Success Story" concepts in the mockups into a single **Transition Story** — which matches your dashboard mockup's own section heading, "Success Stories & Mentors."
2. **Account creation happens before the questionnaire**, not after, so results/roadmap are tied to the user from the start and there's no post-survey "gotcha." Sign Up is the second screen in the flow, right after the homepage CTA.
3. **Messaging is in-app only** — no email or SMS delivery of message content.
4. **No billing/bank data, ever.** Financial guidance is generated purely from self-reported numbers (income, expenses, savings) the user types in — never linked accounts, never payment info.
5. Screens beyond the 5 mockups are expected and will keep growing as we progress — the mockups were always meant to be a glimpse, not the full set.

## 4. Full Screen List

Legend: 🎨 = you already have a Stitch mockup · 🆕 = implied by the happy path, not mocked up yet

### A. Public / Marketing
| # | Screen | Status |
|---|---|---|
| 1 | Homepage | 🎨 `pivotpath_career_transition_platform` |

### B. Auth
| # | Screen | Status |
|---|---|---|
| 2 | Sign Up | 🆕 |
| 3 | Log In | 🆕 |
| 4 | Forgot / Reset Password | 🆕 |

### C. Onboarding (the questionnaire flow — happens right after signup)
| # | Screen | Status |
|---|---|---|
| 5 | Questionnaire — Step 1: Your Profile | 🎨 `onboarding_tell_us_your_story` |
| 6 | Questionnaire — Step 2: Career Goal | 🆕 |
| 7 | Questionnaire — Step 3: Background & Timeline | 🆕 |
| 8 | Questionnaire — Step 4: Review Your Answers | 🆕 |
| 9 | Generating Your Plan (loading state) | 🆕 |
| 10 | Your Roadmap Preview (suggestions + relevant stories) | 🆕 |

### D. Financial
| # | Screen | Status |
|---|---|---|
| 11 | Financial Check-In Questionnaire | 🆕 |
| 12 | Your Financial Plan | 🆕 |

### E. Core App (signed in)
| # | Screen | Status |
|---|---|---|
| 13 | Dashboard (Home) | 🎨 `your_career_dashboard` |
| 14 | Roadmap Detail | 🎨 `your_career_roadmap_roadmap_assistance_overview` |
| 15 | Transition Complete (celebration + invite to share story) | 🆕 |

### F. Stories & Messaging
| # | Screen | Status |
|---|---|---|
| 16 | Share Your Story (publish form) | 🆕 |
| 17 | Success Stories & Mentors (browse/search/filter) | 🎨 (was `connect_with_mentors_pivotpath`, scope adjusted — see §6) |
| 18 | Transition Story Detail (full story + Message button) | 🆕 |
| 19 | Messages (inbox) | 🆕 |
| 20 | Message Thread | 🆕 |

### G. Resources
| # | Screen | Status |
|---|---|---|
| 21 | Resource Library (guides, playbooks) | 🆕 |

### H. Account & System
| # | Screen | Status |
|---|---|---|
| 22 | Profile & Account Settings (incl. managing your published story) | 🆕 |
| 23 | Notifications | 🆕 |
| 24 | Help / FAQ / Contact Support | 🆕 |
| 25 | Empty / Error states (404, no results, generic error) | 🆕 (cross-cutting, not a distinct flow) |

## 5. Screen-by-Screen Descriptions

**1. Homepage** — Explains what PivotPath does and its three pillars (roadmap, mentors, financial guidance); social proof; CTA into signup. *Gap to note: the mockup header only has "Get Started" — it should also have a "Log In" link for returning users.*

**2. Sign Up** — Email + password (or OAuth) account creation. First step after the homepage CTA, before any questionnaire.

**3. Log In** — Returning-user auth, links to password reset.

**4. Forgot / Reset Password** — Standard email-link reset flow.

**5. Questionnaire Step 1 — Your Profile** — Current job title, top skills, biggest financial concern, industries of interest. *(Matches your mockup.)*

**6. Questionnaire Step 2 — Career Goal** — Target job/role or field (if known), or "help me figure it out"; what's motivating the change.

**7. Questionnaire Step 3 — Background & Timeline** — Years of experience, education/certifications, weekly time available for retraining, urgency (e.g. "still employed, exploring" vs. "already left my job").

**8. Questionnaire Step 4 — Review** — Summary of all answers with edit links before generating the plan; matches the "Step X of 4" progress pattern in your mockup.

**9. Generating Your Plan** — Short loading/processing screen while the roadmap is generated.

**10. Your Roadmap Preview** — Shows the AI-generated roadmap summary plus 2–3 relevant Transition Stories from people with a similar starting point. Since the account already exists at this point, this can save straight to the user's Dashboard — no separate signup gate needed.

**11. Financial Check-In Questionnaire** — Short form: income during transition (if any), essential monthly expenses, current savings, financial concern type (may prefill from Step 1).

**12. Your Financial Plan** — Runway calculation, budget-trimming suggestions, and categories of income opportunities (freelance, part-time, etc.) generated purely from the numbers the user typed in. Informational only, no linked accounts. Persistent/revisitable from the Dashboard.

**13. Dashboard (Home)** — Signed-in landing page: roadmap progress snapshot, financial plan snapshot, recommended Transition Stories, resource highlights. *(Matches your mockup.)*

**14. Roadmap Detail** — Full milestone timeline for the target role, each milestone's status (todo/in progress/done), linked resources. *(Matches your mockup.)*

**15. Transition Complete** — Shown when a user finishes their roadmap (marks the final milestone done, or explicitly declares "I completed my transition"). Celebrates the milestone and invites them to publish their own Transition Story to help the next person — this is the on-ramp that turns users into mentors.

**16. Share Your Story** — Publish form: name (as they want it shown), optional photo, role transitioned from, role transitioned to, the steps they took, tips for others, industry tags. Also used later in **edit mode** from Account Settings to update or unpublish. No financial or billing fields ever appear here.

**17. Success Stories & Mentors** — Browse/search/filter published Transition Stories by industry and from→to role. This is the single directory that serves both "find someone to message" and "read for confidence" needs — matching the section heading already in your dashboard mockup.

**18. Transition Story Detail** — Full story write-up (steps taken, tips) plus a **Message** button to contact the author in-app. No Schedule/Call action.

**19. Messages (inbox)** — List of the user's conversations (as both a seeker reaching out, and, once published, as a story author being reached out to).

**20. Message Thread** — 1:1 in-app chat view with another user.

**21. Resource Library** — Downloadable/linked guides (e.g. "The Pivot Playbook," financial guide referenced in your dashboard mockup), organized by topic.

**22. Profile & Account Settings** — Edit questionnaire answers (should be able to trigger roadmap regeneration), manage/edit/unpublish your Transition Story if you've published one, notification preferences, password change, delete account/data.

**23. Notifications** — Panel/page behind the bell icon already present in your mockups (new messages, milestone reminders, story-publish confirmations).

**24. Help / FAQ / Contact Support** — Behind the "Help" link already present in your roadmap mockup's sidebar.

**25. Empty / Error states** — Not a unique flow, but every list screen (stories, messages, roadmap before generation) needs a defined empty state, plus a 404/generic error page.

## 6. Data Model — What Gets Saved, and Where

Organized by logical store. Naming is illustrative, not a committed schema.

### 6.1 Identity & Auth store (most sensitive — restricted access)
- **User**: id, email, hashed password (or OAuth identity), name, created_at, email_verified, last_login

### 6.2 User Profile store
- **UserProfile**: user_id, current_job_title, top_skills[], years_experience, education_level, industries_of_interest[], target_role, transition_motivation, timeline_urgency, weekly_time_commitment, has_completed_transition (bool)
- Sourced from Questionnaire Steps 1–4; editable later from Account Settings. Edits should be able to trigger roadmap regeneration.

### 6.3 Roadmap / Plan store
- **Roadmap**: id, user_id, target_role, generated_at, overall_progress_pct, completed_at (nullable), source_story_ids[] (which peer Transition Stories the plan was grounded in — keeps "based on other people's successes" explainable/traceable)
- **Milestone**: id, roadmap_id, title, description, order, status (todo/in_progress/done), completed_at, linked_resource_ids[]

### 6.4 Financial store (sensitive — restricted access, consider encryption at rest)
- **FinancialProfile**: user_id, monthly_income_during_transition, essential_monthly_expenses, current_savings, financial_concern_type
- **FinancialPlan**: id, user_id, generated_at, target_runway_months, budget_recommendations[], income_opportunity_categories[]
- No billing, bank-linking, or payment fields anywhere in this store, by design.

### 6.5 Transition Stories store (user-generated, opt-in public)
- **TransitionStory**: id, **author_user_id**, display_name, photo_url (optional), from_role, to_role, industry, steps_taken (structured list or rich text), tips, is_published (bool), published_at, unpublished_at (nullable)
- Replaces the earlier "Mentor" and "SuccessStory" split — one record per person, authored by the user themselves once `has_completed_transition` is true. Unpublishing hides it from Screens 17/18 without deleting the user's underlying account data.

### 6.6 Messaging store
- **Conversation**: id, participant_user_ids[2], created_at
- **Message**: id, conversation_id, sender_id, body, sent_at, read_at
- Content lives only in-app; never mirrored to email/SMS.

### 6.7 Resources store
- **Resource**: id, title, type (pdf/article/link), url, category, related_tags[]

### 6.8 System
- **Notification**: id, user_id, type, message, link, read_at, created_at
- **ConsentLog**: user_id, consent_type (data usage / financial data / story publication), timestamp

### 6.9 Handling notes
- A user's FinancialProfile/FinancialPlan should be visible only to that user — never surfaced to other users, including someone they're messaging.
- Publishing a TransitionStory is an explicit, revocable opt-in (Screen 16); nothing from UserProfile or FinancialProfile is ever pulled into it automatically.
- Roadmap regeneration after a profile edit should version/timestamp rather than silently overwrite, so a user doesn't lose visible progress on milestones they already completed.
- This structure is storage-agnostic (works as relational tables or document collections) — happy to adjust once we pick the actual stack.

## 7. Suggested Out-of-Scope for v1

To keep the first build achievable, I'd explicitly exclude these unless you say otherwise:
- Real-time calendar sync or in-app scheduling — confirmed out of scope; contact is messaging-only.
- Video calling inside the app.
- Any actual money movement, payroll, bank-linking, or gig-platform integration (education/links only).
- Moderation/reporting tooling as user-facing screens for v1 — worth flagging now though: since any user can publish a public story and message other users, you'll likely want at least a basic **Report** action and an admin review queue before public launch. Not building it doesn't remove the need — happy to add it to the screen list if you want it in v1 rather than fast-follow.

---

Let me know if the moderation/reporting point in §7 should move into v1, and otherwise I'll treat this as the working plan.
