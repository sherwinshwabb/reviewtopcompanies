/**
 * One place for the publication's identity. The name is Title Case everywhere
 * except the logo lockup, which sets it in uppercase.
 */
export const siteName = "Top Provider Picks";
export const siteOrigin = "https://topproviderpicks.com";
export const siteUrl = (path = "/") => new URL(path, siteOrigin).toString();
export const monogram = "TPP";
/** ISO dates used in structured data and the sitemap. */
export const publishedOn = "2026-10-01";
export const reviewedOn = "2026-10-21";
export const reviewedOnLabel = "October 2026";
export const siteTagline = "Pick the right company the first time";
export const siteDescription =
  "Plain-English company comparisons for gold IRAs, mortgages, credit cards, banks, student loan refinancing, debt relief, credit repair, investing, and injury and lemon law firms.";
