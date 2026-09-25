import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, roadmap } from "@/lib/db";
import { getCurrentUserId } from "@/lib/current-user";
import { GeneratingScreen } from "./GeneratingScreen";

export default async function GeneratingPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const existing = await db.query.roadmap.findFirst({ where: eq(roadmap.userId, userId) });
  if (existing) redirect("/roadmap");

  return <GeneratingScreen />;
}
