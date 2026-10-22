/**
 * Search copy and metadata for every page: titles, descriptions, H1s,
 * eyebrows, intros, FAQs, and the schema.org builders. The catalog, guides,
 * and policies stay as written; this module layers search-facing copy on top.
 * Nothing here invents prices, ratings, review counts, or outcomes.
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

export const currentYear = "2026";
export type Faq = { question: string; answer: string };
export type CategorySeo = {
  /** <title> before the site-name template. Keep it at or under 60 characters. */
  metaTitle: string;
  /** Meta description, 140 to 160 characters. */
  metaDescription: string;
  h1: string;
  eyebrow: string;
  intro: string;
  /** Plural noun used in templated headings ("frequently asked questions about …"). */
  plural: string;
  /** Short suffix for company review titles in this category (24 characters or fewer). */
  reviewSuffix: string;
  faqs: Faq[];
};

export const categorySeo: Record<string, CategorySeo> = {
  gold: {
    metaTitle: "Best Gold IRA Companies & Bullion Dealers, Ranked for 2026",
    metaDescription:
      "Seven gold IRA companies and bullion dealers ranked for 2026 on premiums over spot, custodian and storage fees, minimums, and buyback terms.",
    h1: "Best gold IRA companies and bullion dealers of 2026",
    eyebrow: "GOLD IRA & BULLION RANKINGS · 2026",
    intro:
      "Gold IRA companies and online bullion dealers, ranked and lined up so you can see what each one sells, what you'll pay above the spot price, and who ends up holding your metal. Every company gets the same three questions about cost, custody, and buyback, and the answers sit side by side below.",
    plural: "gold IRA companies",
    reviewSuffix: "Gold IRA Costs & Buyback",
    faqs: [
      {
        question:
          "What's the difference between a gold IRA and buying gold outright?",
        answer:
          "A gold IRA holds metal inside a tax-advantaged retirement account, which means a custodian, an approved depository, and yearly account fees. Buying outright means the coins or bars ship to you and there's no account to maintain, but no tax advantage either.",
      },
      {
        question: "Can I hold my gold IRA metals myself?",
        answer:
          "No. IRS rules require IRA metals to sit with an approved custodian at an approved depository. Taking possession yourself can be treated as a withdrawal, with taxes and penalties, no matter what a 'home storage' pitch says.",
      },
      {
        question: "What is a fair premium over spot?",
        answer:
          "It depends on the product. Common bullion bars and coins carry lower premiums than collectible or 'exclusive' coins. The only way to know if a quote is fair is to price the identical product with a second dealer on the same day.",
      },
      {
        question: "How does a gold IRA rollover work without a tax bill?",
        answer:
          "Ask for a direct, trustee-to-trustee transfer from your existing IRA or 401(k) into the new self-directed account. Money that passes through your hands has a 60-day deadline and possible withholding, so avoid that route unless a tax professional tells you otherwise.",
      },
      {
        question: "What is a buyback program actually worth?",
        answer:
          "It's a promise to make you an offer, not a promise of a price. Ask the dealer to quote today's buyback price next to today's purchase price. That gap is your real cost of entry, and it should be in writing before you fund anything.",
      },
      {
        question: "Which gold company is ranked first, and why?",
        answer:
          "Citadel Gold holds the first position in this comparison as a paid placement, which is disclosed on this page. Every other company is ordered by our research, and no position on the list is a score. Compare the written terms of any two companies before you pick one.",
      },
    ],
  },
  mortgages: {
    metaTitle: "Best Mortgage Lenders Ranked for 2026: Purchase, Refi & VA",
    metaDescription:
      "Five mortgage lenders ranked for 2026, from app-first online lenders to a VA specialist and a bank, plus how to line up Loan Estimates and read the fees.",
    h1: "Best mortgage lenders of 2026 for buying, refinancing, and VA loans",
    eyebrow: "MORTGAGE LENDER RANKINGS · 2026",
    intro:
      "The lenders ranked here cover online applications, VA financing, and bank-based home loans. Use the list to pick three, then get a Loan Estimate from each one using the same house, down payment, and term so the rate, the points, and the closing costs actually line up.",
    plural: "mortgage lenders",
    reviewSuffix: "Rates, Fees & Programs",
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
      {
        question: "Should I pay discount points for a lower rate?",
        answer:
          "Only if you'll keep the loan long enough for the monthly savings to repay the upfront cost. Divide the cost of the points by the monthly saving to find the break-even month, then compare that with how long you realistically expect to stay.",
      },
      {
        question: "Who will service my loan after closing?",
        answer:
          "Often not the lender you applied with. Many lenders sell servicing rights after funding, which changes who you pay and who handles escrow. Ask before you lock so the answer doesn't surprise you with the first statement.",
      },
    ],
  },
  "personal-injury": {
    metaTitle: "Best Personal Injury Lawyers Ranked for 2026: Fees & Fit",
    metaDescription:
      "Personal injury law firms ranked for 2026 on local experience, who handles your case, fee agreements, and licensing, before you sign a contingency contract.",
    h1: "Best personal injury lawyers and law firms of 2026",
    eyebrow: "PERSONAL INJURY LAW FIRM RANKINGS · 2026",
    intro:
      "An injury claim turns on where it happened and what kind of injury it is. The firms ranked here are a starting list, not a verdict. Start with the ones that practice in your state, then dig into who would actually work your case, how they keep you informed, and what the fee agreement says about expenses.",
    plural: "personal injury law firms",
    reviewSuffix: "Fees, Experience & Fit",
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
      {
        question: "Can I switch lawyers partway through a case?",
        answer:
          "Usually yes, but the first firm may claim a share of any eventual fee for the work it did. Read the termination clause in the fee agreement before you sign, and ask how a handoff would work if you're unhappy later.",
      },
      {
        question: "What should I bring to a first consultation?",
        answer:
          "The police or incident report, medical records and bills so far, photos, insurance correspondence, and the names of any witnesses. The more the firm can see on day one, the straighter its answer about whether it will take the case.",
      },
    ],
  },
  "student-loans": {
    metaTitle: "Best Student Loan Refinance Companies Ranked for 2026",
    metaDescription:
      "Four student loan refinance lenders ranked for 2026 on total cost, repayment flexibility, and hardship terms, and what you give up by refinancing federal loans.",
    h1: "Best student loan refinance companies of 2026",
    eyebrow: "STUDENT LOAN REFINANCE RANKINGS · 2026",
    intro:
      "Refinancing swaps your current student loans for one new private loan, ideally at a lower rate. The lenders ranked here are compared on total repayment, payment flexibility, and what happens when money gets tight. Federal borrowers should read what they'd give up before they look at a single rate.",
    plural: "student loan refinance lenders",
    reviewSuffix: "Refinance Rates & Terms",
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
      {
        question: "Is refinancing the same as consolidation?",
        answer:
          "No. A federal Direct Consolidation Loan combines federal loans and keeps federal protections, but doesn't lower your rate. Refinancing is a new private loan that can lower the rate and removes those protections. They solve different problems.",
      },
      {
        question: "What happens to my refinanced loan if I lose my job?",
        answer:
          "That's up to the lender's hardship policy, which varies widely. Ask how many months of forbearance are offered, whether interest keeps accruing, and what you must document. Use the calculator on this page to see what a few months of deferred interest adds to the total.",
      },
    ],
  },
  "credit-cards": {
    metaTitle: "Best Credit Cards Ranked for 2026: Cash Back vs. Travel",
    metaDescription:
      "Five cash back and travel credit cards ranked for 2026 on net value after the annual fee, APR, and redemption rules, matched to how you actually spend.",
    h1: "Best credit cards of 2026: cash back and travel rewards",
    eyebrow: "CREDIT CARD RANKINGS · 2026",
    intro:
      "Five widely held cards, ranked and compared on what they return after the annual fee, how their rewards redeem, and who they suit. The right card depends on whether you carry a balance and where your money actually goes each month, so start there, not with the sign-up bonus.",
    plural: "credit cards",
    reviewSuffix: "Rewards, Fees & Fit",
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
      {
        question: "What credit score do I need for these cards?",
        answer:
          "Issuers don't publish a cutoff, and approval depends on income and existing accounts as well as the score. Most rewards cards on this page are aimed at good-to-excellent credit. A pre-qualification check on the issuer's site uses a soft pull and tells you more than any rule of thumb.",
      },
      {
        question: "Should I carry a balance to build credit?",
        answer:
          "No. Paying in full every month builds the same history without interest. If you do carry a balance, the APR matters more than any reward, and a plain low-rate card beats every card on this list.",
      },
    ],
  },
  banking: {
    metaTitle: "Best Banks Ranked for 2026: Online, Checking & High-Yield",
    metaDescription:
      "Five banks ranked for 2026, from fully online to branch-heavy, compared on monthly fees, cash access, savings rate conditions, and FDIC coverage.",
    h1: "Best banks of 2026 for checking, savings, and online banking",
    eyebrow: "BANK & ACCOUNT RANKINGS · 2026",
    intro:
      "Online banks, branch banks, and a savings-only option, ranked and compared on the things that cost you money or time: monthly fees and their waivers, how you get cash in and out, what a savings rate requires, and who actually holds your deposits. Pick the account around your habits, then check the rate.",
    plural: "banks",
    reviewSuffix: "Accounts, Fees & Access",
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
      {
        question: "What's the difference between APY and the interest rate?",
        answer:
          "The interest rate is the simple annual rate. APY includes compounding over a year, so it's slightly higher and it's the number to compare between savings accounts.",
      },
      {
        question: "How long does switching banks take?",
        answer:
          "Opening the account takes minutes. Moving direct deposit and every automatic payment takes a pay cycle or two. Keep the old account open with a small cushion until the last bill has cleared from the new one.",
      },
    ],
  },
  "lemon-law": {
    metaTitle: "Best Lemon Law Attorneys Ranked for 2026: What They Cost",
    metaDescription:
      "Three lemon law firms ranked for 2026 on state experience, fee terms, and who works your claim, plus the records to gather before you hire an attorney.",
    h1: "Best lemon law lawyers and attorneys of 2026",
    eyebrow: "LEMON LAW ATTORNEY RANKINGS · 2026",
    intro:
      "Lemon law is state law, so the firms ranked here are compared on where they practice, how they're paid, and who would actually handle your file. Before you call any of them, pull together your repair orders. The timeline in those documents decides most claims.",
    plural: "lemon law attorneys",
    reviewSuffix: "Lemon Law Fees & Fit",
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
      {
        question: "Should I keep driving the car while the claim is open?",
        answer:
          "Ask your attorney, but in most cases yes, as long as it's safe. Keep every repair visit documented, keep paying the loan, and don't accept a dealer's informal fix without a written repair order showing the complaint and the outcome.",
      },
      {
        question: "Is a lemon law claim the same as a warranty claim?",
        answer:
          "No. A warranty claim asks the manufacturer to repair the defect. A lemon law claim says the repairs have failed and asks for the car to be bought back or replaced. You usually need a record of warranty repair attempts before a lemon law claim exists.",
      },
    ],
  },
  "debt-relief": {
    metaTitle: "Best Debt Relief Companies Ranked for 2026: Risks & Fees",
    metaDescription:
      "Five debt relief companies ranked for 2026, settlement firms and nonprofit counselors alike, compared on fees, completion rates, credit impact, and risks.",
    h1: "Best debt relief companies of 2026: settlement and nonprofit counseling",
    eyebrow: "DEBT RELIEF RANKINGS · 2026",
    intro:
      "Debt settlement and nonprofit credit counseling get advertised with the same words and work nothing alike. The companies ranked here are compared on what each program costs after fees, what it does to your credit, and how many people actually finish. Read the risks section before any enrollment call.",
    plural: "debt relief companies",
    reviewSuffix: "Fees, Risks & Fit",
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
      {
        question: "Can creditors sue me during a settlement program?",
        answer:
          "Yes. Enrolling in a program doesn't stop a creditor from suing over an unpaid account, and some do. Ask the company how it handles lawsuits and what share of its customers get sued while enrolled.",
      },
      {
        question: "What should I try before debt settlement?",
        answer:
          "Call the creditors yourself about hardship programs, talk to a nonprofit counselor about a debt management plan, and get a bankruptcy consultation so you know the full menu. Settlement makes the most sense when you can't pay but can save a lump sum.",
      },
    ],
  },
  "credit-repair": {
    metaTitle: "Best Credit Repair Companies Ranked for 2026: Worth It?",
    metaDescription:
      "Three credit repair companies ranked for 2026 on what they really do, what they charge, and how you cancel, next to the free dispute process you can run alone.",
    h1: "Best credit repair companies of 2026, and when you don't need one",
    eyebrow: "CREDIT REPAIR RANKINGS · 2026",
    intro:
      "Credit repair companies dispute items on your reports for a fee. You can do the same thing yourself for free. The services ranked here are compared on what they actually do, what they charge and when, how you cancel, and whether the promises survive a reading of the Credit Repair Organizations Act.",
    plural: "credit repair companies",
    reviewSuffix: "Costs, Limits & Fit",
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
      {
        question: "What does credit repair cost per month?",
        answer:
          "Most companies charge a setup fee plus a monthly fee for as long as you stay enrolled, and the total depends on how long that is. Get the full schedule and the cancellation terms in writing before you pay anything.",
      },
      {
        question: "Will credit repair help me get a mortgage sooner?",
        answer:
          "Only if your reports contain errors that are dragging the score down. If the negatives are accurate, time and on-time payments are what move the score, and a paid service can't shortcut either.",
      },
    ],
  },
  investing: {
    metaTitle: "Best Investment Companies Ranked for 2026: Brokers & Robos",
    metaDescription:
      "Five investment companies ranked for 2026, three brokerages and two robo-advisors, compared on total cost, accounts offered, tools, and what advice is included.",
    h1: "Best investment companies of 2026: brokerages and robo-advisors",
    eyebrow: "INVESTMENT COMPANY RANKINGS · 2026",
    intro:
      "Self-directed brokerages and automated investing services, ranked and compared on what they cost once the zero-commission headline is set aside, which accounts they offer, and how much help is included. Decide whether you want to pick investments or have them picked for you, then compare within that lane.",
    plural: "investment companies",
    reviewSuffix: "Costs, Tools & Fit",
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
      {
        question: "Is a robo-advisor fee worth paying?",
        answer:
          "If you'd otherwise leave cash uninvested or never rebalance, a small yearly percentage can be worth it. If you're happy holding a few index funds and rebalancing once a year, a brokerage does the same job for less.",
      },
      {
        question: "How do I check an investment company's record?",
        answer:
          "Look up the broker on FINRA BrokerCheck and any advisory arm on the SEC's Investment Adviser Public Disclosure site, then read the firm's Form CRS. Those three sources show registration, disciplinary history, and how the firm is paid.",
      },
    ],
  },
};
export const categorySeoFor = (c: Category) => categorySeo[c.id];

