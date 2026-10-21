/**
 * Paid placements. The listing is labeled "Sponsored" wherever the ranking
 * appears, the label links to /advertising-disclosure, and the company's
 * outbound links carry rel="sponsored". Nothing else is required.
 */
export const goldPaidPlacement = {
  providerId: "citadel-gold",
  tag: "Sponsored",
};
export const isPaidPlacement = (providerId: string) =>
  providerId === goldPaidPlacement.providerId;
/** Paid placements are marked sponsored; other commercial links are nofollow. */
export const outboundRel = (providerId: string) =>
  isPaidPlacement(providerId)
    ? "noopener noreferrer sponsored"
    : "noopener noreferrer nofollow";
