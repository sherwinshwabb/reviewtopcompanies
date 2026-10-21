/**
 * Per-page titles, descriptions, FAQs, and schema.org builders.
 * Nothing here invents prices, ratings, or review counts.
 */
import {
  categories,
  providers,
  providerById,
  categoryById,
  type Category,
  type Provider,
} from "./catalog";
import { guides, guideBySlug, type Guide } from "./guides";
import { policies } from "./policies";
import {
  siteName,
  siteOrigin,
  siteUrl,
  siteDescription,
  siteTagline,
  publishedOn,
  reviewedOn,
} from "./site";

export type Faq = { question: string; answer: string };
type CategorySeo = {
  metaTitle: string;
  metaDescription: string;
  faqs: Faq[];
};

export const categorySeo: Record<string, CategorySeo> = {
  gold: {
    metaTitle: "Best Gold IRA Companies & Bullion Dealers (2026)",
    metaDescription:
      "Seven gold companies compared on premiums over spot, custodian and storage fees, minimums, and buyback terms. Know the full cost of a gold IRA before you fund one.",
    faqs: [
      {
        question:
          "What's the difference between a gold IRA and buying gold outright?",
        answer:
          "A gold IRA holds metal inside a tax-advantaged retirement account, which means a custodian, an approved depository, and yearly account fees. Buying outright means the coins or bars ship to you and there's no account to maintain, but no tax advantage either.",
      },
      {
        question: "Can I keep gold IRA metals at home?",
        answer:
          "No. IRS rules require IRA metals to be held by an approved custodian at an approved depository. Taking possession yourself can be treated as a withdrawal, with taxes and penalties.",
      },
      {
        question: "What is a fair premium over spot?",
        answer:
          "It depends on the product. Common bullion bars and coins carry lower premiums than collectible or 'exclusive' coins. The only way to know if a quote is fair is to price the identical product with a second dealer on the same day.",
      },
    ],
  },
  mortgages: {
    metaTitle: "Best Mortgage Lenders (2026): Purchase, Refinance & VA Loans",
    metaDescription:
      "Compare online lenders, a VA specialist, and a bank-based lender for your next home loan. How to line up Loan Estimates, read the fees, and check licensing.",
    faqs: [
      {
        question: "How many lenders should I get mortgage quotes from?",
        answer:
          "At least three, all on the same day, using the same property, down payment, term, and lock period. Rate shopping within a short window counts as a single credit inquiry for scoring purposes.",
      },
      {
        question: "What's the difference between the rate and the APR?",
        answer:
          "The interest rate is what you pay on the balance. The APR folds in most lender fees and points, which makes it a better single number for comparing two loans of the same type and term.",
      },
      {
        question: "Is an online pre-approval the same as being approved?",
        answer:
          "No. A pre-approval is an estimate based on what you told the lender. Final approval comes after underwriting checks your documents, the appraisal, and the title.",
      },
      {
        question: "What is NMLS Consumer Access?",
        answer:
          "It's a free public database where you can confirm that a mortgage lender and an individual loan officer are licensed, and see any public enforcement history.",
      },
    ],
  },
  "personal-injury": {
    metaTitle: "Best Personal Injury Lawyers & Law Firms (2026)",
    metaDescription:
      "Compare injury law firms on local experience, who handles your case, fee agreements, and licensing. The questions to ask before you sign a contingency agreement.",
    faqs: [
      {
        question: "How do personal injury lawyers get paid?",
        answer:
          "Most work on contingency, taking a percentage of what they recover for you. The percentage, and whether case expenses come out before or after it's calculated, should be in a written fee agreement.",
      },
      {
        question: "Do I owe anything if my case loses?",
        answer:
          "That depends on the fee agreement. Some firms absorb case costs on a loss, others bill you for them. Ask directly and get the answer in writing.",
      },
      {
        question: "Does a national firm mean better results?",
        answer:
          "Not on its own. What matters is the specific attorney assigned to you, their experience with your type of injury, and whether they regularly handle cases in your state.",
      },
      {
        question: "How long do I have to file an injury claim?",
        answer:
          "Each state sets its own deadline, called the statute of limitations, and some claims against government entities have much shorter notice periods. Ask a licensed attorney in your state as soon as you can.",
      },
    ],
  },
  "student-loans": {
    metaTitle: "Best Student Loan Refinance Lenders (2026)",
    metaDescription:
      "Compare private student loan refinance lenders on total cost, repayment flexibility, and hardship terms. What you give up when you refinance federal loans.",
    faqs: [
      {
        question: "Should I refinance federal student loans?",
        answer:
          "Only if you're sure you won't need income-driven repayment, forgiveness programs, or federal forbearance. Private refinancing ends those protections permanently, even if the rate is lower.",
      },
      {
        question: "Does checking my refinance rate hurt my credit?",
        answer:
          "Most lenders show an initial rate with a soft credit pull, which has no effect. A full application triggers a hard inquiry.",
      },
      {
        question: "Fixed or variable rate?",
        answer:
          "A fixed rate stays put for the life of the loan. A variable rate starts lower but moves with the market. If you'd struggle with a payment increase, fixed is the safer choice.",
      },
      {
        question: "Can I release my cosigner later?",
        answer:
          "Some lenders allow it after a set number of on-time payments and a credit check. Ask about the exact requirements before you borrow.",
      },
    ],
  },
  "credit-cards": {
    metaTitle: "Best Credit Cards (2026): Cash Back & Travel Compared",
    metaDescription:
      "Compare cash back and travel credit cards on net value, APR, annual fees, and redemption rules. Pick the card that pays off for how you actually spend.",
    faqs: [
      {
        question: "Is a card with an annual fee worth it?",
        answer:
          "Only if the rewards and credits you'd actually use are worth more than the fee. Run your real spending through the card's categories and ignore perks you'd never redeem.",
      },
      {
        question: "Cash back or points?",
        answer:
          "Cash back is simple and always worth face value. Points can be worth more when transferred to travel partners, but that takes time, flexibility, and enough travel to make it pay.",
      },
      {
        question: "Does applying for a card hurt my credit?",
        answer:
          "An application adds a hard inquiry, which usually costs a few points for a few months. Opening the account also lowers your average account age. Neither is a big deal unless you apply for several cards at once.",
      },
      {
        question: "Why doesn't this page show APRs?",
        answer:
          "APRs, bonus offers, and fees change often and depend on your credit. We send you to the issuer's own page so you see today's terms instead of a number we'd have to guess at.",
      },
    ],
  },
  banking: {
    metaTitle: "Best Banks (2026): Checking & Savings Compared",
    metaDescription:
      "Compare online banks, branch banks, and savings-only accounts on monthly fees, cash access, interest conditions, and FDIC coverage. Find the account that fits how you bank.",
    faqs: [
      {
        question: "Is an online bank safe?",
        answer:
          "If it's FDIC insured, your deposits are covered the same as at a branch bank. Look the bank up on FDIC BankFind and read how any fintech partner-bank arrangement works.",
      },
      {
        question: "How do I avoid monthly checking fees?",
        answer:
          "Most banks waive the fee if you set up direct deposit, keep a minimum balance, or meet an activity requirement. Read the specific waiver rules for the account before you open it.",
      },
      {
        question: "Can I put cash into an online bank account?",
        answer:
          "Sometimes, through retail partners or ATM networks, often with limits or fees. If you handle cash regularly, confirm the process before switching.",
      },
      {
        question: "Does a high savings rate last?",
        answer:
          "Rates on savings accounts can change at any time, and promotional rates often require direct deposit or a minimum balance. Treat the rate as a bonus, not the reason to choose the bank.",
      },
    ],
  },
  "lemon-law": {
    metaTitle: "Best Lemon Law Lawyers & Attorneys (2026)",
    metaDescription:
      "Compare lemon law firms on state experience, fee terms, and who works your claim. What records to gather and what to ask before you hire an attorney for a defective car.",
    faqs: [
      {
        question: "What makes a car a lemon?",
        answer:
          "Generally, a vehicle with a substantial defect covered by warranty that the manufacturer can't fix after a reasonable number of attempts or a set number of days out of service. The exact test depends on your state's law.",
      },
      {
        question: "What does a lemon law lawyer cost?",
        answer:
          "Many state lemon laws require the manufacturer to pay your attorney's fees if you win, so firms often take cases at no upfront cost. Get the fee arrangement in writing, including what happens if the case fails.",
      },
      {
        question: "Does lemon law cover used cars?",
        answer:
          "In some states, yes, if the car was still under the manufacturer's warranty. Other states limit coverage to new vehicles. Ask an attorney licensed in your state.",
      },
      {
        question: "What do I get if I win?",
        answer:
          "Usually a repurchase of the vehicle, a replacement, or a cash settlement, depending on the state and the facts. A consultation can't promise any particular outcome.",
      },
    ],
  },
  "debt-relief": {
    metaTitle: "Best Debt Relief Companies (2026): Settlement vs. Counseling",
    metaDescription:
      "Compare debt settlement companies and nonprofit credit counseling on fees, completion rates, and credit impact. Know the risks before you enroll in any program.",
    faqs: [
      {
        question: "Does debt settlement hurt my credit?",
        answer:
          "Usually, yes. Most programs have you stop paying creditors while a settlement fund builds, which means missed payments on your report and possible collection activity.",
      },
      {
        question: "Is forgiven debt taxable?",
        answer:
          "Often. Creditors may report forgiven amounts over a threshold to the IRS, and it can count as income. Talk to a tax professional before you settle.",
      },
      {
        question: "What does a nonprofit credit counselor charge?",
        answer:
          "Counseling sessions are usually free or low cost. A debt management plan typically carries a modest setup fee and a monthly fee. Ask for the numbers in writing.",
      },
      {
        question:
          "Can a settlement company charge me before settling anything?",
        answer:
          "Under federal rules, companies that sell services by phone can't collect a fee until they've settled a debt and you've made at least one payment under that settlement. Be wary of anyone asking for money up front.",
      },
    ],
  },
  "credit-repair": {
    metaTitle: "Best Credit Repair Companies (2026): Compared Honestly",
    metaDescription:
      "Compare paid credit repair services on what they actually do, what they charge, and how you cancel. Plus the free dispute process you can use yourself first.",
    faqs: [
      {
        question: "Can a credit repair company remove accurate negative items?",
        answer:
          "No. Accurate, current negative information stays on your report until it ages off, usually after seven years. Anyone who promises to erase it is promising something they can't legally deliver.",
      },
      {
        question: "Is it free to dispute credit report errors myself?",
        answer:
          "Yes. You can dispute directly with each credit bureau and with the lender that reported the item, and they're required to investigate. Paid services do the same thing on your behalf.",
      },
      {
        question: "What does the Credit Repair Organizations Act require?",
        answer:
          "Among other things, companies must give you a written contract, can't charge before completing promised services, and must let you cancel within three business days.",
      },
      {
        question: "How long does credit repair usually take?",
        answer:
          "Bureaus generally have 30 days to investigate a dispute. Legitimate fixes can show up within a billing cycle or two. Anyone promising a specific score jump by a specific date is guessing.",
      },
    ],
  },
  investing: {
    metaTitle: "Best Investment Companies (2026): Brokerages & Robo-Advisors",
    metaDescription:
      "Compare self-directed brokerages and automated investing services on total cost, accounts offered, tools, and what advice is included. Choose the service model before the firm.",
    faqs: [
      {
        question:
          "What's the difference between a brokerage and a robo-advisor?",
        answer:
          "A brokerage gives you an account and the tools to pick and trade investments yourself. A robo-advisor builds a portfolio from your answers to a questionnaire, then manages and rebalances it for a yearly fee.",
      },
      {
        question: "If trades are free, how does the broker make money?",
        answer:
          "From interest on uninvested cash, payment for order flow, margin lending, fund expense ratios, and fees on advisory services. Zero commissions doesn't mean zero cost.",
      },
      {
        question: "What does SIPC protection cover?",
        answer:
          "SIPC protects your securities and cash if the brokerage fails, up to set limits. It does not cover losses from investments going down in value.",
      },
      {
        question: "How much do I need to start investing?",
        answer:
          "Many brokerages and robo-advisors have no minimum or a low one, and fractional shares let you start with a small amount. Advice services usually require more. Check the specific account's minimum.",
      },
    ],
  },
};

