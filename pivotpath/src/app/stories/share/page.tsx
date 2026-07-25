import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/onboarding/session";
import { ShareStoryForm } from "@/app/stories/share/ShareStoryForm";

export default async function ShareStoryPage() {
  const sessionId = await getSessionId();
  if (!sessionId) redirect("/onboarding");

  const roadmap = await prisma.roadmap.findUnique({
    where: { sessionId },
    include: { milestones: { orderBy: { order: "asc" } } },
  });
  if (!roadmap?.transitionCompletedAt) redirect("/roadmap");

  const [profile, story] = await Promise.all([
    prisma.userProfile.findUnique({ where: { sessionId } }),
    prisma.transitionStory.findUnique({ where: { sessionId } }),
  ]);

  const industries = (profile?.industriesOfInterest as string[] | null) ?? [];
  const draftStepsTaken =
    story?.stepsTaken ??
    roadmap.milestones.map((m) => `${m.title} — ${m.description}`).join("\n\n");

  return (
    <main className="min-h-screen flex items-start justify-center px-gutter py-space-xl bg-gradient-to-b from-background to-surface-container">
      <div className="w-full max-w-2xl">
        <div className="rounded-xl p-space-md md:p-space-lg shadow-sm bg-surface-container-lowest border border-outline-variant/30">
          <div className="mb-space-lg">
            <h1 className="text-headline-lg text-primary mb-2">
              {story ? "Edit Your Story" : "Share Your Story"}
            </h1>
            <p className="text-body-md text-on-surface-variant">
              We've pulled in what we already know from your questionnaire and roadmap — edit,
              remove, or add anything before it goes public.
            </p>
          </div>
          <ShareStoryForm
            defaultValues={{
              displayName: story?.displayName ?? "",
              fromRole: story?.fromRole ?? profile?.currentJobTitle ?? "",
              toRole: story?.toRole ?? roadmap.targetRole,
              industry: story?.industry ?? industries[0],
              stepsTaken: draftStepsTaken,
              tips: story?.tips ?? "",
            }}
          />
        </div>
      </div>
    </main>
  );
}
