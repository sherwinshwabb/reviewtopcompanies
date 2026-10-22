# top provider picks

A complete branded website for topproviderpicks.com (brand written in lowercase everywhere, including the logo), built with Next.js 16.3.8, React 19, TypeScript, and a reusable structured content catalog. Based on the supplied website launch guide dated October 1, 2026, with the user's explicit mockup overrides: exactly ten categories and Citadel Gold first in the gold comparison. All reader-facing copy is original to this site and is not shared with the sibling `second-review-site` project.

## Run and verify

```bash
npm ci
npm run dev -- --port 3001
npm run build
npm run lint
npm test
```

`npm test` starts the production build on port 3100 and verifies the content inventory, repayment arithmetic, all content routes and internal links, canonical and social metadata, structured data, branding assets, indexing controls, the sitemap, and 404 behavior. Build before running the tests. Interactive browser checks are performed separately.

## Included

- Original navy and teal identity using Source Serif 4 and Inter, original SVG icons, comparison artwork, and editorial illustrations.
- Logo assets in `public/brand`: stacked wordmark, horizontal wordmark, monochrome wordmark, and compact favicon mark, all reading `top provider picks` in lowercase.
- Responsive homepage, exact ten-category directory, searchable company directory, and guide library.
- Ten detailed comparison pages with service filters, alphabetical sorting, provider cards, advantages, limitations, buying guidance, category methods, FAQs, and source links.
- Company/product profiles populated from the guide's research pool. Financial offers are not fabricated; unknown pricing is directed to the official provider.
- Fourteen educational guides, including all five specified gold launch topics.
- Up to three companies in a persistent, same-category comparison. Browser storage synchronizes across tabs, tolerates malformed data, and has an in-memory fallback when storage is unavailable.
- Fixed-rate repayment calculator with payment, total interest, and total repayment; zero-interest, very small rates, invalid values, and term bounds are handled explicitly.
- About, editorial policy, ownership, methodology, contact, corrections, accessibility, privacy, terms, privacy choices, and partnership pages.
- Working copy/download message-draft tools. These do not claim to send email or collect leads.
- Unique page titles and meta descriptions for every route (`lib/seo.ts`), canonical URLs, Open Graph and Twitter card tags, an original social preview image, Organization, WebSite (with SearchAction), CollectionPage/ItemList, Article, FAQPage, and BreadcrumbList structured data, a populated sitemap, a robots file that blocks only `/search` and `/compare`, a custom 404 page, and readable mobile comparison tables.
- Site identity (name, origin, dates) lives in `lib/site.ts`. Change `siteOrigin` there if the production domain differs.
- Paid placement is handled in `lib/commercial.ts`. Citadel Gold's #1 gold position is paid. The only on-page marking is a readable "Sponsored" label on the listing itself wherever it is ranked (gold comparison card, quick pick, table row, homepage featured list), linking to the short `/advertising-disclosure` page. Citadel's outbound links carry `rel="sponsored"`; other company links carry `rel="nofollow"`. "Top pick" language is never used for a paid listing. Tests enforce this.
- Category pages carry page stats, three quick-pick cards, a jump nav, an at-a-glance table of every company, and three explainer sections per category (`lib/overviews.ts`). Review pages show "best for", "last reviewed", and related guides.

## The exact category inventory

| Label                          | Canonical route                               |
| ------------------------------ | --------------------------------------------- |
| Best Gold Companies            | `/gold/best-gold-companies`                   |
| Best Mortgage Companies        | `/mortgages/best-mortgage-lenders`            |
| Best Personal Injury Law Firms | `/legal/personal-injury`                      |
| Best Student Loan Refinance    | `/student-loans/best-refinance-lenders`       |
| Best Credit Cards              | `/credit-cards/best-credit-cards`             |
| Best banks                     | `/banking/best-banks`                         |
| Best Lemon Law Lawyers         | `/legal/lemon-law`                            |
| Best Debt Relief Companies     | `/debt-relief/best-debt-relief-companies`     |
| Best Credit Repair Companies   | `/credit-repair/best-credit-repair-companies` |
| Best Investment Companies      | `/investing/best-investment-companies`        |

Service-type filters are not additional categories. The user's final wording, **Best Lemon Law Lawyers**, is used throughout. Short aliases such as `/best-gold-companies` redirect to the canonical comparison.

## Reference sites and the product direction

