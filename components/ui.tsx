import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import companyBrands from "@/lib/company-brands.json";
import { StructuredData } from "./structured-data";
import { Category, Provider, categories, categoryById } from "@/lib/catalog";
import { Guide } from "@/lib/guides";
import { Icon } from "./icons";
import { siteOrigin } from "@/lib/site";
export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="breadcrumb container" aria-label="Breadcrumb">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [{ label: "Home", href: "/" }, ...items].map(
            (item, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: item.label,
              ...(item.href ? { item: `${siteOrigin}${item.href}` } : {}),
            }),
          ),
        }}
      />
      <Link href="/">Home</Link>
      {items.map((item, i) => (
        <span key={i}>
          <span className="breadcrumb-separator">/</span>
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
export function CategoryCard({
  category: c,
  featured = false,
}: {
  category: Category;
  featured?: boolean;
}) {
  return (
    <Link
      className={`category-card ${c.id === "gold" ? "category-gold" : ""} ${featured ? "category-card-featured" : ""}`}
      href={c.path}
    >
      <span className="category-icon">
        <Icon name={c.icon} size={featured ? 34 : 28} />
      </span>
      <h3>{c.title}</h3>
      <p>{c.description}</p>
      <span className="category-card-bottom">
        Compare companies <Icon name="arrow" size={17} />
      </span>
    </Link>
  );
}
const featuredCategoryIds = ["gold", "mortgages", "credit-cards"];
const defaultCategoryOrder = [
  ...featuredCategoryIds.map(categoryById),
  ...categories.filter((c) => !featuredCategoryIds.includes(c.id)),
];
export function CategoryGrid({
  items = defaultCategoryOrder,
  uniform = false,
}: {
  items?: Category[];
  uniform?: boolean;
}) {
  if (uniform) {
    return (
      <div className="category-grid category-grid-uniform">
        {items.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>
    );
  }
  const featured = items.slice(0, 3);
  const rest = items.slice(3);
  return (
    <div
      className="category-tiers"
      style={{ "--compact-category-count": rest.length } as CSSProperties}
    >
      <div className="category-grid category-grid-featured">
        {featured.map((c) => (
          <CategoryCard key={c.id} category={c} featured />
        ))}
      </div>
      <div className="category-grid category-grid-compact">
        {rest.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>
    </div>
  );
}
export function ProviderLogo({
  provider: p,
  large = false,
}: {
  provider: Provider;
  large?: boolean;
}) {
  return (
    <ProviderBrand
      provider={p}
      className={`provider-logo ${large ? "large" : ""}`}
    />
  );
}
export function ProviderLeadImage({ provider }: { provider: Provider }) {
  return <ProviderBrand provider={provider} className="provider-lead-image" />;
}
function ProviderBrand({
  provider,
  className,
}: {
  provider: Provider;
  className: string;
}) {
  const brand = companyBrands[provider.id as keyof typeof companyBrands];
  return (
    <span
      className={`${className} company-brand ${brand.inset ? "company-brand-inset" : ""}`}
      style={{ backgroundColor: brand.background }}
    >
      <span className="company-brand-art">
        <Image
          src={brand.logo}
          alt={`${brand.name} logo`}
          width={brand.width}
          height={brand.height}
          sizes={
            className === "provider-lead-image"
              ? "(max-width: 600px) 80vw, 360px"
              : "140px"
          }
        />
      </span>
    </span>
  );
}
export function GuideArt({ type }: { type: string }) {
  return (
    <div className={`guide-art art-${type}`} aria-hidden="true">
      <span className="art-orbit orbit-one" />
      <span className="art-orbit orbit-two" />
      {type === "gold" ? (
        <svg
          className="art-scene"
          width="200"
          height="130"
          viewBox="0 0 200 130"
        >
          <path d="m30 80 14-30h86l20 30-9 20H21Z" fill="#b79b5f" />
          <path d="M44 50h86l20 30H30Z" fill="#d5c38f" />
          <path d="M30 80h120l-9 20H21Z" fill="#9c7c41" />
          <path d="m66 44 13-26h58l17 26-8 16H58Z" fill="#b79b5f" />
          <path d="M79 18h58l17 26H66Z" fill="#e2d3a8" />
          <path d="M66 44h88l-8 16H58Z" fill="#aa8d50" />
          <path d="m100 8 12-20M100 8l-12-20" stroke="none" />
          <ellipse
            cx="90"
            cy="118"
            rx="74"
            ry="6"
            fill="#071e2c"
            opacity=".18"
          />
        </svg>
      ) : type === "home" ? (
        <div className="art-document art-estimate">
          <div className="art-estimate-head">
            <span>Loan Estimate</span>
            <span className="art-house">
              <Icon name="home" size={16} />
            </span>
          </div>
          <div className="art-estimate-row">
            <span>Interest rate</span>
            <span />
          </div>
          <div className="art-estimate-row">
            <span>Points</span>
            <span />
          </div>
          <div className="art-estimate-row">
            <span>Origination</span>
            <span />
          </div>
          <div className="art-estimate-row art-estimate-total">
            <span>Cash to close</span>
            <span />
          </div>
        </div>
      ) : type === "card" ? (
        <div className="art-card-scene">
          <div className="art-statement">
            <div className="art-doc-line" />
            <div className="art-doc-line short" />
            <div className="art-doc-line" />
            <div className="art-doc-line short" />
            <div className="art-doc-line" />
          </div>
          <div className="art-credit-card">
            <span className="art-chip" />
            <span className="art-card-number" />
            <span className="art-card-name" />
          </div>
        </div>
      ) : (
        <div className="art-document">
          <div className="art-doc-line" />
          <div className="art-doc-line short" />
          <Icon name={type} size={72} />
          <div className="art-doc-line" />
          <div className="art-doc-line short" />
        </div>
      )}
      <span className="art-spark">✳</span>
      <span className="art-dot" />
    </div>
  );
}
export function GuideCard({ guide: g }: { guide: Guide }) {
  return (
    <Link href={`/guides/${g.slug}`} className="guide-card">
      <GuideArt type={g.art} />
      <div className="guide-card-content">
        <div className="guide-meta">
          <span>{categoryById(g.category).short}</span>
          <span>{g.minutes} min read</span>
        </div>
        <h3>{g.title}</h3>
        <p>{g.description}</p>
        <span className="inline-link">
          Read this guide <Icon name="arrow" size={16} />
        </span>
      </div>
    </Link>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkText,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && (
        <Link className="inline-link" href={href}>
          {linkText || "See more"}
          <Icon name="arrow" size={18} />
        </Link>
      )}
    </div>
  );
}
export function FAQ({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <details key={i}>
          <summary>
            {item.question}
            <span>+</span>
          </summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
export function MethodSteps() {
  return (
    <div className="method-steps">
      {[
        {
          n: "01",
          icon: "search",
          title: "Ask the same questions",
          body: "Cost, fit, who qualifies, and the terms that would change your mind. Every company gets the same list.",
        },
        {
          n: "02",
          icon: "compare",
          title: "Line them up",
          body: "See where each company is strong and where it falls short, in one table.",
        },
        {
          n: "03",
          icon: "check",
          title: "Decide, then go direct",
          body: "Read the full review, then head to the company’s own site when you’re ready.",
        },
      ].map((s) => (
        <div key={s.n}>
          <div className="step-top">
            <Icon name={s.icon} size={26} />
            <span>{s.n}</span>
          </div>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </div>
      ))}
    </div>
  );
}
