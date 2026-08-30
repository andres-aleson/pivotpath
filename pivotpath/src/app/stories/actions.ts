"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";
import { shareStorySchema, type ShareStoryInput } from "@/lib/stories/schema";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function saveStory(input: ShareStoryInput): Promise<ActionResult> {
  const parsed = shareStorySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const userId = await getCurrentUserId();
  if (!userId) return { ok: false, error: "You've been signed out — please log in and try again." };

  const roadmap = await prisma.roadmap.findUnique({ where: { userId } });
  if (!roadmap?.transitionCompletedAt) {
    return { ok: false, error: "Mark your transition complete before publishing a story." };
  }

  const { consent: _consent, photoDataUrl, ...rest } = parsed.data;
  const data = { ...rest, photoUrl: photoDataUrl || null };

  const story = await prisma.transitionStory.upsert({
    where: { userId },
    create: { userId, ...data },
    update: { ...data, isPublished: true, unpublishedAt: null },
  });

  redirect(`/stories/${story.id}`);
}
