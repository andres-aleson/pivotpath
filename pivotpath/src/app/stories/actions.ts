"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, roadmap, transitionStory } from "@/lib/db";
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

  const userRoadmap = await db.query.roadmap.findFirst({ where: eq(roadmap.userId, userId) });
  if (!userRoadmap?.transitionCompletedAt) {
    return { ok: false, error: "Mark your transition complete before publishing a story." };
  }

  const { consent: _consent, photoDataUrl, ...rest } = parsed.data;
  const data = { ...rest, photoUrl: photoDataUrl || null };

  const [story] = await db
    .insert(transitionStory)
    .values({ userId, ...data })
    .onConflictDoUpdate({
      target: transitionStory.userId,
      set: { ...data, isPublished: true, unpublishedAt: null, updatedAt: new Date() },
    })
    .returning({ id: transitionStory.id });

  redirect(`/stories/${story.id}`);
}
