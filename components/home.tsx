import Link from "next/link";
import { Icon } from "./icons";
import {
  CategoryGrid,
  SectionHeading,
  GuideCard,
  MethodSteps,
  ProviderLogo,
} from "./ui";
import { providers, categoryById } from "@/lib/catalog";
import { guides } from "@/lib/guides";
import { reviewedOnLabel } from "@/lib/site";
import { RankBadge } from "./rank-badge";
const goldProviders = providers.filter((p) => p.category === "gold");
const chips = ["gold", "mortgages", "credit-cards", "banking"].map(
  categoryById,
);
export function Home() {
  return (
    <main id="main-content">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span /> COMPANY REVIEWS & COMPARISONS
            </div>
            <h1>
              Find the right company
              <br />
              before you sign <em>anything.</em>
            </h1>
            <p>
              Straight company reviews and side-by-side comparisons for gold
              IRAs, mortgages, credit cards, banks, and the lawyers you hope
              you&rsquo;ll never need.
            </p>
            <form className="hero-search" action="/search">
              <Icon name="search" size={22} />
              <label className="sr-only" htmlFor="home-search">
                Search companies or categories
              </label>
              <input
                id="home-search"
                name="q"
                placeholder="Search a company or category"
              />
              <button type="submit">
                Find companies <Icon name="arrow" size={18} />
              </button>
            </form>
            <div className="hero-chips" aria-label="Popular categories">
              <span>Popular:</span>
              {chips.map((c) => (
                <Link href={c.path} key={c.id}>
                  <Icon name={c.icon} size={15} />
                  {c.short}
                </Link>
              ))}
            </div>
          </div>
          <div
            className="hero-visual"
            aria-label="A sample comparison of three gold companies"
          >
            <div className="hero-orbit orbit-a" />
            <div className="hero-orbit orbit-b" />
            <span className="visual-star">✳</span>
            <div className="floating-note">
              <span className="note-icon">
                <Icon name="check" size={16} />
              </span>{" "}
              Three companies, one table.
            </div>
            <div className="comparison-paper">
              <div className="paper-top">
                <span className="eyebrow">GOLD COMPANIES · SIDE BY SIDE</span>
                <Icon name="compare" size={20} />
              </div>
              <h2>
                Compare
                <br />
                before you call.
              </h2>
              <table className="paper-table">
                <thead>
                  <tr>
                    <th scope="col">Company</th>
                    <th scope="col">Minimum</th>
                    <th scope="col">Best for</th>
                  </tr>
                </thead>
                <tbody>
                  {goldProviders.slice(0, 3).map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.minimum ? "$25,000 (IRA)" : "Ask"}</td>
                      <td>{p.fit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="paper-bottom">
                <span>All seven gold companies, same columns.</span>
                <Icon name="arrow" size={18} />
              </div>
            </div>
            <div className="floating-category">
              <span className="floating-icon">
                <Icon name="book" size={25} />
              </span>
              <div>
                <strong>Ten categories, one checklist.</strong>
                <span>Cost, fit, and the catch, for every company.</span>
              </div>
            </div>
            <span className="visual-dot" />
          </div>
        </div>
      </section>
      <div className="value-strip">
        <div className="container">
          <span>
            <Icon name="compare" size={20} /> Side-by-side comparison tables
          </span>
          <span>
            <Icon name="book" size={20} /> Guides written in plain English
          </span>
          <span>
            <Icon name="search" size={20} /> Fees and fine print spelled out
          </span>
          <span>
            <Icon name="check" size={20} /> No sign-up, no sales calls
          </span>
        </div>
      </div>
      <section className="section container" id="categories">
        <SectionHeading
          eyebrow="START WITH YOUR DECISION"
          title="Pick the decision you're facing."
          description="Gold, mortgages, and credit cards are where most people start. Seven more categories sit underneath."
          href="/categories"
          linkText="See every category"
        />
        <CategoryGrid />
      </section>
      <section className="featured-section">
        <div className="container">
          <div className="featured-heading">
            <span className="eyebrow">COMPARE PROVIDERS</span>
            <span className="small-label">Gold IRAs and bullion dealers</span>
          </div>
          <div className="featured-layout">
            <div className="featured-copy">
              <div className="featured-gold-art" aria-hidden="true">
                <svg width="175" height="108" viewBox="0 0 175 108" fill="none">
                  <path d="m24 62 14-33h89l20 33-9 18H16Z" fill="#b79b5f" />
                  <path d="m38 29 89 0 20 33H24Z" fill="#d5c38f" />
                  <path d="m24 62 123 0-9 18H16Z" fill="#9c7c41" />
                  <path d="m62 26 13-25h60l17 25-8 15H55Z" fill="#b79b5f" />
                  <path d="M75 1h60l17 25H62Z" fill="#e2d3a8" />
                  <path d="M62 26h90l-8 15H55Z" fill="#aa8d50" />
                  <path
                    d="m62 57 20-9M97 18l16-8"
                    stroke="#8b6f37"
                    strokeWidth="2"
                  />
                  <ellipse
                    cx="83"
                    cy="95"
                    rx="70"
                    ry="6"
                    fill="#071e2c"
                    opacity=".25"
                  />
                </svg>
              </div>
              <h2>
                Gold companies,
                <br />
                with the costs spelled out.
              </h2>
              <p>
                Premiums, storage fees, custodians, and buyback spreads. See who
                sells what and what you&rsquo;d pay before you take the sales
                call.
              </p>
              <Link
                className="button button-light"
                href="/gold/best-gold-companies"
              >
                Compare gold companies <Icon name="arrow" size={18} />
              </Link>
              <Link
                href="/guides/gold-ira-fees"
                className="featured-guide-link"
              >
                New to this? Start with the fee guide{" "}
                <Icon name="arrow" size={15} />
              </Link>
              <dl className="featured-method" aria-label="How this list works">
                <div>
                  <dt>What we check</dt>
                  <dd>Costs, who it fits, and the catch.</dd>
                </div>
                <div>
                  <dt>How order works</dt>
                  <dd>
                    Our list, 1 to 3.{" "}
                    <Link href="/advertising-disclosure">Disclosure</Link>
                  </dd>
                </div>
                <div>
                  <dt>Last checked</dt>
                  <dd>{reviewedOnLabel}</dd>
                </div>
              </dl>
            </div>
            <div className="featured-companies">
              {goldProviders.slice(0, 3).map((p, i) => (
                <article
                  className="featured-company"
                  data-rank={i + 1}
                  key={p.id}
                >
                  <RankBadge rank={i + 1} />
                  <ProviderLogo provider={p} />
                  <div className="featured-company-body">
                    <span className="mini-eyebrow">
                      {i === 0 ? "FIRST ON OUR LIST" : "WORTH A LOOK"}
                    </span>
                    <h3>
                      <Link href={`/reviews/${p.id}`}>{p.name}</Link>
                    </h3>
                    <dl className="featured-facts">
                      <div>
                        <dt>Minimum</dt>
                        <dd>{p.minimum || "Ask the company"}</dd>
                      </div>
                      <div>
                        <dt>Service</dt>
                        <dd>{p.type}</dd>
                      </div>
                      <div>
                        <dt>Best for</dt>
                        <dd>{p.fit}</dd>
                      </div>
                    </dl>
                  </div>
                  <Link
                    className="feature-arrow"
                    href={`/reviews/${p.id}`}
                    aria-label={`Read the ${p.name} review`}
                  >
                    <Icon name="arrow" size={19} />
                  </Link>
                </article>
              ))}
              <Link className="all-gold-link" href="/gold/best-gold-companies">
                See all seven gold companies <Icon name="arrow" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow="UNDERSTAND THE COSTS"
          title="Short guides on the stuff that costs you money."
          href="/guides"
          linkText="Browse all guides"
        />
        <div className="guide-grid">
          {[guides[0], guides[5], guides[7]].map((g) => (
            <GuideCard key={g.slug} guide={g} />
          ))}
        </div>
      </section>
      <section className="method-section">
        <div className="container">
          <div className="method-heading">
            <div>
              <span className="eyebrow">HOW WE REVIEW</span>
              <h2>How the reviews work.</h2>
            </div>
            <p>
              Every company in a category gets the same checklist on cost, fit,
              and fine print. When we couldn&rsquo;t get an answer, the review
              says so instead of guessing.
            </p>
            <Link className="inline-link" href="/methodology">
              Read our methodology <Icon name="arrow" size={18} />
            </Link>
          </div>
          <MethodSteps />
        </div>
      </section>
      <section className="bottom-cta container">
        <div>
          <span className="eyebrow">READY WHEN YOU ARE</span>
          <h2>Pick a category and start comparing.</h2>
        </div>
        <Link href="/categories" className="button">
          Browse the categories <Icon name="arrow" size={18} />
        </Link>
      </section>
    </main>
  );
}
