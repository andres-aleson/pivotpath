import { createId } from "@paralleldrive/cuid2";
import { boolean, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

export const pivotpath = pgSchema("pivotpath");

// The only thing PivotPath persists — everything else (questionnaire answers,
// generated roadmap, financial numbers) lives only in the browser for the
// current visit and is never saved. Publishing a story is the one explicit,
// consented exception, so other visitors can read it in Success Stories.
export const transitionStory = pivotpath.table("TransitionStory", {
  id: text("id").primaryKey().$defaultFn(() => createId()),

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

export type TransitionStory = typeof transitionStory.$inferSelect;
