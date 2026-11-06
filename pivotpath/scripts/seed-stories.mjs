// Adds sample Success Stories to the database pointed to by DATABASE_URL.
// Safe to run more than once: anyone whose name is already in the table is skipped.
// Usage: npm run db:seed
import "dotenv/config";
import pg from "pg";
import { sampleStories } from "./sample-stories.mjs";

if (!process.env.DATABASE_URL || !/^postgres(ql)?:\/\//.test(process.env.DATABASE_URL)) {
  console.error(
    "DATABASE_URL must be a postgres:// connection string. Set it in .env (or the environment) and try again."
  );
  process.exit(1);
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

try {
  // Databases that haven't applied the "remove accounts" migration yet still
  // require a userId on every story, so fill it in when the column exists.
  const { rowCount: hasUserId } = await client.query(
    `SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'pivotpath' AND table_name = 'TransitionStory' AND column_name = 'userId'`
  );

  let added = 0;
  let skipped = 0;

  for (const story of sampleStories) {
    const { rowCount: exists } = await client.query(
      `SELECT 1 FROM "pivotpath"."TransitionStory" WHERE "displayName" = $1`,
      [story.displayName]
    );
    if (exists) {
      skipped++;
      continue;
    }

    const columns = [
      "id", "displayName", "photoUrl", "fromRole", "toRole", "industry", "stepsTaken", "tips",
      "publishedAt", "createdAt", "updatedAt",
    ];
    const values = [
      story.id, story.displayName, story.photoUrl, story.fromRole, story.toRole, story.industry,
      story.stepsTaken, story.tips,
    ];
    const placeholders = values.map((_, i) => `$${i + 1}`);
    const when = `NOW() - ($${values.length + 1}::int * INTERVAL '1 day')`;
    placeholders.push(when, when, when);
    values.push(story.daysAgo);

    if (hasUserId) {
      columns.push("userId");
      placeholders.push(`$${values.length + 1}`);
      values.push(story.id);
    }

    await client.query(
      `INSERT INTO "pivotpath"."TransitionStory" (${columns.map((c) => `"${c}"`).join(", ")})
       VALUES (${placeholders.join(", ")})`,
      values
    );
    added++;
  }

  console.log(`Sample stories: ${added} added, ${skipped} already there.`);
} finally {
  await client.end();
}
