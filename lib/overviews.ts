/** Longer explainers shown on each category page under "What to know". */
export const overviews: Record<string, { title: string; body: string }[]> = {
  gold: [
    {
      title: "What a gold IRA actually is",
      body: "A gold IRA is a self-directed retirement account that holds physical metal instead of, or alongside, funds and stocks. The IRS sets purity rules for the coins and bars, requires an approved custodian to run the account, and requires an approved depository to hold the metal. Most people fund one by rolling over part of an existing IRA or 401(k). It suits someone who wants a tangible asset in their retirement mix and accepts that gold pays nothing while it sits there and can drop in price.",
    },
    {
      title: "Gold IRA vs. buying bullion directly",
      body: "Ordering coins or bars from an online dealer puts the metal in your hands with no custodian, no depository, and no annual account fees. The trade-off is no tax advantage and full responsibility for storage and insurance. A gold IRA gives you tax-deferred or tax-free treatment inside the account's rules, in exchange for recurring fees, higher minimums, and distribution rules. Settle that choice first, then compare dealers within the lane you picked.",
    },
    {
      title: "Red flags in the gold business",
      body: "Walk away from anyone promising returns, forecasting economic collapse to rush you, pitching a 'home storage IRA', or refusing to put the exact product and total price in writing. Be suspicious when a call steers you from plain bullion toward high-premium 'exclusive' or collectible coins. The CFTC publishes advisories on precious metals fraud, and your state securities regulator and the Better Business Bureau keep complaint records you can check before you buy.",
    },
  ],
  mortgages: [
    {
      title: "How to compare lenders properly",
      body: "Give every lender the same scenario: property, price, down payment, term, credit profile, and rate-lock length. Within three business days of a full application each lender must send a standardized Loan Estimate. Compare the interest rate and the APR, which bakes in most lender fees, then read origination charges, discount points, and the five-year cost figure on page three. A lower advertised rate often hides higher points or fees.",
    },
    {
      title: "Conventional, FHA, VA, jumbo, and refinance",
      body: "Conventional loans follow Fannie Mae and Freddie Mac rules and usually need private mortgage insurance below 20% down. FHA loans allow lower down payments and credit scores but carry their own insurance premiums. VA loans for eligible service members and veterans typically require no down payment and no monthly mortgage insurance. Jumbo loans exceed conforming limits and have stricter requirements. A refinance replaces your current loan, so weigh closing costs against monthly savings over the years you'll keep the house.",
    },
    {
      title: "What slows a closing down",
      body: "Missing documents, an appraisal that comes in low, a title problem, or a change in your credit or employment during underwriting are the usual culprits. Ask each lender for its typical time to close, who your point of contact will be, and what happens to your rate if the lock expires before funding.",
    },
  ],
  "personal-injury": [
    {
      title: "How contingency fees really work",
      body: "Most injury lawyers take a percentage of what they recover and nothing if they recover nothing. The percentage often rises if the case goes to trial. The big variable is case expenses, such as expert witnesses, records, and filing fees, and whether they're deducted before or after the lawyer's percentage is calculated. That detail can change your net recovery by thousands, so read it in the fee agreement before you sign.",
    },
    {
      title: "Why the local office matters more than the brand",
      body: "A national firm can have excellent lawyers in one city and a referral desk in another. What you're actually hiring is the attorney assigned to your file, their experience with your type of injury, and their familiarity with the courts and insurers in your state. Ask for that person by name, look up their bar license, and ask whether they'll try the case themselves if it doesn't settle.",
    },
    {
      title: "Deadlines you can't get back",
      body: "Every state sets a statute of limitations for injury claims, and claims against government bodies often require a formal notice within months. Evidence also disappears fast: camera footage gets overwritten and witnesses move. Talking to a licensed attorney early costs nothing at most firms and keeps your options open.",
    },
  ],
  "student-loans": [
    {
      title: "What refinancing does and doesn't do",
      body: "Refinancing replaces one or more student loans with a new private loan, ideally at a lower rate or with a term that fits your budget better. It's not the same as federal consolidation, which keeps federal protections. Once a federal loan is refinanced privately, income-driven repayment, Public Service Loan Forgiveness, and federal forbearance are gone for good.",
    },
    {
      title: "Who tends to benefit",
      body: "Borrowers with a solid credit score, steady income, and private loans or high-rate federal loans they're confident they'll repay without federal help usually see the biggest gains. A cosigner can help you qualify or lower the rate, but ask how and when the cosigner can be released.",
    },
    {
      title: "Reading the fine print",
      body: "Check for origination fees, prepayment penalties, how the lender handles a job loss, whether the rate is fixed or variable, and whether the headline rate assumes autopay. Then run the full repayment, not just the monthly payment, using the calculator on this page.",
    },
  ],
  "credit-cards": [
    {
      title: "The three numbers that decide a card's value",
      body: "Your rewards rate on the categories you actually spend in, the annual fee, and the APR if you ever carry a balance. Everything else, including the welcome bonus, is secondary. Run last year's spending through each card's categories and caps, subtract the fee, and only count statement credits for things you already buy.",
    },
    {
      title: "Cash back vs. points vs. miles",
      body: "Cash back is worth face value and needs no strategy. Points programs can be worth more per point when transferred to airline or hotel partners, but only if you travel enough to use them and are willing to hunt for award availability. Co-branded airline miles are the least flexible. Pick the system that matches your real travel habits, not the one with the best story.",
    },
    {
      title: "What applying does to your credit",
      body: "Each application adds a hard inquiry, which typically costs a few points for a few months. A new account also lowers your average account age. Neither matters much in isolation, but spacing applications out helps, and you should avoid applying in the months before a mortgage or car loan.",
    },
  ],
  banking: [
    {
      title: "Online banks vs. branch banks",
      body: "Online banks usually pay more interest and charge fewer fees because they don't run branches. Branch banks offer in-person service, easy cash deposits, and sometimes relationship perks on loans. Many people use both: a branch bank for cash and a safety net, and an online bank for savings. Decide what you'll actually walk into a branch for before you pay for one.",
    },
    {
      title: "Fees to look for",
      body: "Monthly maintenance fees and their waiver rules, minimum balance penalties, out-of-network ATM charges, overdraft and non-sufficient-funds fees, wire fees, and paper statement charges. A no-fee account that pays a bit less interest often beats a high-yield account that bills you for the way you bank.",
    },
    {
      title: "FDIC coverage and fintech middlemen",
      body: "FDIC insurance covers deposits up to the standard limit per depositor, per insured bank, per ownership category. Many apps aren't banks themselves and sweep your money to partner banks. That can still be insured, but only if the arrangement is set up properly, so read which banks hold the money and remember that deposits you already have at those banks count toward the same limit.",
    },
  ],
  "lemon-law": [
    {
      title: "What qualifies as a lemon",
      body: "The general test is a vehicle with a substantial defect covered by warranty that the manufacturer can't fix after a reasonable number of attempts, or that's been out of service for a set number of days. Each state defines 'reasonable' differently, sets its own mileage and time limits, and decides whether used or leased vehicles are covered. The paperwork from every repair visit is what proves the pattern.",
    },
    {
      title: "How lemon law attorneys get paid",
      body: "Many state statutes require the manufacturer to pay the consumer's attorney fees on a successful claim, which is why most lemon law firms take cases without an upfront fee. Still get the arrangement in writing, including what happens to costs if the claim fails and whether any fee comes out of your recovery.",
    },
    {
      title: "What you can recover",
      body: "Depending on the state and the facts, a successful claim can mean the manufacturer buys the vehicle back, replaces it, or pays a cash settlement to compensate for the diminished value. A consultation can't promise any of those outcomes, and an attorney who does is one to avoid.",
    },
  ],
  "debt-relief": [
    {
      title: "Settlement, management plans, and the alternatives",
      body: "A settlement company negotiates to pay creditors less than you owe, usually after you stop paying and build up a settlement fund. A debt management plan from a nonprofit counselor keeps you paying in full, often at reduced interest, through one monthly payment. Before either, call your creditors about hardship programs and, for large balances, talk to a bankruptcy attorney about whether that's the cheaper path.",
    },
    {
      title: "What settlement can cost you",
      body: "Beyond the company's fee, which is usually a percentage of enrolled debt or of the savings, expect missed-payment damage to your credit, late fees and interest piling up while you wait, collection calls, the possibility of being sued, and a potential tax bill on forgiven amounts. Creditors can also simply refuse to settle.",
    },
    {
      title: "Rules that protect you",
      body: "Under the FTC's Telemarketing Sales Rule, companies that sell debt relief by phone can't charge a fee until they've settled a debt and you've made at least one payment under that settlement. They also have to tell you how long the program takes, what it costs, and the consequences of stopping payments. A company that wants money up front is breaking the rule.",
    },
  ],
  "credit-repair": [
    {
      title: "What credit repair companies do",
      body: "They review your reports, send dispute letters to the credit bureaus and to the lenders that reported the items, and follow up. That's the whole service. The law gives you the right to do exactly the same thing for free, and the bureaus have to investigate your dispute just as seriously as theirs.",
    },
    {
      title: "Your rights under the Credit Repair Organizations Act",
      body: "A credit repair company has to give you a written contract that spells out the services and the total cost, can't charge you before it has done the promised work, and must let you cancel within three business days without penalty. It also can't tell you to lie to a bureau or to create a new credit identity. If a company skips any of that, report it to the FTC and your state attorney general.",
    },
    {
      title: "What to do first",
      body: "Pull your reports from all three bureaus, mark anything wrong, and dispute it yourself with the bureau and the lender, sending copies of your proof. Bureaus generally have 30 days to respond. If you're overwhelmed by the volume rather than the process, a paid service might be worth the fee, but only one that's upfront about what it can't remove.",
    },
  ],
  investing: [
    {
      title: "Brokerage, robo-advisor, or human adviser",
      body: "A self-directed brokerage gives you the account and the tools and leaves every decision to you. A robo-advisor builds a diversified portfolio from a questionnaire and rebalances it for a yearly percentage. A human adviser can go further into tax, retirement, and estate planning for a higher fee or minimum. Many firms offer all three, so compare the specific service you'd use, not the brand.",
    },
    {
      title: "Where the costs hide",
      body: "Commissions are mostly gone, so look elsewhere: the expense ratios on the funds you'd hold, advisory fees, the interest the firm pays on your idle cash versus what it earns on it, margin rates, options contract fees, and transfer-out fees if you ever leave. Over decades, a difference of half a percent a year is enormous.",
    },
    {
      title: "Protections, and what they don't cover",
      body: "Check that the broker is registered with FINRA and the SEC and that any adviser is registered or licensed. SIPC coverage protects your securities and cash if the brokerage fails, up to set limits. None of that protects you from a bad investment or a down market, and no registration is a seal of quality.",
    },
  ],
};
