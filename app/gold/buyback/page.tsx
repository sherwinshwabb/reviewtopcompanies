import type { Metadata } from "next";
import { GoldBuybackQuiz } from "@/components/gold-buyback-quiz";
import { siteName } from "@/lib/site";

const title = "Overpaid for Gold? Free Buyback Review";
const description =
  "Answer four quick questions about your gold or silver coins to see if you qualify for a free buyback review with a precious metals specialist.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: true },
  alternates: { canonical: "/gold/buyback" },
  openGraph: {
    siteName,
    type: "website",
    title: `${title} | ${siteName}`,
    description,
    url: "/gold/buyback",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${siteName}`,
    description,
    images: ["/opengraph-image"],
  },
};

export default function GoldBuybackPage() {
  return (
    <main id="main-content">
      <GoldBuybackQuiz />
    </main>
  );
}
