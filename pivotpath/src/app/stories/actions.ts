"use server";

import { eq } from "drizzle-orm";
import { db, transitionStory } from "@/lib/db";
import { shareStorySchema, type ShareStoryInput } from "@/lib/stories/schema";

type ActionResult = { ok: true; id: string } | { ok: false; error: string };

export async function saveStory(input: ShareStoryInput, storyId?: string): Promise<ActionResult> {
  const parsed = shareStorySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { consent: _consent, photoDataUrl, ...rest } = parsed.data;
  const data = { ...rest, photoUrl: photoDataUrl || null };

  if (storyId) {
    const [updated] = await db
      .update(transitionStory)
      .set({ ...data, isPublished: true, unpublishedAt: null, updatedAt: new Date() })
      .where(eq(transitionStory.id, storyId))
      .returning({ id: transitionStory.id });
    if (updated) return { ok: true, id: updated.id };
  }

  const [created] = await db
    .insert(transitionStory)
    .values(data)
    .returning({ id: transitionStory.id });
  return { ok: true, id: created.id };
}
