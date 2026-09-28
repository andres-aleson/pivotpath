-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Roadmap" DROP CONSTRAINT "Roadmap_userId_fkey";

-- DropForeignKey
ALTER TABLE "Milestone" DROP CONSTRAINT "Milestone_roadmapId_fkey";

-- DropForeignKey
ALTER TABLE "TransitionStory" DROP CONSTRAINT "TransitionStory_userId_fkey";

-- DropForeignKey
ALTER TABLE "FinancialProfile" DROP CONSTRAINT "FinancialProfile_userId_fkey";

-- DropTable
DROP TABLE "UserProfile";

-- DropTable
DROP TABLE "Roadmap";

-- DropTable
DROP TABLE "Milestone";

-- DropTable
DROP TABLE "FinancialProfile";

-- DropTable
DROP TABLE "User";

-- DropIndex
DROP INDEX "TransitionStory_userId_key";

-- AlterTable
ALTER TABLE "TransitionStory" DROP COLUMN "userId";
