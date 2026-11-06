// Pre-filtered search pages on common job boards. These are real, working
// searches (not specific postings), used alongside — or instead of — live listings.
export function buildSearchLinks(role: string, city: string, state: string) {
  const where = `${city}, ${state}`;
  const q = encodeURIComponent(role);
  const loc = encodeURIComponent(where);

  return [
    { name: "Indeed", url: `https://www.indeed.com/jobs?q=${q}&l=${loc}` },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/jobs/search/?keywords=${q}&location=${loc}`,
    },
    {
      name: "Google Jobs",
      url: `https://www.google.com/search?q=${encodeURIComponent(`${role} jobs in ${where}`)}&ibp=htl;jobs`,
    },
    {
      name: "ZipRecruiter",
      url: `https://www.ziprecruiter.com/jobs-search?search=${q}&location=${loc}`,
    },
  ];
}