const firstSentence = (text: string) =>
  (text.match(/^[^.!?]+[.!?]/)?.[0] ?? text).trim();
/** Keep the sentences that fit inside the limit, in order. */
const fit = (parts: string[], max = 158) => {
  let out = "";
  for (const part of parts) {
    const next = out ? `${out} ${part}` : part;
    if (next.length <= max) out = next;
  }
  return out || parts[0].slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
};
/** Lowercase the first letter unless the first word is an acronym such as IRA or VA. */
export const lowerFirst = (text: string) => {
  const first = text.split(" ")[0];
  const acronym = first.length > 1 && first === first.toUpperCase();
  return acronym ? text : text.charAt(0).toLowerCase() + text.slice(1);
};

export function providerSeo(p: Provider) {
  const c = categoryById(p.category);
  const seo = categorySeo[c.id];
  return {
    metaTitle: `${p.name} Review ${currentYear}: ${seo.reviewSuffix}`,
    metaDescription: fit([
      `${p.name} review for ${currentYear}: best for ${lowerFirst(p.fit)}.`,
      firstSentence(p.summary),
      `See how it ranks against other ${seo.plural}.`,
    ]),
    h1: `${p.name} review`,
    eyebrow: `COMPANY REVIEW · ${c.short.toUpperCase()}`,
    plural: seo.plural,
  };
}

