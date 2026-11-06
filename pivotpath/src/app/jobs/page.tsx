"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { searchJobOpenings } from "@/app/jobs/actions";
import { buildSearchLinks } from "@/lib/jobs/links";
import { getJourney, setJourney } from "@/lib/journey/store";
import { US_STATES } from "@/lib/onboarding/schema";
import type { JobListing } from "@/lib/jobs/types";

type Search = { role: string; city: string; state: string };
type Status = "loading" | "ready" | "not_configured" | "error" | "missing_info";

const DATE_FORMAT: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

export default function JobOpeningsPage() {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState<Search | null>(null);
  const [listings, setListings] = useState<JobListing[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const hasStarted = useRef(false);

  function runSearch(s: Search) {
    setStatus("loading");
    startTransition(async () => {
      const result = await searchJobOpenings(s.role, s.city, s.state);
      if (!result.ok) {
        setStatus(result.reason);
        return;
      }
      setListings(result.listings);
      setStatus("ready");
      setJourney({
        jobs: { key: `${s.role}|${s.city}|${s.state}`, listings: result.listings },
      });
    });
  }

  useEffect(() => {
    // React Strict Mode double-invokes effects in dev — guard so the search
    // only fires once per mount.
    if (hasStarted.current) return;
    hasStarted.current = true;

    const journey = getJourney();
    const profile = journey.profile;
    const role =
      journey.roadmap?.targetRole ??
      journey.selectedTargetRole ??
      (profile?.stillDecidingRole ? undefined : profile?.targetRole);

    if (!role || !profile?.city || !profile?.state) {
      setStatus("missing_info");
      return;
    }

    const s = { role, city: profile.city, state: profile.state };
    setSearch(s);

    if (journey.jobs?.key === `${s.role}|${s.city}|${s.state}`) {
      setListings(journey.jobs.listings);
      setStatus("ready");
      return;
    }
    runSearch(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stateName = search ? US_STATES.find(([code]) => code === search.state)?.[1] : undefined;
  const searchLinks = search ? buildSearchLinks(search.role, search.city, search.state) : [];

  return (
    <AppShell active="jobs">
      <div className="max-w-container-max mx-auto px-gutter py-space-lg">
        <section className="mb-space-lg">
          <h1 className="text-headline-lg text-primary mb-2">Job Openings</h1>
          {search ? (
            <p className="text-on-surface-variant text-body-md">
              Openings for <span className="font-bold text-primary">{search.role}</span> near{" "}
              <span className="font-bold text-primary">
                {search.city}, {stateName ?? search.state}
              </span>
              .
            </p>
          ) : (
            <p className="text-on-surface-variant text-body-md">
              Openings near you that match your target role.
            </p>
          )}
        </section>

        {status === "missing_info" && (
          <div className="rounded-xl p-space-lg border border-outline-variant bg-surface-container-lowest text-center space-y-space-sm">
            <span className="material-symbols-outlined text-5xl text-secondary">work</span>
            <h2 className="text-headline-md text-primary">Finish the questionnaire first</h2>
            <p className="text-body-md text-on-surface-variant">
              We need your location and target role to find openings near you.
            </p>
            <Link
              href="/onboarding/step-1"
              className="inline-block px-8 py-3 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-all"
            >
              Start the Questionnaire
            </Link>
          </div>
        )}

        {status === "loading" && (
          <div className="py-space-xl text-center space-y-space-sm">
            <div className="w-14 h-14 mx-auto rounded-full bg-surface-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-3xl animate-spin">
                progress_activity
              </span>
            </div>
            <p className="text-body-md text-on-surface-variant">Finding openings near you...</p>
          </div>
        )}

        {(status === "not_configured" || status === "error") && search && (
          <div className="mb-space-lg rounded-xl p-space-md border border-outline-variant bg-surface-container flex items-start gap-space-sm">
            <span className="material-symbols-outlined text-secondary">info</span>
            <div className="flex-1">
              <p className="text-body-md text-on-surface-variant">
                {status === "not_configured"
                  ? "Live listings aren't available yet. Use the searches below to see current openings near you."
                  : "We couldn't load listings right now. Try again, or use the searches below."}
              </p>
              {status === "error" && (
                <button
                  type="button"
                  onClick={() => runSearch(search)}
                  disabled={isPending}
                  className="mt-space-xs px-6 py-2 border border-secondary text-secondary rounded-lg text-label-md font-bold hover:bg-secondary-container hover:text-on-secondary-container transition-all disabled:opacity-40"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}

        {status === "ready" && listings.length === 0 && (
          <div className="text-center py-space-xl text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-base block">search_off</span>
            No listings found near you for this role yet. Try the searches below.
          </div>
        )}

        {status === "ready" && listings.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-space-md mb-space-lg">
            {listings.map((job) => (
              <div
                key={job.id}
                className="rounded-xl p-space-md flex flex-col border border-outline-variant bg-surface-container-lowest hover:shadow-lg transition-all duration-300"
              >
                <h2 className="text-headline-md text-primary leading-tight">{job.title}</h2>
                <p className="text-label-md text-on-surface-variant mt-1">
                  {job.company}
                  {job.location ? ` · ${job.location}` : ""}
                </p>
                {job.postedAt && !Number.isNaN(Date.parse(job.postedAt)) && (
                  <p className="text-label-sm text-secondary mt-1">
                    Posted {new Date(job.postedAt).toLocaleDateString("en-US", DATE_FORMAT)}
                  </p>
                )}
                {job.description && (
                  <p className="text-body-md text-on-surface-variant mt-space-sm mb-space-md line-clamp-4">
                    {job.description}
                  </p>
                )}
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-lg text-label-md hover:opacity-90 transition-colors"
                >
                  View Job
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </a>
              </div>
            ))}
          </section>
        )}

        {search && status !== "loading" && (
          <section className="rounded-xl p-space-md bg-surface-container border border-outline-variant/30">
            <h2 className="text-headline-md text-primary mb-1">Keep searching</h2>
            <p className="text-label-md text-on-surface-variant mb-space-sm">
              See more openings for {search.role} near {search.city}, {search.state} on these
              job boards.
            </p>
            <div className="flex flex-wrap gap-space-sm">
              {searchLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant text-label-md text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors"
                >
                  {link.name}
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
