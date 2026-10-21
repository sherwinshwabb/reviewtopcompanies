/**
 * One place for the publication's identity. The brand is written in lowercase
 * everywhere, including the logo, so keep `siteName` lowercase.
 */
export const siteName = "top provider picks";
export const siteOrigin = "https://topproviderpicks.com";
export const siteUrl = (path = "/") => new URL(path, siteOrigin).toString();
export const monogram = "tpp";
/** ISO dates used in structured data and the sitemap. */
export const publishedOn = "2026-10-01";
export const reviewedOn = "2026-10-21";
export const reviewedOnLabel = "October 2026";
export const siteTagline = "pick the right company the first time";
export const siteDescription =
  "Plain-English company comparisons for gold IRAs, mortgages, credit cards, banks, student loan refinancing, debt relief, credit repair, investing, and injury and lemon law firms.";