| Reference                                                                | What it is                                                                                                                                                                             | What this site borrows                                                                                                            |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [ConsumersAdvocate](https://www.consumersadvocate.org/ranking)           | Broad commercial comparison publisher with partner relationships and category research. Its policy describes circumstances in which partner performance or payout can influence order. | Scannable comparisons, meaningful company details, and direct paths into reviews.                                                 |
| [ConsumerAdvisors.org](https://www.consumeradvisors.org/)                | Health and supplement product review publisher. This is the interpretation of “Consumer advisers” identified in the supplied guide.                                                    | Straightforward reviews and advantages/limitations. Its subject coverage is different from this site's financial and legal focus. |
| [TopSEOs](https://www.topseos.com/about-us)                              | Directory and ranking site for digital marketing service providers.                                                                                                                    | Searchable company profiles and category navigation.                                                                              |
| [NerdWallet](https://www.nerdwallet.com/nerdwallet-editorial-guidelines) | Financial education and comparison publisher with published editorial guidelines.                                                                                                      | Decision-focused guides, understandable terminology, and useful calculators.                                                      |
| [Forbes Advisor](https://www.forbes.com/advisor/about-us/)               | Consumer comparison and advice publication associated with the Forbes brand, distinct from general Forbes news coverage.                                                               | Detailed comparisons and visible methodology.                                                                                     |

If “Consumer advisers” meant ConsumerAffairs, that is a different reference: [ConsumerAffairs](https://www.consumeraffairs.com/) centers consumer reviews, company profiles, research, and matching tools.

The resulting positioning is **Company reviews and practical comparisons**. The brand promise is clarity, with no invented audience counters, fake customer testimonials, or manufactured expert biographies. The homepage follows the guide's headline: **Compare companies before you choose.**

## Content architecture

- `lib/catalog.ts`: ten categories, canonical routes, criteria, service filters, provider identities, official destinations, benefits, and limitations.
- `lib/guides.ts`: educational articles and source links.
- `lib/policies.ts`: supporting publication and policy content.
- `lib/loan.ts`: pure repayment math, separate from rendering.
- `lib/browser-store.ts`: browser preference persistence and synchronization.
- `components/pages.tsx`: reusable comparison, review, guide, and methodology templates.
- `components/discovery.tsx`: interactive search, company directory, and guide filtering.
- `components/comparison-context.tsx`: persistent shortlist and comparison tray.
- `components/compare-page.tsx`: accessible attribute table and company picker.
- `app/[...slug]/page.tsx`: static content routing, redirects, canonical metadata, and unknown-route handling.

A single provider record is reused in cards, reviews, the company directory, search, and comparison tables. No CMS credentials, analytics keys, or vendor secrets are required to run the preview.

## Guide implementation and remaining operating work

This is a functional website mockup and business foundation, not an already operating multimillion-dollar publisher. The build can demonstrate the full information architecture while the business completes the guide's research and operating gates.

| Guide area                             | Implementation / operating status                                                                                                                                       |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brand and interface                    | Implemented, including SVG identity and responsive templates.                                                                                                           |
| Gold-first launch design               | Implemented, with Citadel first per the mockup instruction.                                                                                                             |
| Ten-category expansion                 | All ten templates, candidate profiles, and initial guidance available in the preview.                                                                                   |
| Five gold reviews and five gold guides | Included; the profile copy is introductory and still needs the full evidence files and specialist signoff described in the guide.                                       |
| Company research and scoring           | Rubrics are represented. No numerical scores, invented testing, or unsupported customer ratings are assigned.                                                           |
| Search, filters, comparison            | Implemented locally, including persistent selections and reset.                                                                                                         |
| Conversions                            | Official outbound links work. Onsite messaging prepares downloadable drafts; it does not send or route leads.                                                           |
| Content management                     | Typed repository content, suitable for this engineering-led preview. A role-based CMS and editorial approval workflow remain to be connected.                           |
| Authors and specialist reviewers       | No fictitious people or credentials are created. Real contributor records and signoffs remain to be supplied.                                                           |
| Business identity and agreements       | Publishing entity, verified contact channel, provider agreements, final policy text, and category operating arrangements remain business inputs.                        |
| Measurement                            | No production analytics or revenue attribution service is connected.                                                                                                    |
| Public launch                          | No deployment, domain purchase, or DNS change performed. Content pages are indexable and listed in the sitemap; `/search` and `/compare` are `noindex`. Do not point a public domain at this build until the remaining research and operating gates below are complete. |

Before the site goes live on a public domain, complete factual research, operating details, publishing permissions, author/reviewer attribution, and deployment configuration. If a staging deployment must stay out of search, set `robots: { index: false }` in `app/layout.tsx` for that environment.

## Commercial launch plan

### First 30 days: prove one useful comparison

Shaun owns the business model, funding, and company relationships. Devin owns the product, implementation, and launch coordination. Assign an editor/researcher to collect standardized gold quotes and a qualified reviewer to check the research. Complete five gold company profiles and the five supporting gold guides with evidence. Connect a CMS only once the required fields and approval states are agreed.

Focus the first acquisition work on questions the publication can answer with original evidence: total account costs, same-product dealer quotes, buyback spreads, custody responsibilities, and promotion conditions. The goal is to create a page readers can actually use, with a maintenance cost the business can sustain.

### Days 31–60: measure qualified demand

Connect approved analytics and a provider destination registry. Record category views, review views, comparison use, provider clicks, accepted inquiries where applicable, qualified opportunities, and attributable revenue. Keep personal details out of event payloads. Confirm that the provider can report outcomes before spending materially on paid traffic.

Use a weekly dashboard with traffic by source, provider click rate, accepted-inquiry rate, qualified-opportunity rate, realized revenue, refund/chargeback adjustments, acquisition cost, and content maintenance cost. Test CTA clarity, page organization, and mobile usability. Compare cohorts rather than optimizing for raw form counts.

### Days 61–90: expand when the economics work

Choose the next category based on obtainable evidence, reviewer capacity, a clear reader problem, and an actual approved commercial arrangement. The other category templates are already available, but each should pass the same research and quality gates before public launch. Publish original comparisons and useful tools rather than manufacturing near-identical location or product pages.

### Revenue scenarios to validate

A useful planning model is:

`monthly revenue = sessions × outbound visit rate × accepted outcome rate × net revenue per accepted outcome`

The values below are hypothetical inputs, not market benchmarks, partner offers, forecasts, or promises. Revenue per outcome and permissible payment arrangements vary by category. They exclude operating expense, acquisition spend, taxes, and timing differences.

| Scenario           | Sessions/month | Outbound rate | Accepted outcomes / outbound visits | Net revenue / accepted outcome | Revenue/month |
| ------------------ | -------------: | ------------: | ----------------------------------: | -----------------------------: | ------------: |
| Early validation   |         20,000 |           10% |                                  3% |                           $100 |        $6,000 |
| Repeatable channel |        100,000 |           12% |                                  4% |                           $125 |       $60,000 |
| Scale illustration |        250,000 |           15% |                                  4% |                           $150 |      $225,000 |

The scale illustration annualizes to $2.7 million in revenue, not profit or company valuation. It demonstrates the volume and conversion assumptions that would need proof. Do not purchase traffic against these assumptions until actual cohort data supports positive contribution margin.

The guide budgets a gold launch at $13,000–$33,000 plus 15–20% contingency, and $2,000–$6,000 per month in editorial and operating work, excluding advertising and platform expenses. Treat these as planning allocations to validate, not quotes. The software preview does not remove the need to fund research, distribution, and ongoing updates.

## Ranking order

- Every category shows a ranked list. The top three carry gold, silver, and bronze medals (`RankBadge`) on the quick picks, the provider cards, and the at-a-glance table; ranks 4 and up show a plain number.
- `lib/ranking.ts` builds the order. Citadel Gold is pinned to #1 in gold (`pinnedFirst`); every other company in every category is shuffled with a seed fixed for the whole build, so the homepage, category pages, review pages, and search all agree.
- The seed is `RANK_SEED` from `next.config.ts`, defaulting to the build date. Each deploy reshuffles; set `RANK_SEED=anything` before `next build` to freeze an order.

## Maintenance

- Monitor provider destinations, technical failures, and changing offers.
- Recheck any displayed volatile prices or yields at least weekly.
- Review gold quotes, sources, corrections, and commercial outcomes monthly.
- Revisit methodology, provider identities, service availability, and coverage quarterly.
- Update material changes promptly and keep a dated revision history.
- Back up the repository and eventual CMS; rehearse deployment rollback and restore before public launch.

## Company brand imagery

All 45 provider/product listings use 41 locally stored company PNGs in `public/companies/`. Shared issuers reuse the same artwork. `lib/company-brands.json` controls the logo, intrinsic dimensions, brand background, and optional white contrast panel. The shared components apply this treatment to directory cards, review headers, comparison lists, related companies, search, and homepage features.

Citadel uses the exact `public/citadel-logo-official.png` from the live `citadel-website` header, unchanged, against homepage forest green `#2A3328`. The corresponding live palette includes gold `#D4AF37` and cream `#F5F0E8`.

[Company asset sources](docs/company-brand-sources.json) records the official source pages/assets and color evidence, retrieved October 1, 2026. Original PNGs are used where available; official SVG/WebP artwork is converted to PNG. Inline SVG logos carry over their site's fill styles. Backgrounds are selected from live site CSS or logo artwork, not unverified third-party palette lists. Some logos use a white inset to retain the original colors and readable contrast. No remote image services or placeholder initials are required at runtime.

Validation: production build, lint, and all four existing tests pass. An asset audit checked all 45 mappings, PNG signatures/dimensions, and the exact SHA-256 match of Citadel's copied source. The complete logo contact sheet was visually inspected. Final in-browser layout verification was blocked because the browser could not verify its admin-enforced security policy.
