"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/onboarding/session";
import { shareStorySchema, type ShareStoryInput } from "@/lib/stories/schema";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function saveStory(input: ShareStoryInput): Promise<ActionResult> {
  const parsed = shareStorySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const sessionId = await getSessionId();
  if (!sessionId) return { ok: false, error: "Your session expired — please refresh and try again." };

  const roadmap = await prisma.roadmap.findUnique({ where: { sessionId } });
  if (!roadmap?.transitionCompletedAt) {
    return { ok: false, error: "Mark your transition complete before publishing a story." };
  }

  const { consent: _consent, photoDataUrl, ...rest } = parsed.data;
  const data = { ...rest, photoUrl: photoDataUrl || null };

  const story = await prisma.transitionStory.upsert({
    where: { sessionId },
    create: { sessionId, ...data },
    update: { ...data, isPublished: true, unpublishedAt: null },
  });

  redirect(`/stories/${story.id}`);
}
