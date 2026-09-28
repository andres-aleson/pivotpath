"use server";

import { prisma } from "@/lib/prisma";
import { shareStorySchema, type ShareStoryInput } from "@/lib/stories/schema";

type ActionResult = { ok: true; id: string } | { ok: false; error: string };

export async function saveStory(input: ShareStoryInput, storyId?: string): Promise<ActionResult> {
  const parsed = shareStorySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { consent: _consent, photoDataUrl, ...rest } = parsed.data;
  const data = { ...rest, photoUrl: photoDataUrl || null };

  const story = storyId
    ? await prisma.transitionStory.update({
        where: { id: storyId },
        data: { ...data, isPublished: true, unpublishedAt: null },
      })
    : await prisma.transitionStory.create({ data });

  return { ok: true, id: story.id };
}
