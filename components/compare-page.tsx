"use client";
import Link from "next/link";
import { useState } from "react";
import { useHydrated } from "@/lib/browser-store";
import { useComparison } from "./comparison-context";
import { ProviderLogo } from "./ui";
import { Icon } from "./icons";
import { providers, categories, Provider } from "@/lib/catalog";
import { outboundRel } from "@/lib/commercial";
export function ComparePage() {
  const { selected, toggle, clear, message } = useComparison();
  const [category, setCategory] = useState("gold");
  const hydrated = useHydrated();
  const list = selected
    .map((id) => providers.find((p) => p.id === id))
    .filter((p): p is Provider => !!p);
  const activeCategory = list[0]?.category || category;
  const options = providers.filter(
    (p) => p.category === activeCategory && !selected.includes(p.id),
  );
  if (!hydrated)
    return (
      <div className="empty-comparison" role="status">
        Loading your shortlist…
      </div>
    );
  return (
    <>
      <div className="comparison-page-controls">
        <label>
          Category{" "}
          <select
            disabled={selected.length > 0}
            value={activeCategory}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        {selected.length > 0 && (
          <button className="text-button" onClick={clear}>
            Start over <Icon name="close" size={14} />
          </button>
        )}
      </div>
      {message && (
        <p role="status" className="inline-notice">
          {message}
        </p>
      )}
      {list.length === 0 ? (
        <div className="empty-comparison">
          <span className="empty-compare-icon">
            <Icon name="compare" size={38} />
          </span>
          <h2>Three companies. One table.</h2>
          <p>
            Pick up to three companies from the same category.
            <br />
            Your shortlist sticks around while you browse.
          </p>
        </div>
      ) : (
        <>
          <p className="comparison-table-hint">
            Comparing {list.length}{" "}
            {list.length === 1 ? "company" : "companies"} · Scroll sideways on a
            phone to see every column.
          </p>
          <div
            className="comparison-table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Company comparison table"
          >
            <table className="comparison-table">
              <caption className="sr-only">
                Side-by-side company details
              </caption>
              <thead>
                <tr>
                  <th scope="col">
                    Same questions,
                    <br />
                    every company.
                  </th>
                  {list.map((p) => (
                    <th scope="col" key={p.id}>
                      <button
                        className="remove-company"
                        aria-label={`Remove ${p.name}`}
                        onClick={() => toggle(p.id)}
                      >
                        <Icon name="close" size={15} />
                      </button>
                      <ProviderLogo provider={p} />
                      <h2>{p.name}</h2>
                      <Link href={`/reviews/${p.id}`}>Full review →</Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Best suited to", get: (p: Provider) => p.fit },
                  { label: "Service type", get: (p: Provider) => p.type },
                  {
                    label: "Minimum / costs",
                    get: (p: Provider) =>
                      p.minimum || "Ask the company for current terms",
                  },
                  {
                    label: "Worth a look for",
                    get: (p: Provider) => p.strengths.join(" · "),
                  },
                  { label: "The catch", get: (p: Provider) => p.limitation },
                  { label: "In brief", get: (p: Provider) => p.summary },
                ].map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {list.map((p) => (
                      <td key={p.id}>{row.get(p)}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th scope="row">Go direct</th>
                  {list.map((p) => (
                    <td key={p.id}>
                      <a
                        className="button"
                        href={p.domain}
                        target="_blank"
                        rel={outboundRel(p.id)}
                      >
                        Visit site <Icon name="external" size={13} />
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
      {selected.length < 3 && (
        <section className="add-companies">
          <h2>{list.length ? "Add another company" : "Pick your companies"}</h2>
          <div className="add-company-grid">
            {options.map((p) => (
              <button
                key={p.id}
                className="add-company"
                onClick={() => toggle(p.id)}
              >
                <ProviderLogo provider={p} />
                <span>
                  <strong>{p.name}</strong>
                  <small>{p.type}</small>
                </span>
                <span className="add-symbol">+</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
