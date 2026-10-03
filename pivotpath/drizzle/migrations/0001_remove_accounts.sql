ALTER TABLE "pivotpath"."FinancialProfile" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pivotpath"."Milestone" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pivotpath"."Roadmap" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pivotpath"."User" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pivotpath"."UserProfile" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "pivotpath"."FinancialProfile" CASCADE;--> statement-breakpoint
DROP TABLE "pivotpath"."Milestone" CASCADE;--> statement-breakpoint
DROP TABLE "pivotpath"."Roadmap" CASCADE;--> statement-breakpoint
DROP TABLE "pivotpath"."User" CASCADE;--> statement-breakpoint
DROP TABLE "pivotpath"."UserProfile" CASCADE;--> statement-breakpoint
ALTER TABLE "pivotpath"."TransitionStory" DROP CONSTRAINT "TransitionStory_userId_unique";--> statement-breakpoint
ALTER TABLE "pivotpath"."TransitionStory" DROP COLUMN "userId";