"use client";
import { useState } from "react";
import Link from "next/link";
import { Category, Provider } from "@/lib/catalog";
import { isPaidPlacement, outboundRel } from "@/lib/commercial";
import { SponsoredTag } from "./editorial";
import { RankBadge } from "./rank-badge";
import { ProviderLogo } from "./ui";
import { Icon } from "./icons";
import { CompareButton, useComparison } from "./comparison-context";
export function CategoryComparison({
  category,
  providers,
}: {
  category: Category;
  providers: Provider[];
}) {
  const [filter, setFilter] = useState("All companies");
  const [sort, setSort] = useState("featured");
  const { message } = useComparison();
  const legal = ["personal-injury", "lemon-law"].includes(category.id);
  const visible = providers
    .filter((p) => filter === "All companies" || p.type === filter)
    .toSorted((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : 0));
  return (
    <div id="companies">
      <div className="comparison-controls">
        <div
          className="filter-tabs"
          aria-label={legal ? "Filter by location" : "Filter by service type"}
        >
          {category.filters.map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {legal && f === "All companies" ? "All locations" : f}
            </button>
          ))}
        </div>
        <label className="sort-label">
          Sort by{" "}
          <select
            aria-label="Sort companies"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="featured">Our ranking</option>
            <option value="name">Name A–Z</option>
          </select>
        </label>
      </div>
      <div className="results-caption" aria-live="polite">
        <span>
          {visible.length}{" "}
          {category.id === "credit-cards" ? "cards" : "companies"} listed
        </span>
        <span>Pick up to 3 to compare</span>
      </div>
      {message && (
        <p className="inline-notice" role="status">
          {message}
        </p>
      )}
      <div className="provider-list">
        {visible.map((p) => {
          const rank = providers.findIndex((item) => item.id === p.id) + 1;
          const sponsored = isPaidPlacement(p.id);
          return (
            <article
              className="provider-card"
              data-rank={rank}
              key={p.id}
              id={p.id}
            >
              <div className="provider-card-main">
                <div className="provider-identity">
                  <div className="provider-rank">
                    <RankBadge rank={rank} of={providers.length} />
                    <span aria-hidden="true">
                      {rank <= 3 ? `Ranked ${rank} of ` : "of "}
                      {providers.length}
                    </span>
                  </div>
                  <ProviderLogo provider={p} large />
                  <span className="provider-type">{p.type}</span>
                  <CompareButton id={p.id} />
                </div>
                <div className="provider-description">
                  <span className="eyebrow">
                    BEST FOR{sponsored && <SponsoredTag />}
                  </span>
                  <h2>
                    <Link href={`/reviews/${p.id}`}>{p.name}</Link>
                  </h2>
                  <p className="provider-verdict">{p.fit}</p>
                  <dl className="provider-facts">
                    <div>
                      <dt>{legal ? "Coverage" : "Service"}</dt>
                      <dd>{p.type}</dd>
                    </div>
                    <div>
                      <dt>{category.id === "gold" ? "Minimum" : "Costs"}</dt>
                      <dd>
                        {p.minimum || "Ask the company for current terms"}
                      </dd>
                    </div>
                    <div>
                      <dt>Known for</dt>
                      <dd>{p.strengths[0]}</dd>
                    </div>
                  </dl>
                </div>
                <div className="provider-actions">
                  <a
                    className="button"
                    href={p.domain}
                    target="_blank"
                    rel={outboundRel(p.id)}
                  >
                    Visit{" "}
                    {p.name === "Augusta Precious Metals" ? "Augusta" : p.name}{" "}
                    <Icon name="external" size={14} />
                  </a>
                  <Link className="inline-link" href={`/reviews/${p.id}`}>
                    Full review <Icon name="arrow" size={16} />
                  </Link>
                </div>
              </div>
              <div className="provider-details">
                <p className="provider-reason">
                  <strong>
                    {sponsored ? "About this company. " : "Why it's here. "}
                  </strong>
                  {p.summary}
                </p>
                <div className="provider-pros-cons">
                  <div>
                    <h3>Worth a look for</h3>
                    <ul className="check-list">
                      {p.strengths.map((s) => (
                        <li key={s}>
                          <Icon name="check" size={14} />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="limitation">
                    <strong>The catch</strong>
                    <p>{p.limitation}</p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {visible.length === 0 && (
        <div className="empty-state">
          <h3>Nothing matches that filter.</h3>
          <button className="button" onClick={() => setFilter("All companies")}>
            Show all
          </button>
        </div>
      )}
    </div>
  );
}
