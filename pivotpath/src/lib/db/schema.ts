import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgSchema,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const pivotpath = pgSchema("pivotpath");

export const user = pivotpath.table("User", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  email: text("email").notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const userProfile = pivotpath.table("UserProfile", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("userId")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),

  // Step 1: Your Profile
  currentJobTitle: text("currentJobTitle"),
  topSkills: jsonb("topSkills"),
  financialConcernType: text("financialConcernType"),
  industriesOfInterest: jsonb("industriesOfInterest"),

  // Step 2: Career Goal
  targetRole: text("targetRole"),
  stillDecidingRole: boolean("stillDecidingRole").notNull().default(false),
  transitionMotivation: text("transitionMotivation"),

  // Step 3: Background & Timeline
  yearsExperience: text("yearsExperience"),
  educationLevel: text("educationLevel"),
  weeklyTimeCommitment: text("weeklyTimeCommitment"),
  timelineUrgency: text("timelineUrgency"),

  // Wizard progress: the highest step this account may access (1-4),
  // and when the whole questionnaire was completed.
  onboardingStep: integer("onboardingStep").notNull().default(1),
  onboardingCompletedAt: timestamp("onboardingCompletedAt"),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// One roadmap per account — generated once from the completed UserProfile.
export const roadmap = pivotpath.table("Roadmap", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("userId")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  targetRole: text("targetRole").notNull(),
  generatedAt: timestamp("generatedAt").notNull().defaultNow(),

  // Set when the user declares their transition complete — the gate for
  // publishing a TransitionStory. Nullable: most roadmaps are still in progress.
  transitionCompletedAt: timestamp("transitionCompletedAt"),
});

export const milestone = pivotpath.table("Milestone", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  roadmapId: text("roadmapId")
    .notNull()
    .references(() => roadmap.id),

  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull(),

  // todo | in_progress | done
  status: text("status").notNull().default("todo"),
  completedAt: timestamp("completedAt"),
});

// One published story per account — the "become a mentor" artifact.
// Fake/demo rows use a fake "seed-" prefixed userId that no real account
// will ever match, so they don't collide with the User relation — hence no
// FK constraint here (deliberately not .references(() => user.id)).
export const transitionStory = pivotpath.table("TransitionStory", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("userId").notNull().unique(),

  displayName: text("displayName").notNull(),
  photoUrl: text("photoUrl"),
  fromRole: text("fromRole").notNull(),
  toRole: text("toRole").notNull(),
  industry: text("industry").notNull(),
  stepsTaken: text("stepsTaken").notNull(),
  tips: text("tips").notNull(),

  isPublished: boolean("isPublished").notNull().default(true),
  publishedAt: timestamp("publishedAt").notNull().defaultNow(),
  unpublishedAt: timestamp("unpublishedAt"),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// One per account — self-reported numbers only, never linked accounts or
// payment info. The Financial Plan (runway, tips) is computed live from
// these fields rather than stored, so it's never stale.
export const financialProfile = pivotpath.table("FinancialProfile", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("userId")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),

  monthlyIncomeDuringTransition: doublePrecision("monthlyIncomeDuringTransition").notNull(),
  essentialMonthlyExpenses: doublePrecision("essentialMonthlyExpenses").notNull(),
  currentSavings: doublePrecision("currentSavings").notNull(),
  financialConcernType: text("financialConcernType").notNull(),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const userRelations = relations(user, ({ one }) => ({
  profile: one(userProfile, {
    fields: [user.id],
    references: [userProfile.userId],
  }),
  roadmap: one(roadmap, {
    fields: [user.id],
    references: [roadmap.userId],
  }),
  financialProfile: one(financialProfile, {
    fields: [user.id],
    references: [financialProfile.userId],
  }),
}));

export const userProfileRelations = relations(userProfile, ({ one }) => ({
  user: one(user, {
    fields: [userProfile.userId],
    references: [user.id],
  }),
}));

export const roadmapRelations = relations(roadmap, ({ one, many }) => ({
  user: one(user, {
    fields: [roadmap.userId],
    references: [user.id],
  }),
  milestones: many(milestone),
}));

export const milestoneRelations = relations(milestone, ({ one }) => ({
  roadmap: one(roadmap, {
    fields: [milestone.roadmapId],
    references: [roadmap.id],
  }),
}));

export const financialProfileRelations = relations(financialProfile, ({ one }) => ({
  user: one(user, {
    fields: [financialProfile.userId],
    references: [user.id],
  }),
}));

export type User = typeof user.$inferSelect;
export type UserProfile = typeof userProfile.$inferSelect;
export type Roadmap = typeof roadmap.$inferSelect;
export type Milestone = typeof milestone.$inferSelect;
export type TransitionStory = typeof transitionStory.$inferSelect;
export type FinancialProfile = typeof financialProfile.$inferSelect;