export const guideSeo: Record<
  string,
  { metaTitle: string; metaDescription: string }
> = {
  "gold-ira-fees": {
    metaTitle: "What a Gold IRA Really Costs: Every Fee, Line by Line",
    metaDescription:
      "Add up a gold IRA's true cost before you fund it: the premium over spot, setup and custodian charges, yearly storage, and the buyback spread, all on one page.",
  },
  "gold-dealers-custodians-depositories": {
    metaTitle: "Gold IRA Dealer, Custodian & Depository: Who Does What",
    metaDescription:
      "Three separate companies touch a gold IRA. Learn what the dealer, the custodian, and the depository are each responsible for, and what to get in writing from each.",
  },
  "compare-gold-quotes": {
    metaTitle: "How to Compare Gold Dealer Quotes: 5 Questions to Ask First",
    metaDescription:
      "A short checklist for comparing written gold quotes between dealers: the exact product, the delivered total, today's buyback price, what happens after payment, and time to think.",
  },
  "physical-gold-vs-etfs": {
    metaTitle: "Physical Gold or a Gold ETF? Costs, Access & Tradeoffs",
    metaDescription:
      "Owning bars and coins versus owning a fund that tracks gold. Compare premiums and storage with expense ratios, how fast you can sell, and which fits the rest of your money.",
  },
  "spot-gold-pressure-tactics": {
    metaTitle: "Gold Sales Call Red Flags: Pressure Tactics & How to Respond",
    metaDescription:
      "How to slow down a gold sales call, cut through fear talk about collapse and guaranteed gains, and get an itemized quote and buyback terms on paper before you decide.",
  },
  "compare-mortgage-estimates": {
    metaTitle: "How to Read a Loan Estimate & Compare Mortgage Offers",
    metaDescription:
      "The rate is one line on a three-page form. Learn how to make lender quotes match, read page two of the Loan Estimate, and find the true cost of a home loan over the years you'll keep it.",
  },
  "student-refinance-checklist": {
    metaTitle:
      "Should You Refinance Student Loans? A Pre-Application Checklist",
    metaDescription:
      "Before you trade federal protections for a lower rate: sort federal from private loans, compare total repayment instead of the payment, and read the hardship terms first.",
  },
  "choose-credit-card": {
    metaTitle: "Cash Back or Travel Rewards? How to Pick Your Credit Card",
    metaDescription:
      "Pick a credit card around how you pay the bill and where last year's money went, not the sign-up bonus in the ad. How to be honest about redemption before the annual fee hits.",
  },
  "choose-law-firm": {
    metaTitle: "What to Ask a Personal Injury Lawyer at the First Meeting",
    metaDescription:
      "The first-meeting questions that reveal who will actually handle your injury case, how the contingency fee and expenses work, and whether the firm is being straight with you.",
  },
  "debt-settlement-vs-management": {
    metaTitle:
      "Debt Settlement or a Debt Management Plan? Costs & Credit Impact",
    metaDescription:
      "Debt settlement and a debt management plan sound alike and work nothing alike. What each one costs, what it does to your credit, and the steps to try before either.",
  },
  "free-credit-report-disputes": {
    metaTitle: "How to Dispute a Credit Report Error Yourself, for Free",
    metaDescription:
      "The free dispute process the law gives you, step by step: pull all three reports, document the error, file with the bureau and the lender, and track the 30-day clock.",
  },
  "bank-account-checklist": {
    metaTitle: "How to Pick a Bank: Fees, Cash Access & FDIC Checklist",
    metaDescription:
      "Fees, cash access, and FDIC coverage come before the sign-up bonus. A practical checklist for choosing a checking or savings account around how you actually use money.",
  },
  "lemon-law-records": {
    metaTitle: "Lemon Law Records: Build the Repair Timeline a Lawyer Needs",
    metaDescription:
      "The documents a lemon law attorney needs to size up your claim, from the purchase contract to every repair order with dates and mileage, and how to organize them before the first call.",
  },
  "brokerage-vs-robo-advisor": {
    metaTitle: "Brokerage or Robo-Advisor? Choose the Service Model First",
    metaDescription:
      "Self-directed investing, automated portfolios, and human advice solve different problems. Decide which one you're paying for before you compare investment companies.",
  },
};
export const guideTitle = (g: Guide) => guideSeo[g.slug]?.metaTitle ?? g.title;

