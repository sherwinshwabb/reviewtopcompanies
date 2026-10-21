export type Guide = {
  slug: string;
  title: string;
  category: string;
  minutes: number;
  description: string;
  art: string;
  sections: { title: string; body: string }[];
  sources: { label: string; url: string }[];
};
export const guides: Guide[] = [
  {
    slug: "gold-ira-fees",
    title: "Gold IRA fees: what you'll actually pay",
    category: "gold",
    minutes: 6,
    description:
      "Premiums, setup charges, storage, and the buyback spread. How to add up a gold IRA's real cost before you fund it.",
    art: "gold",
    sections: [
      {
        title: "The metal costs more than spot",
        body: "Spot is the wholesale benchmark you see on the news. Nobody sells coins at spot. The dealer adds a premium that covers the product, the service, and their margin, and it varies a lot between a common bullion bar and a 'premium' coin. Ask for the exact product, weight, purity, quantity, and the total you'd pay. Then ask another dealer for the same basket on the same afternoon.",
      },
      {
        title: "Split the one-time fees from the yearly ones",
        body: "A precious metals IRA can involve an account setup charge, an annual custodian fee, annual storage, insurance, shipping, and a fee each time you buy or sell. Each of those may be billed by a different company. Ask who charges what, and whether any 'first year free' promotion snaps back to full price in year two. A line-by-line schedule tells you more than one advertised account fee.",
      },
      {
        title: "Ask for the buyback price today",
        body: "Have the dealer tell you what they'd pay to buy the same metal back right now. The gap between that number and your purchase price is the cost of getting in and out, and it's often the biggest fee nobody mentions. Ask whether the buyback quote is binding and how long it stands.",
      },
      {
        title: "Put it all on one page",
        body: "Write down the premium, the setup cost, the annual account and storage fees, and the exit spread, using the amount you actually plan to invest and the years you plan to hold. Ask for every minimum, promotion, and condition in writing. If a salesperson won't put it on paper, that tells you something too.",
      },
    ],
    sources: [
      {
        label: "CFTC: Gold is no safe investment",
        url: "https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CustomerAdvisory_Gold.html",
      },
      {
        label: "Citadel Gold: account and fee information",
        url: "https://www.citadelgold.com/gold-ira/",
      },
    ],
  },
  {
    slug: "gold-dealers-custodians-depositories",
    title: "Dealer, custodian, depository: who does what in a gold IRA",
    category: "gold",
    minutes: 5,
    description:
      "Three companies touch your gold IRA. Here's what each one is responsible for and what to get in writing from each.",
    art: "book",
    sections: [
      {
        title: "The dealer sells you the metal",
        body: "The dealer is the company running the ads. It helps you pick products, sets the price, arranges delivery to the depository, and usually offers to buy the metal back later. Get a written purchase agreement that names the exact product and the company you're buying from.",
      },
      {
        title: "The custodian runs the account",
        body: "A self-directed IRA custodian handles the tax paperwork, the reporting, and the rules about what the account can hold. Ask about its fees, how you send instructions, and how you'd move or close the account. Dealers usually recommend a custodian. That's a starting point, not a decision.",
      },
      {
        title: "The depository holds the bars",
        body: "The storage agreement should say where the metal sits, whether your bars are segregated or pooled with everyone else's, how it's insured, and how you get it out. Ask what paperwork proves the specific holdings are yours.",
      },
      {
        title: "Know the chain before you fund",
        body: "Before any money moves, write down all three companies and ask each one what happens if a shipment goes missing, the account has an error, or you want to sell. Keep the account agreement, the purchase confirmation, and the storage receipts in one folder.",
      },
    ],
    sources: [
      {
        label:
          "IRS: Investments in collectibles in individually directed qualified plan accounts",
        url: "https://www.irs.gov/retirement-plans/investments-in-collectibles-in-individually-directed-qualified-plan-accounts",
      },
    ],
  },
  {
    slug: "compare-gold-quotes",
    title: "Five questions to ask a gold dealer before you pay",
    category: "gold",
    minutes: 5,
    description:
      "A short checklist for comparing written gold quotes, buyback terms, and delivery promises between dealers.",
    art: "gold",
    sections: [
      {
        title: "What exactly is the product?",
        body: "Write down the mint, the product name, the weight, the purity, the condition, and how many you're buying. A graded collectible coin and a plain bullion bar are different things with different premiums, even though both are gold.",
      },
      {
        title: "What's the delivered total?",
        body: "Ask for the number after the premium, the payment-method fee, shipping, and any account charges. Note when the quote was given and when it expires, because spot moves all day and you want apples to apples.",
      },
      {
        title: "What would you pay to buy it back?",
        body: "Ask for the buyback bid on the same product right now. Then read the fine print: minimum quantities, who pays return shipping, and how long payment takes.",
      },
      {
        title: "What happens after I pay?",
        body: "Get the delivery or storage timeline in writing, and know which company you'd call about a delay, a short shipment, or a return.",
      },
      {
        title: "Can I sleep on it?",
        body: "Keep copies of every quote and agreement. If the pitch leans on urgency, guaranteed gains, or a deal that can't be written down, that's your answer.",
      },
    ],
    sources: [
      {
        label: "CFTC: Precious metals fraud",
        url: "https://www.cftc.gov/LearnAndProtect/FraudAwarenessPrevention/PreciousMetalsFraud/index.htm",
      },
    ],
  },
  {
    slug: "physical-gold-vs-etfs",
    title: "Physical gold vs. a gold ETF",
    category: "gold",
    minutes: 7,
    description:
      "Owning bars versus owning a fund. The costs, the access, and the tradeoffs of each way to hold gold.",
    art: "chart",
    sections: [
      {
        title: "Decide what you want to own",
        body: "Buying bullion means you own a physical thing, delivered to you or stored for you. Buying a gold exchange-traded fund means you own shares of a fund whose job is to track the gold price, as described in its prospectus. Read how the specific fund is structured and what it actually holds.",
      },
      {
        title: "Compare the costs over your holding period",
        body: "Bullion comes with a dealer premium, storage, insurance, and a spread when you sell. A fund comes with an annual expense ratio and a bid-ask spread when you trade. Run both over the number of years you expect to hold.",
      },
      {
        title: "Think about getting your money out",
        body: "Selling stored bars means getting a dealer quote, shipping, and waiting for settlement. Selling fund shares means a trade in your brokerage account during market hours. Neither guarantees the price you had in mind.",
      },
      {
        title: "Keep the rest of your money in view",
        body: "Gold can swing hard and pays nothing while you hold it. Decide how much of your portfolio it should be and how much cash you need to keep liquid. Talk to a tax professional about which account it belongs in.",
      },
    ],
    sources: [
      {
        label: "Investor.gov: Exchange-traded funds",
        url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/exchange-traded-funds-etfs",
      },
      {
        label: "CFTC: Gold investment considerations",
        url: "https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CustomerAdvisory_Gold.html",
      },
    ],
  },
  {
    slug: "spot-gold-pressure-tactics",
    title: "Gold sales pitches: the pressure tactics to watch for",
    category: "gold",
    minutes: 4,
    description:
      "How to slow down a gold sales call, cut through the fear talk, and get the numbers on paper.",
    art: "shield",
    sections: [
      {
        title: "Nobody can guarantee the price of gold",
        body: "A seller can describe a product. A seller cannot tell you what gold will be worth next year. When the conversation shifts to inflation, currency collapse, or the next crisis, notice that you've left the product and entered the sales script.",
      },
      {
        title: "Insist on an itemized quote",
        body: "If the call is heavy on urgency and light on numbers, you don't have what you need to decide. Ask for the exact product, the total cost, and the resale terms, and don't move on until you have them.",
      },
      {
        title: "Read the strings on any promotion",
        body: "Free silver, waived fees, and bonus metal usually depend on how much you buy, which products, and how long you hold. Price the whole transaction instead of valuing the giveaway on its own.",
      },
      {
        title: "Keep the next step in your hands",
        body: "Take the agreements home and read them. Compare at least one other dealer. Save notes on what was promised. And never give a salesperson access to your retirement or bank accounts.",
      },
    ],
    sources: [
      {
        label: "CFTC: Precious metals fraud awareness",
        url: "https://www.cftc.gov/LearnAndProtect/FraudAwarenessPrevention/PreciousMetalsFraud/index.htm",
      },
    ],
  },
  {
    slug: "compare-mortgage-estimates",
    title: "How to compare mortgage Loan Estimates",
    category: "mortgages",
    minutes: 6,
    description:
      "The rate is one line on a three-page form. Here's how to read a Loan Estimate and find the true cost of a home loan.",
    art: "home",
    sections: [
      {
        title: "Make the quotes match",
        body: "Give every lender the same property, loan amount, down payment, term, and rate-lock period. Ask each one to state the points and pricing assumptions out loud. If one lender quoted a 30-day lock and another a 60-day lock, you aren't comparing the same loan.",
      },
      {
        title: "Look past the monthly payment",
        body: "Section A of the Loan Estimate shows origination charges and points. Add in total closing costs, mortgage insurance, and the escrow assumptions. The five-year cost figure on page three is the quickest way to compare two offers.",
      },
      {
        title: "Decide how long you'll keep the loan",
        body: "Paying points to lower the rate only pays off if you keep the loan long enough to earn the upfront cost back. Divide the extra closing cost by the monthly savings to find the break-even month, then be honest about whether you'll move or refinance before then.",
      },
    ],
    sources: [
      {
        label: "CFPB: Loan Estimate explainer",
        url: "https://www.consumerfinance.gov/owning-a-home/loan-estimate/",
      },
    ],
  },
  {
    slug: "student-refinance-checklist",
    title: "Should you refinance your student loans? A checklist",
    category: "student-loans",
    minutes: 6,
    description:
      "What to check before you trade federal protections for a lower rate, and how to compare private refinance offers fairly.",
    art: "graduate",
    sections: [
      {
        title: "Sort your loans into federal and private",
        body: "Federal loans come with income-driven repayment, forgiveness programs, and generous forbearance. Refinancing them with a private lender ends all of that permanently. Read the current Federal Student Aid guidance before you decide whether that trade makes sense for you.",
      },
      {
        title: "Compare total repayment, not the payment",
        body: "A longer term lowers the monthly bill and raises the total interest. Use the same balance with every lender and look at both the monthly payment and the amount you'd pay by the end.",
      },
      {
        title: "Read the hardship terms before you need them",
        body: "Ask what happens if your income drops, whether you need a cosigner, and how cosigner release works. Treat fixed and variable rates as two different products with two different risks.",
      },
    ],
    sources: [
      {
        label: "Federal Student Aid: Federal versus private loans",
        url: "https://studentaid.gov/understand-aid/types/loans/federal-vs-private",
      },
    ],
  },
  {
    slug: "choose-credit-card",
    title: "Cash back vs. travel rewards: which card fits you",
    category: "credit-cards",
    minutes: 5,
    description:
      "Pick a credit card based on how you spend and repay, not on the sign-up bonus in the ad.",
    art: "card",
    sections: [
      {
        title: "Start with how you pay the bill",
        body: "If you carry a balance most months, the interest rate is the only number that matters. No rewards program outruns a 20-something percent APR.",
      },
      {
        title: "Use last year's spending",
        body: "Pull your statements, total the spending by category, and run it through each card's earning rules and caps. Subtract the annual fee. Ignore credits for things you don't buy anyway.",
      },
      {
        title: "Be honest about redemption",
        body: "Cash back is simple to use. Travel points can be worth more, but only if you travel enough, find award availability, and book the way the program wants. Confirm the current terms on the issuer's site before you apply.",
      },
    ],
    sources: [
      {
        label: "CFPB: Credit cards",
        url: "https://www.consumerfinance.gov/consumer-tools/credit-cards/",
      },
    ],
  },
  {
    slug: "choose-law-firm",
    title: "What to ask a personal injury lawyer at the first meeting",
    category: "personal-injury",
    minutes: 5,
    description:
      "The questions that reveal who will handle your case, what it will cost, and whether the firm is being straight with you.",
    art: "scales",
    sections: [
      {
        title: "Who is my lawyer?",
        body: "Ask which attorney is responsible for your file, how often you'll hear from them, and whether the firm might refer the case to another office. Look up that attorney's license in your state before you sign.",
      },
      {
        title: "How do fees and costs work?",
        body: "Ask for the fee agreement and have them walk you through how case expenses are calculated. Find out what you'd owe if the case loses, and what happens if you switch lawyers partway through.",
      },
      {
        title: "What does the process look like?",
        body: "Ask about the likely steps, what tends to cause delays, and what documents they need from you. Be wary of anyone who quotes a number for your case at the first meeting. Past verdicts are not a forecast.",
      },
    ],
    sources: [
      {
        label: "American Bar Association: Hiring a lawyer",
        url: "https://www.americanbar.org/groups/public_education/resources/public-information/how-do-i-find-a-lawyer/",
      },
    ],
  },
  {
    slug: "debt-settlement-vs-management",
    title: "Debt settlement vs. a debt management plan",
    category: "debt-relief",
    minutes: 7,
    description:
      "They sound alike and work nothing alike. What each one costs, what it does to your credit, and what to try first.",
    art: "sunrise",
    sections: [
      {
        title: "A debt management plan reorganizes what you owe",
        body: "A nonprofit counseling agency sets up one monthly payment and works with your creditors, often to lower interest or drop fees. You still repay the full balance. Ask about the agency's fees, which debts can be included, and what changes on each account.",
      },
      {
        title: "Settlement tries to pay less than the balance",
        body: "A settlement company asks creditors to accept a reduced lump sum, usually after you've stopped paying for months. Creditors can say no. In the meantime you may face late fees, collection calls, a damaged credit file, and possibly a lawsuit.",
      },
      {
        title: "Try the alternatives first",
        body: "Call your creditors and ask about hardship programs. Book a session with a nonprofit counselor. If the debt is large, talk to a bankruptcy attorney about your options. Compare every path on what it costs after fees and what you'll have left when it's over.",
      },
    ],
    sources: [
      {
        label: "FTC: How to get out of debt",
        url: "https://consumer.ftc.gov/articles/how-get-out-debt",
      },
    ],
  },
  {
    slug: "free-credit-report-disputes",
    title: "How to dispute a credit report error for free",
    category: "credit-repair",
    minutes: 5,
    description:
      "The free dispute process the law gives you, step by step, before you consider paying a credit repair company.",
    art: "shield",
    sections: [
      {
        title: "Find the specific mistake",
        body: "Go through each report and mark anything that's inaccurate, incomplete, or belongs to someone else. Gather the documents that prove it. Keep a copy of the report with the disputed items highlighted.",
      },
      {
        title: "Dispute with the bureau and the lender",
        body: "Send a clear explanation and copies of your evidence to the credit bureau and to the company that reported the item. Follow their dispute instructions exactly and keep a record of what you sent and when they replied.",
      },
      {
        title: "Know what disputes can and can't do",
        body: "Fixing an error is not the same as deleting an accurate late payment. A paid company can't legally promise a score increase or erase correct, current information, no matter what the ad says.",
      },
    ],
    sources: [
      {
        label: "CFPB: Disputing credit report errors",
        url: "https://www.consumerfinance.gov/ask-cfpb/how-do-i-dispute-an-error-on-my-credit-report-en-314/",
      },
    ],
  },
  {
    slug: "bank-account-checklist",
    title: "How to choose a bank: a practical checklist",
    category: "banking",
    minutes: 5,
    description:
      "Fees, cash access, and FDIC coverage come before the sign-up bonus. What to check before you open a new account.",
    art: "bank",
    sections: [
      {
        title: "List what you need the account to do",
        body: "Do you deposit cash? Need a branch? Pay bills from the account? Move money between accounts a lot? Want a separate savings bucket? Answer those first, then compare checking with checking and savings with savings.",
      },
      {
        title: "Read the fee schedule, not the ad",
        body: "Monthly maintenance, minimum balance rules, out-of-network ATM charges, and overdraft terms are where accounts differ. Estimate a year of fees based on how you actually bank.",
      },
      {
        title: "Confirm who holds the money",
        body: "Look the institution up on FDIC BankFind. If a fintech app sweeps your deposits to partner banks, read which banks, how the money is split, and whether balances you already hold there eat into the same coverage limit.",
      },
    ],
    sources: [
      {
        label: "FDIC: BankFind Suite",
        url: "https://banks.data.fdic.gov/bankfind-suite/bankfind",
      },
    ],
  },
  {
    slug: "lemon-law-records",
    title: "Lemon law paperwork: build your repair timeline",
    category: "lemon-law",
    minutes: 4,
    description:
      "The documents a lemon law attorney needs to size up your claim, and how to organize them before the first call.",
    art: "car",
    sections: [
      {
        title: "Pull the original paperwork",
        body: "Find the purchase or lease agreement, the factory warranty, and any extended service contract. Make copies of every repair order, and check that each one shows the date and mileage.",
      },
      {
        title: "Log every visit to the shop",
        body: "For each repair, note what you reported, what the shop wrote on the order, and how many days the car was out of service. Save every email and text with the dealer or the manufacturer.",
      },
      {
        title: "Get advice for your state, not the internet's",
        body: "The number of repair attempts, the mileage limits, and the filing deadlines all vary by state. Have a licensed attorney in your state look at your records before you assume the car does or doesn't qualify.",
      },
    ],
    sources: [
      {
        label: "California Department of Consumer Affairs: Lemon law",
        url: "https://www.dca.ca.gov/acp/",
      },
    ],
  },
  {
    slug: "brokerage-vs-robo-advisor",
    title: "Brokerage or robo-advisor? Pick the service model first",
    category: "investing",
    minutes: 6,
    description:
      "Self-directed investing, automated portfolios, and human advice solve different problems. How to decide which one you're paying for.",
    art: "chart",
    sections: [
      {
        title: "Decide who makes the trades",
        body: "With a brokerage, you pick the investments and place the orders. With a robo-advisor, the company builds a portfolio from your answers to a questionnaire and keeps it balanced. One costs you time; the other costs you a fee.",
      },
      {
        title: "Find out what 'advice' includes",
        body: "Portfolio management, a phone call with a human planner, tax-loss harvesting, and full financial planning are separate services. Read what you actually get at the account size you'd open.",
      },
      {
        title: "Add up every cost",
        body: "Advisory fee, fund expense ratios, trading costs, and account charges. Then check the firm's registration with the SEC or FINRA. Being registered means the firm follows the rules. It doesn't mean the portfolio will go up.",
      },
    ],
    sources: [
      {
        label: "SEC: Investment Adviser Public Disclosure",
        url: "https://adviserinfo.sec.gov/",
      },
      {
        label: "Investor.gov: Fees and expenses",
        url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-1",
      },
    ],
  },
];
export const guideBySlug = (slug: string) =>
  guides.find((g) => g.slug === slug);
