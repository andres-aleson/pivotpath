import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/onboarding/session";
import { GeneratingScreen } from "./GeneratingScreen";

export default async function GeneratingPage() {
  const sessionId = await getSessionId();
  if (!sessionId) redirect("/onboarding");

  const existing = await prisma.roadmap.findUnique({ where: { sessionId } });
  if (existing) redirect("/roadmap");

  return <GeneratingScreen />;
}
