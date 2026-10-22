/**
 * Paid placement. The listing carries one "Sponsored" line on its category
 * card, linking to /advertising-disclosure, and its outbound links carry
 * rel="sponsored". Nothing else is marked.
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
