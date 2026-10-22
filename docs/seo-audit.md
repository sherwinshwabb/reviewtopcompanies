# SEO audit and overhaul — October 21, 2026

This records the audit of the Top Provider Picks site, the keyword map for every ranked category, and the on-page and technical changes made. Every title, description, H1, eyebrow, intro, FAQ, and schema builder lives in `lib/seo.ts`; the catalog, guides, and policies were left as written. The same audit framework was applied to a sister publication, but all copy here was written separately so the two sites never share a title, description, heading, or FAQ.

## 1. What the audit found

| Area                        | Before                                                                                                                                                                                                                                                                                      | Risk                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Title tags                  | Category titles carried the year but no ranking modifier. Review titles were "{Company} Review (2026): {fit}", which ran long for companies with wordy fit lines. Guide titles were the on-page headlines. Methodology titles were "How We Compare {Category}". Home title was the tagline. | Weak modifiers, variable lengths, several titles over 70 characters. |
| Meta descriptions           | Reviews reused the catalog summary plus a template sentence. Guides reused the guide blurb.                                                                                                                                                                                                 | Near-duplicate snippets across reviews in the same category.         |
| H1s                         | Category H1s were the bare catalog labels ("Best Gold Companies", "Best banks"). Review H1 was the bare company name. Directory and policy H1s were slogans ("All the companies, one list.", "Spot a mistake? Tell us.").                                                                   | Primary keyword and year absent from the most important H1s.         |
| Eyebrows and intros         | Every category used "CATEGORY COMPARISON" and the catalog intro.                                                                                                                                                                                                                            | No ranking or year signal above the fold.                            |
| FAQs                        | Three to four unique questions per category, wrapped by three generic questions repeated on all ten pages.                                                                                                                                                                                  | Templated FAQPage content shared across commercial pages.            |
| Review H2s                  | "Where it fits", "Costs, terms, and who qualifies", "Who this is for".                                                                                                                                                                                                                      | Company name absent from every subheading.                           |
| Social images               | One static site-wide image.                                                                                                                                                                                                                                                                 | Identical previews for every page.                                   |
| Structured data             | Organization, WebSite, CollectionPage/ItemList, FAQPage, Article, BreadcrumbList already in place.                                                                                                                                                                                          | Articles had no `image`; guides had no `wordCount`.                  |
| Robots, sitemap, canonicals | Already correct: utility routes disallowed, priorities and change frequencies set, canonical on every page.                                                                                                                                                                                 | None.                                                                |
| Link relations              | Already correct: the paid placement carries `rel="sponsored"`, other company links `nofollow`.                                                                                                                                                                                              | None.                                                                |

## 2. Keyword map by category

| Page                                          | Primary keyword                       | Supporting terms                                                                      | Title                                                      |
| --------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `/gold/best-gold-companies`                   | best gold IRA companies               | bullion dealers, premium over spot, custodian, depository, buyback, rollover          | Best Gold IRA Companies & Bullion Dealers, Ranked for 2026 |
| `/mortgages/best-mortgage-lenders`            | best mortgage lenders                 | Loan Estimate, APR vs rate, points, rate lock, VA loans, NMLS, servicing              | Best Mortgage Lenders Ranked for 2026: Purchase, Refi & VA |
| `/legal/personal-injury`                      | best personal injury lawyers          | contingency fee, case expenses, statute of limitations, who handles my case           | Best Personal Injury Lawyers Ranked for 2026: Fees & Fit   |
| `/student-loans/best-refinance-lenders`       | best student loan refinance companies | refinance federal loans, fixed vs variable, cosigner release, consolidation, hardship | Best Student Loan Refinance Companies Ranked for 2026      |
| `/credit-cards/best-credit-cards`             | best credit cards                     | cash back vs travel, annual fee, APR, credit score needed, pre-qualification          | Best Credit Cards Ranked for 2026: Cash Back vs. Travel    |
| `/banking/best-banks`                         | best banks                            | online banks, high-yield savings, APY, FDIC, checking fees, cash deposits             | Best Banks Ranked for 2026: Online, Checking & High-Yield  |
| `/legal/lemon-law`                            | best lemon law attorneys              | what qualifies as a lemon, fee shifting, buyback, used cars, repair orders            | Best Lemon Law Attorneys Ranked for 2026: What They Cost   |
| `/debt-relief/best-debt-relief-companies`     | best debt relief companies            | debt settlement vs debt management, nonprofit counseling, lawsuits, 1099-C            | Best Debt Relief Companies Ranked for 2026: Risks & Fees   |
| `/credit-repair/best-credit-repair-companies` | best credit repair companies          | Credit Repair Organizations Act, dispute errors free, cost per month, how long        | Best Credit Repair Companies Ranked for 2026: Worth It?    |
| `/investing/best-investment-companies`        | best investment companies             | online brokers, robo-advisors, zero commission, SIPC, BrokerCheck, Form CRS           | Best Investment Companies Ranked for 2026: Brokers & Robos |

