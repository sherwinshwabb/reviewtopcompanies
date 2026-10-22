import Link from "next/link";
import { goldPaidPlacement } from "@/lib/commercial";
import { reviewedOn, reviewedOnLabel } from "@/lib/site";
/** The one marking: a quiet "Sponsored" line on the paid listing's category card, linking to the disclosure. */
export function SponsoredTag() {
  return (
    <Link href="/advertising-disclosure" className="sponsored-tag">
      {goldPaidPlacement.tag}
    </Link>
  );
}
export function ReviewedOn() {
  return <time dateTime={reviewedOn}>{reviewedOnLabel}</time>;
}
