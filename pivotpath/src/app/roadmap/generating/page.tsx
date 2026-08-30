import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";
import { GeneratingScreen } from "./GeneratingScreen";

export default async function GeneratingPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const existing = await prisma.roadmap.findUnique({ where: { userId } });
  if (existing) redirect("/roadmap");

  return <GeneratingScreen />;
}