Company reviews: `{Company} Review 2026: {category suffix}` with a suffix of 24 characters or fewer so the longest company name stays under 70 characters. Descriptions are built from "best for" plus the first sentence of the company summary and a category-specific closing line. Guides: question-shaped titles ("Physical Gold or a Gold ETF? Costs, Access & Tradeoffs") with the H1 matching the title tag. Methodology: `How We Rank {Category} (2026 Criteria & Weights)`.

## 3. On-page changes

**Homepage.** H1 now carries the year and the ranking framing ("The best companies of 2026, ranked before you sign anything."). Title tag is "Best Companies of 2026, Ranked & Compared".

**Category pages (10).** Per-category eyebrow with the year, keyword-bearing H1, rewritten intro, six unique FAQs per category with the three repeated generic questions removed, FAQ heading "Frequently asked questions about {plural}", and the ItemList named after the H1. Quick picks, the table, the explainer sections, the criteria bars, and the paid placement marking are unchanged.

**Company reviews (45).** Title with year and category suffix, unique description, H1 "{Company} review", "Best for" lead line, and the company name in every H2 ("{Company} pros and cons", "{Company} costs, terms, and who qualifies", "Who {Company} is for", "How we reviewed {Company}"). Article schema carries the social image.

**Guides (14).** Search-oriented titles and descriptions; the H1 matches the title tag; Article schema carries `wordCount` and the social image.

**Methodology (11).** "How We Rank …" titles and H1s.

**Directory and policy pages.** Descriptive H1s on `/categories`, `/companies`, `/guides`, and all policy pages. Policy pages keep their original slogan as a kicker line under the new H1.

## 4. Technical changes

- `lib/seo.ts`: `resolvePageMeta` now returns an eyebrow for social images; `providerSeo`, `guideSeo`, `guideTitle`, and `methodologySeo` added; schema builders extended.
- `app/og/[...slug]/route.tsx`: per-page 1200×630 social preview showing the eyebrow, title, and reviewed date, prerendered for every content path and 404 for anything else. Referenced by `og:image` and `twitter:image` on every content page; the home and utility pages keep `/opengraph-image`.
- `app/[...slug]/page.tsx`: per-page images in `generateMetadata`, descriptive H1s.
- Tests: title and description uniqueness and length on every page, canonical and social tags, JSON-LD per page type, the social image route, year-stamped category titles and H1s, six unique FAQs per category, and company-named review headings.

## 5. Launch checklist

1. Submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
2. Validate a category page (CollectionPage/ItemList, FAQPage, BreadcrumbList), a review (Article), and a guide (Article) in Google's Rich Results Test.
3. Check `/og/gold/best-gold-companies` and a review image in the Facebook Sharing Debugger and X Card Validator.
4. When a fee, minimum, or ranking is re-verified, update `reviewedOn` in `lib/site.ts` so the visible dates, `dateModified`, and the social images stay honest.
5. Bump `currentYear` in `lib/seo.ts` in January; every title, H1, and eyebrow reads from it.