type StaticSeo = { title: string; description: string };
export const staticSeo: Record<string, StaticSeo> = {
  "/": {
    title: `${siteName} | compare companies before you commit`,
    description: siteDescription,
  },
  "/categories": {
    title: "All Categories: Compare Companies by Industry",
    description:
      "Ten comparison categories covering gold IRAs, mortgages, credit cards, banks, student loan refinancing, debt relief, credit repair, investing, and legal services.",
  },
  "/companies": {
    title: "Company Reviews: Every Provider We Cover",
    description:
      "Browse profiles of every company we've reviewed, filter by category, and add up to three to a side-by-side comparison. No account required.",
  },
  "/guides": {
    title: "Guides: Fees, Fine Print & Questions to Ask",
    description:
      "Short, practical guides on gold IRA fees, Loan Estimates, student loan refinancing, credit cards, debt relief, credit disputes, and choosing a lawyer.",
  },
  "/methodology": {
    title: "How We Review and Compare Companies",
    description: `The research framework behind ${siteName}: how we gather evidence, weigh criteria by category, and decide when a company gets a score.`,
  },
  "/compare": {
    title: "Compare Companies Side by Side",
    description:
      "See up to three companies in the same category in one table: fit, service type, costs to confirm, strengths, and limitations.",
  },
  "/search": {
    title: "Search Reviews, Categories & Guides",
    description: `Search every company review, category comparison, and guide on ${siteName}.`,
  },
  "/about": {
    title: `About ${siteName}`,
    description:
      "Who we are, what we publish, and what we don't do. A commercial comparison site that covers financial and legal providers without gating anything behind a form.",
  },
  "/editorial-policy": {
    title: "Editorial Policy",
    description:
      "Our rules for publishing: every claim needs a source, comparisons must be like for like, update dates must be real, and corrections are open to everyone.",
  },
  "/ownership": {
    title: "Ownership",
    description: `Who owns and operates ${siteName}, and where the publisher's responsibility ends.`,
  },
  "/privacy": {
    title: "Privacy Policy",
    description:
      "What this site stores in your browser, what the contact forms do with your message, and why there are no tracking pixels.",
  },
  "/terms": {
    title: "Terms of Use",
    description:
      "The ground rules: general information rather than advice, companies responsible for their own products, and what the calculator does and doesn't do.",
  },
  "/accessibility": {
    title: "Accessibility",
    description:
      "How the site works with a keyboard and a screen reader, how comparison tables behave on small screens, and how to report a barrier.",
  },
  "/privacy-choices": {
    title: "Privacy Choices",
    description:
      "Manage optional analytics for this browser. Global Privacy Control is honored automatically.",
  },
  "/contact": {
    title: "Contact Us",
    description: `Draft a question about ${siteName}, a company profile, or a comparison.`,
  },
  "/corrections": {
    title: "Report a Correction",
    description:
      "Found a mistake in a review or guide? Tell us the page, the sentence, and the source, and we'll check it.",
  },
  "/advertising-disclosure": {
    title: "Advertising Disclosure",
    description:
      'What a "Sponsored" label means on this site and which listing is a paid position.',
  },
  "/advertise": {
    title: "Work With Us: Partnerships & Listings",
    description:
      "How companies can supply accurate information, propose a partnership, and get reporting on real outcomes rather than clicks.",
  },
};

