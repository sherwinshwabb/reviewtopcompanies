import type { Metadata } from "next";
import { GoldMatchQuiz } from "@/components/gold-match-quiz";
import { siteName } from "@/lib/site";

const title = "Find Your Best Gold IRA Match in 2 Minutes";
const description =
  "Answer five quick questions about your age, retirement account, balance, and timeline to see which Gold IRA companies fit your situation.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: true },
  alternates: { canonical: "/gold/match" },
  openGraph: {
    siteName,
    type: "website",
    title: `${title} | ${siteName}`,
    description,
    url: "/gold/match",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${siteName}`,
    description,
    images: ["/opengraph-image"],
  },
};

export default function GoldMatchPage() {
  return (
    <main id="main-content">
      <GoldMatchQuiz />
    </main>
  );
}
