import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, providerById, categoryById } from "@/lib/catalog";
import { guideBySlug } from "@/lib/guides";
import { policies } from "@/lib/policies";
import { contentPaths, resolvePageMeta } from "@/lib/seo";
import {
  CategoryDirectory,
  CategoryPage,
  ReviewPage,
  GuidePage,
  MethodologyPage,
} from "@/components/pages";
import { CompanyDirectory, GuideDirectory } from "@/components/discovery";
import { Breadcrumb } from "@/components/ui";
import { PrivacyPreferences, MessageDraft } from "@/components/preferences";
export function generateStaticParams() {
  return contentPaths.map((path) => ({ slug: path.slice(1).split("/") }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = "/" + slug.join("/");
  const meta = resolvePageMeta(path);
  if (!meta) return { title: "Page not found", robots: { index: false } };
  const isArticle = meta.kind === "review" || meta.kind === "guide";
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: path },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: path,
      type: isArticle ? "article" : "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}
export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = "/" + slug.join("/");
  const category = categories.find((c) => c.path === path);
  if (category) return <CategoryPage category={category} />;
  if (path === "/categories") return <CategoryDirectory />;
  if (path === "/methodology") return <MethodologyPage />;
  if (
    slug[0] === "methodology" &&
    slug.length === 2 &&
    categories.some((c) => c.id === slug[1])
  )
    return <MethodologyPage category={categoryById(slug[1])} />;
  if (slug[0] === "reviews" && slug.length === 2) {
    const p = providerById(slug[1]);
    if (p) return <ReviewPage provider={p} />;
    notFound();
  }
  if (slug[0] === "guides" && slug.length === 2) {
    const g = guideBySlug(slug[1]);
    if (g) return <GuidePage guide={g} />;
    notFound();
  }
  if (path === "/companies" || path === "/guides") {
    const isCompanies = path === "/companies";
    return (
      <main id="main-content">
        <Breadcrumb
          items={[{ label: isCompanies ? "Company reviews" : "Guides" }]}
        />
        <section className="page-intro container">
          <span className="eyebrow">
            {isCompanies ? "EVERY COMPANY WE COVER" : "READ BEFORE YOU DECIDE"}
          </span>
          <h1>
            {isCompanies ? (
              <>
                All the companies,
                <br />
                <em>one list.</em>
              </>
            ) : (
              <>
                Guides to the
                <br />
                <em>fine print.</em>
              </>
            )}
          </h1>
          <p>
            {isCompanies
              ? "Every company and product we've profiled across ten categories. Filter, search, and shortlist up to three."
              : "Short, practical reads on the fees, terms, and questions behind big money and legal decisions."}
          </p>
        </section>
        <section className="container section section-top-small">
          {isCompanies ? <CompanyDirectory /> : <GuideDirectory />}
        </section>
      </main>
    );
  }
  if (slug.length === 1 && policies[slug[0]]) {
    const p = policies[slug[0]];
    return (
      <main id="main-content">
        <Breadcrumb items={[{ label: p.eyebrow.toLowerCase() }]} />
        <section className="page-intro container">
          <span className="eyebrow">{p.eyebrow}</span>
          <h1>{p.title}</h1>
          <p>{p.intro}</p>
        </section>
        <article className="reading-column standalone-article policy-article">
          {p.sections.map((s) => (
            <section key={s.title}>
              <h2>{s.title}</h2>
              <p>{s.body}</p>
            </section>
          ))}
          {slug[0] === "privacy-choices" && <PrivacyPreferences />}
          {["contact", "corrections", "advertise"].includes(slug[0]) && (
            <MessageDraft correction={slug[0] === "corrections"} />
          )}
          <div className="policy-links">
            <Link href="/about">About us</Link>
            <Link href="/methodology">How we review</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </article>
      </main>
    );
  }
  notFound();
}