export type PageMeta = {
  kind:
    | "home"
    | "category"
    | "review"
    | "guide"
    | "directory"
    | "methodology"
    | "policy"
    | "utility";
  title: string;
  description: string;
};

const trim = (text: string, max = 158) =>
  text.length <= max
    ? text
    : text.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";

export function resolvePageMeta(path: string): PageMeta | null {
  if (path === "/") return { kind: "home", ...staticSeo["/"] };
  const c = categories.find((c) => c.path === path);
  if (c) {
    const seo = categorySeo[c.id];
    return {
      kind: "category",
      title: seo.metaTitle,
      description: seo.metaDescription,
    };
  }
  const parts = path.split("/");
  if (parts[1] === "reviews" && parts.length === 3) {
    const p = providerById(parts[2]);
    if (!p) return null;
    const cat = categoryById(p.category);
    return {
      kind: "review",
      title: `${p.name} Review (2026): ${p.fit}`,
      description: trim(
        `${p.summary} Part of our ${cat.short.toLowerCase()} comparison.`,
      ),
    };
  }
  if (parts[1] === "guides" && parts.length === 3) {
    const g = guideBySlug(parts[2]);
    if (!g) return null;
    return { kind: "guide", title: g.title, description: trim(g.description) };
  }
  if (parts[1] === "methodology" && parts.length === 3) {
    const cat = categories.find((c) => c.id === parts[2]);
    if (!cat) return null;
    return {
      kind: "methodology",
      title: `How We Compare ${cat.short}`,
      description: trim(
        `The criteria and weights we use to research ${cat.short.toLowerCase()}, the questions every profile has to answer, and when a score gets published.`,
      ),
    };
  }
  if (path === "/methodology")
    return { kind: "methodology", ...staticSeo[path] };
  if (["/categories", "/companies", "/guides"].includes(path))
    return { kind: "directory", ...staticSeo[path] };
  if (["/compare", "/search"].includes(path))
    return { kind: "utility", ...staticSeo[path] };
  if (parts.length === 2 && policies[parts[1]] && staticSeo[path])
    return { kind: "policy", ...staticSeo[path] };
  return null;
}

