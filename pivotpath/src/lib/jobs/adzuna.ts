import type { JobListing } from "@/lib/jobs/types";

const MAX_DESCRIPTION_CHARS = 240;

export function isAdzunaConfigured(): boolean {
  return Boolean(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY);
}

function cleanText(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function shorten(text: string): string {
  if (text.length <= MAX_DESCRIPTION_CHARS) return text;
  const cut = text.slice(0, MAX_DESCRIPTION_CHARS);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : MAX_DESCRIPTION_CHARS)}…`;
}

function safeUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

type AdzunaResult = {
  id?: string | number;
  title?: unknown;
  description?: unknown;
  redirect_url?: unknown;
  created?: unknown;
  company?: { display_name?: unknown };
  location?: { display_name?: unknown };
};

export function parseAdzunaResults(payload: unknown): JobListing[] {
  const results = (payload as { results?: AdzunaResult[] } | null)?.results;
  if (!Array.isArray(results)) return [];

  const listings: JobListing[] = [];
  for (const r of results) {
    const title = cleanText(r.title);
    const url = safeUrl(r.redirect_url);
    if (!title || !url) continue;

    listings.push({
      id: String(r.id ?? url),
      title,
      company: cleanText(r.company?.display_name) || "Company not listed",
      location: cleanText(r.location?.display_name),
      description: shorten(cleanText(r.description)),
      url,
      postedAt: typeof r.created === "string" ? r.created : undefined,
    });
  }
  return listings;
}

export async function searchAdzuna(
  role: string,
  city: string,
  state: string
): Promise<JobListing[]> {
  const params = new URLSearchParams({
    app_id: process.env.ADZUNA_APP_ID!,
    app_key: process.env.ADZUNA_APP_KEY!,
    results_per_page: "10",
    what: role,
    where: `${city}, ${state}`,
    distance: "50",
    sort_by: "relevance",
  });

  const response = await fetch(`https://api.adzuna.com/v1/api/jobs/us/search/1?${params}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Adzuna responded with ${response.status}`);
  }
  return parseAdzunaResults(await response.json());
}