export function methodologySeo(c?: Category): {
  title: string;
  description: string;
  h1: string;
} {
  if (!c) {
    const base = staticSeo["/methodology"];
    return {
      title: base.title,
      description: base.description,
      h1: base.h1 ?? "How we rank and review companies",
    };
  }
  const seo = categorySeo[c.id];
  return {
    title: `How We Rank ${c.short} (${currentYear} Criteria & Weights)`,
    description: `The weighted criteria behind our ${seo.plural} ranking, the questions every profile has to answer, and when a company earns a published score.`,
    h1: `How we rank ${seo.plural}`,
  };
}

type StaticSeo = {
  title: string;
  description: string;
  /** Keyword-bearing page heading. Policy and directory pages fall back to their own headings. */
  h1?: string;
};
export const staticSeo: Record<string, StaticSeo> = {
  "/": {
    title: `Best Companies of ${currentYear}, Ranked & Compared | ${siteName}`,
    description:
      "Ranked, plain-English comparisons of gold IRA companies, mortgage lenders, credit cards, banks, student loan refinancing, debt relief, investing, and law firms.",
  },
  "/categories": {
    title: "Compare the Best Companies by Category: Gold, Loans, Legal & More",
    description:
      "Ten ranked categories: gold IRA companies, mortgage lenders, credit cards, banks, student loan refinancing, debt relief, credit repair, investing, and lawyers.",
    h1: "Compare the best companies by category",
  },
  "/companies": {
    title: `Company Reviews: ${providers.length} Providers Ranked & Compared`,
    description: `Profiles of all ${providers.length} companies and products we rank across ${categories.length} categories. Filter by category, read the fit and the catch, and compare up to three side by side.`,
    h1: "Company reviews, all in one list",
  },
  "/guides": {
    title: "Money & Legal Guides: Fees, Fine Print & Questions to Ask",
    description:
      "Short, practical guides on gold IRA fees, Loan Estimates, student loan refinancing, credit cards, debt relief, credit disputes, banks, and hiring a lawyer.",
    h1: "Guides to the fees and fine print",
  },
  "/methodology": {
    title: "How We Rank and Review Companies: Our Methodology",
    description: `The research framework behind ${siteName}: how we gather evidence, weigh criteria by category, and decide when a company gets a score.`,
    h1: "How we rank and review companies",
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
    title: `About ${siteName}: Who We Are & How We Work`,
    description:
      "Who we are, what we publish, and what we don't do. A commercial comparison site that covers financial and legal providers without gating anything behind a form.",
    h1: `About ${siteName}`,
  },
  "/editorial-policy": {
    title: "Editorial Policy: How We Source, Compare & Correct",
    description:
      "Our rules for publishing: every claim needs a source, comparisons must be like for like, update dates must be real, and corrections are open to everyone.",
    h1: "Editorial policy",
  },
  "/ownership": {
    title: `Who Owns and Runs ${siteName}`,
    description: `Who owns and operates ${siteName}, and where the publisher's responsibility ends.`,
    h1: "Who owns and runs this site",
  },
  "/privacy": {
    title: "Privacy Policy: What We Store & Why",
    description:
      "What this site stores in your browser, what the contact forms do with your message, and why there are no tracking pixels.",
    h1: "Privacy policy",
  },
  "/terms": {
    title: "Terms of Use",
    description:
      "The ground rules: general information rather than advice, companies responsible for their own products, and what the calculator does and doesn't do.",
    h1: "Terms of use",
  },
  "/accessibility": {
    title: "Accessibility: How This Site Works for Everyone",
    description:
      "How the site works with a keyboard and a screen reader, how comparison tables behave on small screens, and how to report a barrier.",
    h1: "Accessibility",
  },
  "/privacy-choices": {
    title: "Privacy Choices for This Browser",
    description:
      "Manage optional analytics for this browser. Global Privacy Control is honored automatically.",
    h1: "Privacy choices for this browser",
  },
  "/contact": {
    title: `Contact ${siteName}`,
    description: `Draft a question about ${siteName}, a company profile, or a comparison.`,
    h1: `Contact ${siteName}`,
  },
  "/corrections": {
    title: "Corrections: Report a Mistake in a Review or Guide",
    description:
      "Found a mistake in a review or guide? Tell us the page, the sentence, and the source, and we'll check it.",
    h1: "Report a mistake",
  },
  "/advertising-disclosure": {
    title: "Advertising Disclosure: Our One Paid Placement",
    description: "Which listing on this site is a paid placement.",
    h1: "Advertising disclosure",
  },
  "/advertise": {
    title: "Work With Us: Partnerships & Listings",
    description:
      "How companies can supply accurate information, propose a partnership, and get reporting on real outcomes rather than clicks.",
    h1: "Work with us",
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
  /** Short label shown above the title on social preview images. */
  eyebrow: string;
};

const trim = (text: string, max = 158) =>
  text.length <= max
    ? text
    : text.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";

/** One resolver shared by generateMetadata, the social image route, and the sitemap. */
export function resolvePageMeta(path: string): PageMeta | null {
  if (path === "/")
    return { kind: "home", ...staticSeo["/"], eyebrow: siteTagline };
  const c = categories.find((c) => c.path === path);
  if (c) {
    const seo = categorySeo[c.id];
    return {
      kind: "category",
      title: seo.metaTitle,
      description: seo.metaDescription,
      eyebrow: seo.eyebrow,
    };
  }
  const parts = path.split("/");
  if (parts[1] === "reviews" && parts.length === 3) {
    const p = providerById(parts[2]);
    if (!p) return null;
    const seo = providerSeo(p);
    return {
      kind: "review",
      title: seo.metaTitle,
      description: seo.metaDescription,
      eyebrow: seo.eyebrow,
    };
  }
  if (parts[1] === "guides" && parts.length === 3) {
    const g = guideBySlug(parts[2]);
    if (!g) return null;
    const seo = guideSeo[g.slug];
    return {
      kind: "guide",
      title: seo?.metaTitle ?? g.title,
      description: trim(seo?.metaDescription ?? g.description),
      eyebrow: `${categoryById(g.category).short.toUpperCase()} · GUIDE`,
    };
  }
  if (parts[1] === "methodology" && parts.length === 3) {
    const cat = categories.find((c) => c.id === parts[2]);
    if (!cat) return null;
    const seo = methodologySeo(cat);
    return {
      kind: "methodology",
      title: seo.title,
      description: seo.description,
      eyebrow: "HOW WE RANK",
    };
  }
  if (path === "/methodology")
    return { kind: "methodology", ...staticSeo[path], eyebrow: "HOW WE RANK" };
  if (["/categories", "/companies", "/guides"].includes(path))
    return { kind: "directory", ...staticSeo[path], eyebrow: siteTagline };
  if (["/compare", "/search"].includes(path))
    return { kind: "utility", ...staticSeo[path], eyebrow: siteTagline };
  if (parts.length === 2 && policies[parts[1]] && staticSeo[path])
    return {
      kind: "policy",
      ...staticSeo[path],
      eyebrow: policies[parts[1]].eyebrow,
    };
  return null;
}

/** Every indexable content path, used by the sitemap, static params, and social images. */
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
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: siteUrl(`/og${c.path}`),
    },
    mainEntity: {
      "@type": "ItemList",
      name: seo.h1,
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
  const seo = providerSeo(p);
  return {
    "@context": context,
    "@type": "Article",
    "@id": siteUrl(path),
    mainEntityOfPage: siteUrl(path),
    headline: seo.metaTitle,
    description: seo.metaDescription,
    image: siteUrl(`/og${path}`),
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
    headline: guideTitle(g),
    description: guideSeo[g.slug]?.metaDescription ?? g.description,
    image: siteUrl(`/og${path}`),
    inLanguage: "en-US",
    articleSection: c.short,
    timeRequired: `PT${g.minutes}M`,
    wordCount: g.sections.reduce((n, s) => n + s.body.split(/\s+/).length, 0),
    author: editorialAuthor(),
    publisher: { "@id": organizationId() },
    datePublished: publishedOn,
    dateModified: reviewedOn,
  };
}
