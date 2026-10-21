import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import { SearchResults } from "@/components/discovery";
import { staticSeo } from "@/lib/seo";
export const metadata: Metadata = {
  title: staticSeo["/search"].title,
  description: staticSeo["/search"].description,
  robots: { index: false, follow: true },
  alternates: { canonical: "/search" },
};
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return (
    <main id="main-content">
      <Breadcrumb items={[{ label: "Search" }]} />
      <section className="page-intro container">
        <span className="eyebrow">SEARCH</span>
        <h1>
          What are you
          <br />
          <em>looking for?</em>
        </h1>
      </section>
      <section className="container search-content">
        <SearchResults
          key={typeof q === "string" ? q : ""}
          initialQuery={typeof q === "string" ? q : ""}
        />
      </section>
    </main>
  );
}
