"use client";
import { useState } from "react";
import Link from "next/link";
import { categories, providers, categoryById } from "@/lib/catalog";
import { guides } from "@/lib/guides";
import { Icon } from "./icons";
import { ProviderLogo, ProviderLeadImage, GuideCard } from "./ui";
import { CompareButton } from "./comparison-context";
export function CompanyDirectory() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const filtered = providers.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      `${p.name} ${p.type} ${p.fit}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="directory-controls">
        <label className="search-field">
          <Icon name="search" size={19} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search companies"
            placeholder="Search by company or service…"
          />
        </label>
        <label className="directory-select">
          <span className="sr-only">Filter by category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option value={c.id} key={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="results-caption" aria-live="polite">
        {filtered.length} companies and products listed
      </p>
      <div className="company-directory-grid">
        {filtered.map((p) => (
          <article className="directory-company" key={p.id}>
            <ProviderLeadImage provider={p} />
            <div className="directory-company-top">
              <span>{categoryById(p.category).short}</span>
            </div>
            <Link href={`/reviews/${p.id}`}>
              <h2>{p.name}</h2>
            </Link>
            <p>{p.fit}</p>
            <div className="directory-company-bottom">
              <Link href={`/reviews/${p.id}`} className="inline-link">
                Read the review <Icon name="arrow" size={15} />
              </Link>
              <CompareButton id={p.id} />
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">
          <Icon name="search" size={35} />
          <h2>Nothing matched.</h2>
          <p>Try a different company name or pick another category.</p>
          <button
            className="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
export function GuideDirectory() {
  const [category, setCategory] = useState("all");
  const filtered = guides.filter(
    (g) => category === "all" || g.category === category,
  );
  return (
    <>
      <div className="guide-filters">
        <label>
          Filter by category{" "}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All guides</option>
            {categories.map((c) => (
              <option value={c.id} key={c.id}>
                {c.short}
              </option>
            ))}
          </select>
        </label>
        <span>{filtered.length} guides</span>
      </div>
      <div className="guide-grid">
        {filtered.map((g) => (
          <GuideCard guide={g} key={g.slug} />
        ))}
      </div>
    </>
  );
}
export function SearchResults({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const term = query.trim().toLowerCase();
  const companyResults = term
    ? providers.filter((p) =>
        `${p.name} ${p.fit} ${p.type} ${categoryById(p.category).title}`
          .toLowerCase()
          .includes(term),
      )
    : [];
  const categoryResults = term
    ? categories.filter((c) =>
        `${c.title} ${c.description}`.toLowerCase().includes(term),
      )
    : [];
  const guideResults = term
    ? guides.filter((g) =>
        `${g.title} ${g.description} ${categoryById(g.category).title}`
          .toLowerCase()
          .includes(term),
      )
    : [];
  const total =
    companyResults.length + categoryResults.length + guideResults.length;
  return (
    <>
      <form
        className="search-page-form"
        onSubmit={(e) => e.preventDefault()}
        role="search"
      >
        <Icon name="search" />
        <input
          autoFocus
          aria-label="Search companies, categories, and guides"
          placeholder="Search companies, categories, and guides"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            className="icon-button"
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
          >
            <Icon name="close" size={18} />
          </button>
        )}
      </form>
      {!term ? (
        <div className="search-suggestions">
          <h2>Jump to a category</h2>
          <div className="search-chips">
            {categories.map((c) => (
              <button key={c.id} onClick={() => setQuery(c.short)}>
                <Icon name={c.icon} size={18} />
                {c.short}
                <Icon name="arrow" size={14} />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <p className="search-count" aria-live="polite">
            {total} results for “{query}”
          </p>
          {categoryResults.length > 0 && (
            <section className="search-result-section">
              <h2>
                Categories <span>{categoryResults.length}</span>
              </h2>
              {categoryResults.map((c) => (
                <Link className="search-result" href={c.path} key={c.id}>
                  <span className="search-result-icon">
                    <Icon name={c.icon} />
                  </span>
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.description}</p>
                  </div>
                  <Icon name="arrow" size={19} />
                </Link>
              ))}
            </section>
          )}
          {companyResults.length > 0 && (
            <section className="search-result-section">
              <h2>
                Company reviews <span>{companyResults.length}</span>
              </h2>
              {companyResults.map((p) => (
                <Link
                  className="search-result"
                  href={`/reviews/${p.id}`}
                  key={p.id}
                >
                  <ProviderLogo provider={p} />
                  <div>
                    <h3>{p.name}</h3>
                    <p>{p.fit}</p>
                  </div>
                  <Icon name="arrow" size={19} />
                </Link>
              ))}
            </section>
          )}
          {guideResults.length > 0 && (
            <section className="search-result-section">
              <h2>
                Guides <span>{guideResults.length}</span>
              </h2>
              {guideResults.map((g) => (
                <Link
                  className="search-result"
                  href={`/guides/${g.slug}`}
                  key={g.slug}
                >
                  <span className="search-result-icon">
                    <Icon name="book" />
                  </span>
                  <div>
                    <h3>{g.title}</h3>
                    <p>{g.description}</p>
                  </div>
                  <Icon name="arrow" size={19} />
                </Link>
              ))}
            </section>
          )}
          {!total && (
            <div className="empty-state">
              <Icon name="search" size={38} />
              <h2>No luck with that one.</h2>
              <p>
                Try “gold,” “mortgage,” a company name, or a shorter phrase.
              </p>
              <button className="button" onClick={() => setQuery("")}>
                Browse categories
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