/** Every indexable content path, used by the sitemap and static params. */
export const contentPaths = [
  ...categories.map((c) => c.path),
  ...providers.map((p) => `/reviews/${p.id}`),
  ...guides.map((g) => `/guides/${g.slug}`),
  ...categories.map((c) => `/methodology/${c.id}`),
  ...Object.keys(policies).map((p) => `/${p}`),
  "/categories",
  "/companies",
  "/guides",
  "/methodology",
];

// ---- schema.org builders -------------------------------------------------
type Json = Record<string, unknown>;
const context = "https://schema.org";
export const organizationId = () => siteUrl("/#organization");
export const websiteId = () => siteUrl("/#website");

export function organizationSchema(): Json {
  return {
    "@context": context,
    "@type": "Organization",
    "@id": organizationId(),
    name: siteName,
    url: siteOrigin,
    slogan: siteTagline,
    logo: { "@type": "ImageObject", url: siteUrl("/brand/logo.svg") },
    description: siteDescription,
  };
}

export function websiteSchema(): Json {
  return {
    "@context": context,
    "@type": "WebSite",
    "@id": websiteId(),
    name: siteName,
    url: siteOrigin,
    inLanguage: "en-US",
    publisher: { "@id": organizationId() },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: siteUrl("/search?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

const editorialAuthor = () => ({
  "@type": "Organization",
  name: `${siteName} editorial team`,
  url: siteUrl("/about"),
});

export function faqSchema(items: Faq[]): Json {
  return {
    "@context": context,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function categoryPageSchema(c: Category, list: Provider[]): Json {
  const seo = categorySeo[c.id];
  return {
    "@context": context,
    "@type": "CollectionPage",
    "@id": siteUrl(c.path),
    url: siteUrl(c.path),
    name: seo.metaTitle,
    description: seo.metaDescription,
    inLanguage: "en-US",
    isPartOf: { "@id": websiteId() },
    publisher: { "@id": organizationId() },
    author: editorialAuthor(),
    datePublished: publishedOn,
    dateModified: reviewedOn,
    mainEntity: {
      "@type": "ItemList",
      name: `${c.title} compared`,
      numberOfItems: list.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: list.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.name,
        url: siteUrl(`/reviews/${p.id}`),
      })),
    },
  };
}

export function reviewArticleSchema(p: Provider, c: Category): Json {
  const path = `/reviews/${p.id}`;
  return {
    "@context": context,
    "@type": "Article",
    "@id": siteUrl(path),
    mainEntityOfPage: siteUrl(path),
    headline: `${p.name} review`,
    description: p.summary,
    inLanguage: "en-US",
    articleSection: c.short,
    author: editorialAuthor(),
    publisher: { "@id": organizationId() },
    datePublished: publishedOn,
    dateModified: reviewedOn,
    about: { "@type": "Organization", name: p.name, url: p.domain },
  };
}

export function guideArticleSchema(g: Guide, c: Category): Json {
  const path = `/guides/${g.slug}`;
  return {
    "@context": context,
    "@type": "Article",
    "@id": siteUrl(path),
    mainEntityOfPage: siteUrl(path),
    headline: g.title,
    description: g.description,
    inLanguage: "en-US",
    articleSection: c.short,
    timeRequired: `PT${g.minutes}M`,
    author: editorialAuthor(),
    publisher: { "@id": organizationId() },
    datePublished: publishedOn,
    dateModified: reviewedOn,
  };
}
