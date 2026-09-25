CREATE SCHEMA IF NOT EXISTS "pivotpath";
--> statement-breakpoint
CREATE TABLE "pivotpath"."FinancialProfile" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"monthlyIncomeDuringTransition" double precision NOT NULL,
	"essentialMonthlyExpenses" double precision NOT NULL,
	"currentSavings" double precision NOT NULL,
	"financialConcernType" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "FinancialProfile_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "pivotpath"."Milestone" (
	"id" text PRIMARY KEY NOT NULL,
	"roadmapId" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"order" integer NOT NULL,
	"status" text DEFAULT 'todo' NOT NULL,
	"completedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "pivotpath"."Roadmap" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"targetRole" text NOT NULL,
	"generatedAt" timestamp DEFAULT now() NOT NULL,
	"transitionCompletedAt" timestamp,
	CONSTRAINT "Roadmap_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "pivotpath"."TransitionStory" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"displayName" text NOT NULL,
	"photoUrl" text,
	"fromRole" text NOT NULL,
	"toRole" text NOT NULL,
	"industry" text NOT NULL,
	"stepsTaken" text NOT NULL,
	"tips" text NOT NULL,
	"isPublished" boolean DEFAULT true NOT NULL,
	"publishedAt" timestamp DEFAULT now() NOT NULL,
	"unpublishedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "TransitionStory_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "pivotpath"."User" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"passwordHash" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "pivotpath"."UserProfile" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"currentJobTitle" text,
	"topSkills" jsonb,
	"financialConcernType" text,
	"industriesOfInterest" jsonb,
	"targetRole" text,
	"stillDecidingRole" boolean DEFAULT false NOT NULL,
	"transitionMotivation" text,
	"yearsExperience" text,
	"educationLevel" text,
	"weeklyTimeCommitment" text,
	"timelineUrgency" text,
	"onboardingStep" integer DEFAULT 1 NOT NULL,
	"onboardingCompletedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "UserProfile_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "pivotpath"."FinancialProfile" ADD CONSTRAINT "FinancialProfile_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "pivotpath"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pivotpath"."Milestone" ADD CONSTRAINT "Milestone_roadmapId_Roadmap_id_fk" FOREIGN KEY ("roadmapId") REFERENCES "pivotpath"."Roadmap"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pivotpath"."Roadmap" ADD CONSTRAINT "Roadmap_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "pivotpath"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pivotpath"."UserProfile" ADD CONSTRAINT "UserProfile_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "pivotpath"."User"("id") ON DELETE cascade ON UPDATE no action;