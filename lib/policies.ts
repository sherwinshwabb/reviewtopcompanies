import { siteName } from "./site";
export const policies: Record<
  string,
  {
    title: string;
    eyebrow: string;
    intro: string;
    sections: { title: string; body: string }[];
  }
> = {
  about: {
    title: "We read the fine print so you don't have to.",
    eyebrow: "ABOUT US",
    intro: `${siteName} puts company profiles, how-to guides, and a comparison tool in one place for the money and legal decisions where picking wrong gets expensive.`,
    sections: [
      {
        title: "Organized around three questions",
        body: "What does it cost? Who is it for? What's the catch? Every page on this site is built to answer those three questions for a company in one of our ten categories, which cover financial services and two kinds of legal help.",
      },
      {
        title: "What we are and what we aren't",
        body: `${siteName} is a commercial comparison site. We are not a bank, a law firm, an investment adviser, a regulator, or a ratings agency. Our reviews cover a chosen set of companies in each category, not every company that exists.`,
      },
      {
        title: "No account, no forms, no gate",
        body: "You can read every profile, use the calculator, and compare companies without signing up or handing over an email address. When you click through to a company, you're on their site and their terms.",
      },
    ],
  },
  "editorial-policy": {
    title: "How we decide what goes on the page.",
    eyebrow: "EDITORIAL POLICY",
    intro:
      "Our rules for what gets published: back up the facts, compare like with like, and say out loud what a company can't do.",
    sections: [
      {
        title: "Every claim needs a source",
        body: "If we state a fact, we should be able to point to where it came from. What a company says about itself is labeled as the company's claim, not our finding. We don't publish rates, customer counts, awards, or performance promises we can't check.",
      },
      {
        title: "Compare the same thing",
        body: "A fair comparison uses the same product, the same borrower, the same service type, or the same state. We include the limitations that would change your mind, and we never treat a national brand as evidence about the individual lawyer or loan officer you'd work with.",
      },
      {
        title: "Dates mean something",
        body: "When a page says it was updated, a person actually re-checked the content. Changing a date without re-checking the fees, products, or rankings would be lying, so we don't do it.",
      },
      {
        title: "Corrections are open to everyone",
        body: "Readers and companies use the same correction process. We fix errors based on evidence, note material changes, and carry them through to every page that repeats the same fact.",
      },
    ],
  },
  ownership: {
    title: "Who's behind the site.",
    eyebrow: "OWNERSHIP",
    intro: `${siteName} is being built as a commercial consumer comparison publication owned by Shaun and Devin Fox.`,
    sections: [
      {
        title: "The operating company",
        body: "The legal entity, business address, and contact details for the publisher still need to be filled in before this site goes live. They were not available when this preview was built.",
      },
      {
        title: "Where our responsibility ends",
        body: "We organize information and comparisons. The companies we profile are responsible for their own products, pricing, contracts, and customers.",
      },
    ],
  },
  privacy: {
    title: "What we store, in plain English.",
    eyebrow: "PRIVACY",
    intro:
      "This site runs without accounts and keeps data collection to a minimum. Here's exactly what's saved and where.",
    sections: [
      {
        title: "What lives in your browser",
        body: "Your comparison shortlist and your analytics preference are saved in your browser's local storage so they're still there when you come back. That isn't an account and it never leaves your device. Clear the shortlist on the compare page or wipe site data in your browser settings.",
      },
      {
        title: "Contact and correction forms",
        body: "The contact and correction tools build a message in your browser for you to copy or download. Nothing you type is sent to our servers, and we don't keep your name, email address, or message.",
      },
      {
        title: "Links to companies",
        body: "Clicking a company link takes you to that company's website, where its own privacy policy applies. We don't pass anything you typed here to them.",
      },
      {
        title: "Analytics and tracking",
        body: "No ad pixels and no third-party analytics are installed. Your choice on the privacy choices page is stored locally, and we honor the Global Privacy Control signal from your browser. Our hosting provider may keep standard server logs.",
      },
      {
        title: "Still to be completed",
        body: "Before launch, the publisher needs to add its legal name, a contact channel, a data retention schedule, a list of vendors, and the privacy rights process that applies to the final deployment.",
      },
    ],
  },
  terms: {
    title: "The ground rules for using this site.",
    eyebrow: "TERMS OF USE",
    intro:
      "This site offers general information and comparison tools to help you research companies. Here's what that does and doesn't mean.",
    sections: [
      {
        title: "Information, not advice",
        body: "Everything here is general education, not personal financial, tax, or legal advice. A company profile doesn't mean you'll qualify, get approved, or get a particular outcome. Read the company's current agreement and talk to a qualified professional when the decision calls for one.",
      },
      {
        title: "The companies do the business",
        body: `Products and services come from the companies listed, on their terms. ${siteName} doesn't sell investments, make loans, issue cards, hold deposits, fix credit, or represent anyone in a legal matter.`,
      },
      {
        title: "About the calculator",
        body: "The repayment calculator uses the numbers you enter, assumes a fixed rate and equal monthly payments, and leaves out fees. It's an illustration, not an offer, and a real lender's schedule may differ.",
      },
      {
        title: "Prelaunch status",
        body: "This is a prelaunch build. The final terms, the publisher's legal details, and the governing law provisions still have to be completed by the operating business.",
      },
    ],
  },
  accessibility: {
    title: "Built to work for everyone.",
    eyebrow: "ACCESSIBILITY",
    intro:
      "The site is designed to be usable at any screen size, with a keyboard, and with a screen reader.",
    sections: [
      {
        title: "Getting around",
        body: "A skip link jumps straight to the main content. Menus, filters, comparison toggles, and forms all work from the keyboard, and the focused control is always visible.",
      },
      {
        title: "Reading the comparisons",
        body: "Company cards keep their text readable on phones. Side-by-side tables scroll sideways instead of shrinking. Column headers and row labels describe what each cell is.",
      },
      {
        title: "Tell us about a barrier",
        body: "Use the contact tool to describe the page, your device, your browser, and what got in your way. Please leave out any sensitive personal details.",
      },
    ],
  },
  "privacy-choices": {
    title: "Your settings for this browser.",
    eyebrow: "PRIVACY CHOICES",
    intro:
      "Turn optional settings on or off here. Comparisons and reviews work the same either way.",
    sections: [],
  },
  contact: {
    title: "Got a question? Ask it here.",
    eyebrow: "CONTACT",
    intro:
      "Questions about the site, a company profile, or one of our comparisons can be drafted below.",
    sections: [],
  },
  corrections: {
    title: "Spot a mistake? Tell us.",
    eyebrow: "CORRECTIONS",
    intro:
      "A good correction names the page, explains what's wrong, and points to a source. Readers and companies use the same form.",
    sections: [
      {
        title: "What to send",
        body: "Tell us the company and the page, quote the sentence you think is wrong, and link to a current official source or describe the document that backs you up. Don't send account numbers, medical details, or anything else sensitive.",
      },
    ],
  },
  "advertising-disclosure": {
    title: "Advertising disclosure.",
    eyebrow: "ADVERTISING DISCLOSURE",
    intro:
      'A listing marked "Sponsored" is a paid position. Citadel Gold pays for the #1 spot in our gold comparison. Paid position is not a score and does not change what we write about any company.',
    sections: [],
  },
  advertise: {
    title: "Work with us.",
    eyebrow: "WORK WITH US",
    intro:
      "We're building a comparison site around accurate information and readers who know what they need. Here's how companies fit in.",
    sections: [
      {
        title: "Get the facts right first",
        body: "Companies can send us current details about their services, pricing, availability, and contact information. A complete, accurate record helps readers figure out whether you're the right fit.",
      },
      {
        title: "Come with a specific proposal",
        body: "Tell us the product, who's eligible, where the link should land, and what commercial arrangement you have in mind. We review category rules and the data flow before anything goes live.",
      },
      {
        title: "Measure what matters",
        body: "We report on provider visits, accepted inquiries, qualified leads, and attributable revenue as separate numbers. A click by itself doesn't tell either of us that a reader found the right company.",
      },
    ],
  },
};
