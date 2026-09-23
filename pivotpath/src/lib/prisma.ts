import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// libSQL works both as a local file (dev — same DATABASE_URL as before) and
// against a hosted Turso database (production — add TURSO_AUTH_TOKEN), unlike
// better-sqlite3 which only ever worked against a local file and can't run on
// Vercel's serverless functions at all.
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
