import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import { ComparePage } from "@/components/compare-page";
import { staticSeo } from "@/lib/seo";
export const metadata: Metadata = {
  title: staticSeo["/compare"].title,
  description: staticSeo["/compare"].description,
  robots: { index: false, follow: true },
  alternates: { canonical: "/compare" },
};
export default function Page() {
  return (
    <main id="main-content">
      <Breadcrumb items={[{ label: "Compare companies" }]} />
      <section className="page-intro container">
        <span className="eyebrow">YOUR SHORTLIST</span>
        <h1>
          Side by side,
          <br />
          <em>same questions.</em>
        </h1>
        <p>
          Up to three companies from one category, lined up on the same details.
        </p>
      </section>
      <section className="container section section-top-small">
        <ComparePage />
      </section>
    </main>
  );
}
