import Link from "next/link";
import {
  Category,
  Provider,
  categoryById,
  providersFor,
  sourceDate,
} from "@/lib/catalog";
import { Guide, guides } from "@/lib/guides";
import { overviews } from "@/lib/overviews";
import { siteName, monogram } from "@/lib/site";
import { isPaidPlacement, outboundRel } from "@/lib/commercial";
import {
  categorySeo,
  categoryPageSchema,
  faqSchema,
  reviewArticleSchema,
  guideArticleSchema,
} from "@/lib/seo";
import {
  Breadcrumb,
  SectionHeading,
  CategoryGrid,
  ProviderLogo,
  ProviderLeadImage,
  GuideCard,
  FAQ,
  MethodSteps,
} from "./ui";
import { StructuredData } from "./structured-data";
import { ReviewedOn, SponsoredTag } from "./editorial";
import { RankBadge } from "./rank-badge";
import { Icon } from "./icons";
import { CategoryComparison } from "./category-comparison";
import { CompareButton } from "./comparison-context";
import { LoanCalculator } from "./calculator";
export function CategoryDirectory() {
  return (
    <main id="main-content">
      <Breadcrumb items={[{ label: "Categories" }]} />
      <section className="page-intro container">
        <span className="eyebrow">PICK YOUR DECISION</span>
        <h1>
          Which decision
          <br />
          <em>are you making?</em>
        </h1>
        <p>
          Ten categories across money and legal help. Every company inside each
          one gets asked the same questions.
        </p>
      </section>
      <section className="container section section-top-small">
        <CategoryGrid />
      </section>
      <section className="method-section">
        <div className="container">
          <SectionHeading title="The same three steps, every time." />
          <MethodSteps />
        </div>
      </section>
    </main>
  );
}
export function CategoryPage({ category: c }: { category: Category }) {
  const list = providersFor(c.id);
  const related = guides.filter((g) => g.category === c.id);
  const legal = ["personal-injury", "lemon-law"].includes(c.id);
  const noun = c.id === "credit-cards" ? "card" : "company";
  const faqs = [
    {
      question: `How do I use this ${c.short.toLowerCase()} comparison?`,
      answer: `Filter to the service you need, read each ${noun}'s strengths and the catch, then add up to three to a side-by-side table. Confirm today's costs and eligibility with the ${noun} before you decide.`,
    },
    {
      question: `Why don't you show live rates for every ${noun}?`,
      answer:
        "Rates, fees, minimums, and availability depend on you and change without notice. Where we don't have a current, comparable figure we send you to the company's own page instead of guessing.",
    },
    ...categorySeo[c.id].faqs,
    {
      question: "Do I have to give you my contact details?",
      answer:
        "No. Every review, guide, filter, and comparison works without an account, an email, or a phone number. Company links go straight to the company's own site.",
    },
  ];
  return (
    <main id="main-content">
      <StructuredData data={categoryPageSchema(c, list)} />
      <StructuredData data={faqSchema(faqs)} />
      <Breadcrumb
        items={[
          { label: "Categories", href: "/categories" },
          { label: c.short },
        ]}
      />
      <section className="comparison-intro">
        <div className="container">
          <div className="category-title-icon">
            <Icon name={c.icon} size={31} />
          </div>
          <span className="eyebrow">CATEGORY COMPARISON</span>
          <h1>{c.title}</h1>
          <p className="intro-description">{c.intro}</p>
          <div className="byline">
            <span className="author-monogram">{monogram}</span>
            <div>
              <Link href="/about">{siteName}</Link>
              <span>
                Updated <ReviewedOn />
              </span>
            </div>
            <Link href={`/methodology/${c.id}`} className="method-link">
              <Icon name="book" size={16} /> Our criteria
            </Link>
          </div>
          <dl className="page-stats" aria-label="About this comparison">
            <div>
              <dt>
                {c.id === "credit-cards" ? "Cards" : "Companies"} compared
              </dt>
              <dd>{list.length}</dd>
            </div>
            <div>
              <dt>Criteria weighed</dt>
              <dd>{c.criteria.length}</dd>
            </div>
            <div>
              <dt>Related guides</dt>
              <dd>{related.length}</dd>
            </div>
            <div>
              <dt>Last reviewed</dt>
              <dd>
                <ReviewedOn />
              </dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="container quick-picks" aria-label="Quick picks">
        {list.slice(0, 3).map((p, i) => (
          <article className="quick-pick" data-rank={i + 1} key={p.id}>
            <div className="quick-pick-heading">
              <RankBadge rank={i + 1} />
              <span className="eyebrow">
                BEST FOR
                {isPaidPlacement(p.id) && <SponsoredTag />}
              </span>
            </div>
            <h2>
              <Link href={`#${p.id}`}>{p.name}</Link>
            </h2>
            <p>{p.fit}</p>
            <Link className="inline-link" href={`#${p.id}`}>
              Jump to it <Icon name="arrow" size={15} />
            </Link>
          </article>
        ))}
      </section>
      <nav
        className="container comparison-jump"
        aria-label="Comparison sections"
      >
        <span>On this page</span>
        <a href="#companies">The companies</a>
        <a href="#compare-table">Quick table</a>
        <a href="#overview">What to know</a>
        <a href="#choosing">What to look for</a>
        <a href="#questions">FAQ</a>
      </nav>
      <div className="container comparison-layout">
        <div className="comparison-main">
          <CategoryComparison category={c} providers={list} />
          <section className="category-table-wrap" id="compare-table">
            <h2>Every {noun} at a glance</h2>
            <p>
              The short version. Click any name for the full review, and confirm
              current terms with the {noun} before you decide.
            </p>
            <div
              className="category-table-scroll"
              role="region"
              aria-label={`${c.short} comparison table`}
              tabIndex={0}
            >
              <table className="category-table">
                <caption className="sr-only">
                  {c.title}: every {noun} in the order listed above
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{noun === "card" ? "Card" : "Company"}</th>
                    <th scope="col">{legal ? "Coverage" : "Service type"}</th>
                    <th scope="col">Best for</th>
                    <th scope="col">The catch</th>
                    <th scope="col">
                      {c.id === "gold" ? "Minimum" : "Next step"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((p, i) => (
                    <tr key={p.id} data-rank={i + 1}>
                      <td>
                        <div className="table-company">
                          <RankBadge rank={i + 1} />
                          <div>
                            <Link href={`/reviews/${p.id}`}>{p.name}</Link>
                            {isPaidPlacement(p.id) && (
                              <span className="table-sponsored">Sponsored</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{p.type}</td>
                      <td>{p.fit}</td>
                      <td>{p.limitation}</td>
                      <td>
                        {p.minimum || (
                          <Link href={`/reviews/${p.id}`}>Full review</Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="reading-section" id="overview">
            <span className="eyebrow">WHAT TO KNOW FIRST</span>
            <h2>{c.short} explained</h2>
            {overviews[c.id].map((s) => (
              <div className="overview-item" key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </section>
          <section className="reading-section" id="choosing">
            <span className="eyebrow">BEFORE YOU PICK</span>
            <h2>What to look for in {c.short.toLowerCase()}</h2>
            {c.advice.map((a, i) => (
              <div className="advice-item" key={a.title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                </div>
              </div>
            ))}
          </section>
          {c.id === "student-loans" && <LoanCalculator />}
          <section className="reading-section" id="methodology">
            <span className="eyebrow">HOW WE WEIGH IT</span>
            <h2>What we score, and how much it counts</h2>
            <p>
              These weights set our research priorities for this category. We
              don&rsquo;t publish a number for a {noun} until we&rsquo;ve
              verified enough to back it up.
            </p>
            <div className="criteria-bars">
              {c.criteria.map(([label, weight]) => (
                <div key={label}>
                  <div>
                    <span>{label}</span>
                    <strong>{weight}%</strong>
                  </div>
                  <span className="criteria-track">
                    <span style={{ width: `${weight * 2.5}%` }} />
                  </span>
                </div>
              ))}
            </div>
            <Link className="inline-link" href={`/methodology/${c.id}`}>
              See the full methodology <Icon name="arrow" size={18} />
            </Link>
          </section>
          <section className="reading-section" id="questions">
            <h2>Common questions</h2>
            <FAQ items={faqs} />
          </section>
          <section className="sources-section" id="sources">
            <h3>Sources</h3>
            <p>
              Company websites are where the product details start, not where
              our review ends. A company&rsquo;s description of itself
              isn&rsquo;t evidence of quality.
            </p>
            <ul>
              {list.map((p) => (
                <li key={p.id}>
                  <a href={p.domain} target="_blank" rel={outboundRel(p.id)}>
                    {p.name} official site <Icon name="external" size={12} />
                  </a>
                </li>
              ))}
            </ul>
            <Link href="/corrections">
              Something wrong here? Send a correction.
            </Link>
          </section>
        </div>
        <aside className="comparison-sidebar">
          <div className="sidebar-sticky">
            <span className="eyebrow">ON THIS PAGE</span>
            <nav aria-label="On this page">
              <a href="#companies">
                The companies <Icon name="arrow" size={14} />
              </a>
              <a href="#compare-table">Quick table</a>
              <a href="#overview">What to know</a>
              <a href="#choosing">What to look for</a>
              <a href="#methodology">How we weigh it</a>
              <a href="#questions">Common questions</a>
              <a href="#sources">Sources</a>
            </nav>
            <div className="sidebar-note">
              <Icon name="book" size={25} />
              <h3>Ask these first</h3>
              <p>Three questions for every {noun} on this list:</p>
              <ol>
                {c.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>
            </div>
            <Link href="/compare" className="sidebar-compare">
              <Icon name="compare" size={20} />
              <span>
                Your shortlist
                <br />
                <strong>Open the comparison →</strong>
              </span>
            </Link>
          </div>
        </aside>
      </div>
      {related.length > 0 && (
        <section className="related-section">
          <div className="container">
            <SectionHeading
              eyebrow="GO DEEPER"
              title="Guides for this category."
              href="/guides"
              linkText="All guides"
            />
            <div className="guide-grid">
              {related.slice(0, 3).map((g) => (
                <GuideCard key={g.slug} guide={g} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
export function ReviewPage({ provider: p }: { provider: Provider }) {
  const c = categoryById(p.category);
  const alternatives = providersFor(c.id)
    .filter((x) => x.id !== p.id)
    .slice(0, 3);
  const related = guides.filter((g) => g.category === c.id).slice(0, 3);
  return (
    <main id="main-content">
      <StructuredData data={reviewArticleSchema(p, c)} />
      <Breadcrumb
        items={[{ label: c.short, href: c.path }, { label: p.name }]}
      />
      <section className="review-hero container">
        <div>
          <span className="eyebrow">
            COMPANY REVIEW · {c.short.toUpperCase()}
          </span>
          <h1>{p.name}</h1>
          <p>
            {p.fit}. What the company offers, what to check, and what to ask
            before you sign.
          </p>
          <div className="byline">
            <span className="author-monogram">{monogram}</span>
            <div>
              <Link href="/about">{siteName}</Link>
              <span>
                Company profile · Updated <ReviewedOn />
              </span>
            </div>
            <Link href={`/methodology/${c.id}`} className="method-link">
              <Icon name="book" size={16} /> How we review
            </Link>
          </div>
        </div>
        <ProviderLeadImage provider={p} />
      </section>
      <div className="container review-layout">
        <article className="review-article">
          <section>
            <span className="eyebrow">AT A GLANCE</span>
            <h2>What {p.name} offers.</h2>
            <p className="lead-paragraph">{p.summary}</p>
            <dl className="fact-grid">
              <div>
                <dt>Category</dt>
                <dd>
                  <Link href={c.path}>{c.short}</Link>
                </dd>
              </div>
              <div>
                <dt>Service type</dt>
                <dd>{p.type}</dd>
              </div>
              <div>
                <dt>Best for</dt>
                <dd>{p.fit}</dd>
              </div>
              <div>
                <dt>{c.id === "gold" ? "Minimum investment" : "Pricing"}</dt>
                <dd>{p.minimum || "Check current terms with the company"}</dd>
              </div>
              <div>
                <dt>Website</dt>
                <dd>
                  <a href={p.domain} target="_blank" rel={outboundRel(p.id)}>
                    {new URL(p.domain).hostname.replace("www.", "")}{" "}
                    <Icon name="external" size={12} />
                  </a>
                </dd>
              </div>
              <div>
                <dt>Last reviewed</dt>
                <dd>
                  <ReviewedOn />
                </dd>
              </div>
            </dl>
          </section>
          <section>
            <h2>Where it fits, and where it doesn&rsquo;t</h2>
            <div className="pros-cons">
              <div>
                <h3>
                  <Icon name="check" size={19} /> Worth a look for
                </h3>
                <ul>
                  {p.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>The catch</h3>
                <p>{p.limitation}</p>
              </div>
            </div>
          </section>
          <section>
            <h2>Costs, terms, and who qualifies</h2>
            <p>{c.advice[0].body}</p>
            <p>
              Before you commit to {p.name}, ask for today&rsquo;s terms in
              writing for the exact product or service you want. Pin down every
              one-time and recurring charge, who qualifies, which states are
              covered, and how you cancel or get out.
            </p>
            {p.minimum && (
              <p>
                The company&rsquo;s own gold IRA page lists a $25,000 minimum.
                That&rsquo;s a published figure, not a quote for you, so confirm
                it and ask for the full fee schedule before you fund anything.
              </p>
            )}
          </section>
          <section>
            <h2>Who this is for</h2>
            <p>
              {p.name} belongs on your list if you&rsquo;re looking at{" "}
              {p.type.toLowerCase()}. Start with the fit above, then put its
              written terms next to the other companies in this category before
              you commit.
            </p>
            <h3>When someone else may be the better pick</h3>
            <p>{c.advice[1].body}</p>
            <p>
              {p.limitation} If that doesn&rsquo;t suit you, look at the
              alternatives below before you go any further.
            </p>
          </section>
          <section>
            <h2>What to ask {p.name}</h2>
            <ol className="question-list">
              {c.questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
              <li>
                Can I get the full agreement and today&rsquo;s terms in writing?
              </li>
            </ol>
          </section>
          <section>
            <h2>How we reviewed this company</h2>
            <p>
              We keep what a company says about itself separate from what we
              could verify. A company only gets a score once we&rsquo;ve
              confirmed its identity, current terms, and real costs and run it
              through the category&rsquo;s research process. Until then, no
              number.
            </p>
            <Link className="inline-link" href={`/methodology/${c.id}`}>
              See the {c.short.toLowerCase()} methodology{" "}
              <Icon name="arrow" size={16} />
            </Link>
          </section>
          <section className="sources-section">
            <h3>Sources</h3>
            <a href={p.domain} target="_blank" rel={outboundRel(p.id)}>
              {p.name}: official site <Icon name="external" size={13} />
            </a>
            <p>
              Built from the publisher&rsquo;s launch research dated{" "}
              {sourceDate}. Last reviewed <ReviewedOn />. Account-specific terms
              change, so confirm them with the company.
            </p>
            <Link href="/corrections">Suggest a correction</Link>
          </section>
        </article>
        <aside className="review-sidebar">
          <div className="review-action-card">
            <ProviderLogo provider={p} />
            <h3>Go to {p.name}</h3>
            <p>Check today&rsquo;s terms on the company&rsquo;s own site.</p>
            <a
              href={p.domain}
              target="_blank"
              rel={outboundRel(p.id)}
              className="button"
            >
              Visit {p.name}
              <Icon name="external" size={15} />
            </a>
            <CompareButton id={p.id} />
            <Link href={c.path}>All {c.short.toLowerCase()}</Link>
          </div>
        </aside>
      </div>
      <section className="related-section">
        <div className="container">
          <SectionHeading
            eyebrow="OTHER OPTIONS"
            title="More companies in this category."
            href={c.path}
            linkText="Full comparison"
          />
          <div className="alternatives-grid">
            {alternatives.map((a) => (
              <Link
                className="alternative-card"
                href={`/reviews/${a.id}`}
                key={a.id}
              >
                <ProviderLeadImage provider={a} />
                <h3>{a.name}</h3>
                <p>{a.fit}</p>
                <span className="inline-link">
                  Read the review <Icon name="arrow" size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="related-section related-section-guides">
          <div className="container">
            <SectionHeading
              eyebrow="READ BEFORE YOU DECIDE"
              title={`${c.short} guides.`}
              href="/guides"
              linkText="All guides"
            />
            <div className="guide-grid">
              {related.map((g) => (
                <GuideCard key={g.slug} guide={g} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
export function GuidePage({ guide: g }: { guide: Guide }) {
  const c = categoryById(g.category);
  return (
    <main id="main-content">
      <StructuredData data={guideArticleSchema(g, c)} />
      <Breadcrumb
        items={[
          { label: "Guides", href: "/guides" },
          { label: c.short, href: c.path },
        ]}
      />
      <div className="article-heading container">
        <span className="eyebrow">{c.short} · GUIDE</span>
        <h1>{g.title}</h1>
        <p>{g.description}</p>
        <div className="byline">
          <span className="author-monogram">{monogram}</span>
          <div>
            <Link href="/about">{siteName}</Link>
            <span>
              {g.minutes} min read · Updated <ReviewedOn />
            </span>
          </div>
        </div>
      </div>
      <div className="container article-layout">
        <article className="reading-column">
          {g.sections.map((s, i) => (
            <section id={`section-${i}`} key={s.title}>
              <h2>{s.title}</h2>
              <p>{s.body}</p>
            </section>
          ))}
          {g.category === "student-loans" && <LoanCalculator />}
          <section className="article-next">
            <Icon name={c.icon} size={35} />
            <h2>Now put it to use</h2>
            <p>
              Take these questions to the comparison and see which company
              answers them best.
            </p>
            <Link className="button" href={c.path}>
              Compare {c.short}
              <Icon name="arrow" size={16} />
            </Link>
          </section>
          <section className="sources-section">
            <h3>Sources</h3>
            <ul>
              {g.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label}
                    <Icon name="external" size={12} />
                  </a>
                </li>
              ))}
            </ul>
            <Link href="/corrections">Report a correction</Link>
          </section>
        </article>
        <aside className="article-sidebar">
          <span className="eyebrow">IN THIS GUIDE</span>
          {g.sections.map((s, i) => (
            <a key={s.title} href={`#section-${i}`}>
              {s.title}
            </a>
          ))}
        </aside>
      </div>
    </main>
  );
}
export function MethodologyPage({ category }: { category?: Category }) {
  return (
    <main id="main-content">
      <Breadcrumb
        items={[
          {
            label: "How we review",
            href: category ? "/methodology" : undefined,
          },
          ...(category ? [{ label: category.short }] : []),
        ]}
      />
      <section className="page-intro container">
        <span className="eyebrow">HOW WE REVIEW</span>
        <h1>
          {category ? (
            <>
              How we compare
              <br />
              <em>{category.short.toLowerCase()}.</em>
            </>
          ) : (
            <>
              Same questions,
              <br />
              <em>every company.</em>
            </>
          )}
        </h1>
        <p>
          A good comparison tells you what it costs, how the options differ, and
          where the catch is. Here&rsquo;s the process we use to get there.
        </p>
      </section>
      <div className="container">
        <MethodSteps />
      </div>
      <article className="reading-column standalone-article">
        {category ? (
          <>
            <section>
              <h2>What we look at in this category</h2>
              <p>{category.intro}</p>
              <div className="method-table">
                <table>
                  <caption>
                    Research weighting for {category.short.toLowerCase()}
                  </caption>
                  <thead>
                    <tr>
                      <th>Criterion</th>
                      <th>Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.criteria.map(([label, w]) => (
                      <tr key={label}>
                        <th scope="row">{label}</th>
                        <td>{w}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section>
              <h2>Questions every profile has to answer</h2>
              <ul>
                {category.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <section>
            <h2>Start with the decision, not the company</h2>
            <p>
              You wouldn&rsquo;t judge a gold dealer, a bank, and a law firm on
              the same checklist, so we don&rsquo;t. Each category starts from
              the service being sold, who it&rsquo;s for, and where it&rsquo;s
              available. The companies come from the publisher&rsquo;s launch
              research, with service types kept separate.
            </p>
          </section>
        )}
        <section>
          <h2>Collect evidence you can compare</h2>
          <p>
            For each company we identify the legal entity and official site,
            collect written pricing and terms, check the relevant registrations,
            and note the date and source of every fact that matters. When
            pricing depends on the customer, we compare on an identical
            scenario.
          </p>
          <p>
            Anything a company says about itself is labeled as the
            company&rsquo;s claim. On its own it doesn&rsquo;t prove quality,
            service, or results.
          </p>
        </section>
        <section>
          <h2>Show the upside and the catch together</h2>
          <p>
            Every profile should tell you who the service suits, what it costs,
            and when another option fits better. If we couldn&rsquo;t verify
            something, we say so instead of counting it for or against the
            company.
          </p>
        </section>
        <section>
          <h2>Score only when the evidence is there</h2>
          <p>
            Our model is a 100-point rubric with weights set per category. Each
            criterion gets a documented 0 to 5 rating, multiplied by its weight
            and divided by five. No company gets a published number until the
            evidence is complete and a reviewer has signed off.
          </p>
          <p>
            Identity, availability, core costs, and material terms are
            mandatory. Contradictions get resolved before anything is scored.
            Customer ratings, our editorial score, and a company&rsquo;s
            position on the page are three different things.
          </p>
        </section>
        <section>
          <h2>Keep the record correctable</h2>
          <p>
            We go back to the source when a fee, product, restriction, or
            company status changes. Readers and companies use the same
            correction form.
          </p>
          <Link className="inline-link" href="/corrections">
            Send a correction <Icon name="arrow" size={16} />
          </Link>
        </section>
        {category && (
          <Link className="button" href={category.path}>
            Back to {category.title}
            <Icon name="arrow" size={17} />
          </Link>
        )}
      </article>
    </main>
  );
}
