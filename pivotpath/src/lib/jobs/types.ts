export type JobListing = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  postedAt?: string;
};

export type JobSearchResult =
  | { ok: true; listings: JobListing[] }
  | { ok: false; reason: "not_configured" | "error" };
