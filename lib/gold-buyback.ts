export type CoinType = "collector" | "graded" | "foreign" | "not-sure";
export type InvestedAmount =
  "under-25k" | "25k-75k" | "75k-150k" | "150k-350k" | "350k+";
export type HeldIn = "ira" | "home" | "both";
export type MainIssue =
  "overpaid" | "low-buyback" | "hidden-fees" | "cant-reach-dealer";

export type BuybackAnswers = {
  coinType?: CoinType;
  investedAmount?: InvestedAmount;
  heldIn?: HeldIn;
  mainIssue?: MainIssue;
};

export type BuybackQuestionId = keyof BuybackAnswers;

export type BuybackIcon =
  | "coin"
  | "slab"
  | "globe"
  | "help"
  | "vault"
  | "home"
  | "split"
  | "tag"
  | "down"
  | "receipt"
  | "phone";

export type BuybackOption = {
  value: string;
  label: string;
  /** Short label for the answer summary on the form step. */
  short: string;
  detail?: string;
  icon?: BuybackIcon;
  accent?: boolean;
};

export type BuybackQuestion = {
  id: BuybackQuestionId;
  eyebrow: string;
  /** Title with the emphasised tail split out for the serif italic. */
  title: string;
  titleEm: string;
  helper: string;
  summaryLabel: string;
  amount?: boolean;
  options: BuybackOption[];
};

export const BUYBACK_QUESTIONS: BuybackQuestion[] = [
  {
    id: "coinType",
    eyebrow: "Your holdings",
    title: "What kind of coins were you",
    titleEm: "sold?",
    helper:
      "Pick the closest match. Most overpriced portfolios fall into one of these.",
    summaryLabel: "Coin type",
    options: [
      {
        value: "collector",
        label: "Collector coins",
        short: "Collector",
        detail: "Sold as rare, limited or special edition",
        icon: "coin",
        accent: true,
      },
      {
        value: "graded",
        label: "Graded, slabbed coins",
        short: "Graded / slabbed",
        detail: "Sealed in plastic with a grade like PF70",
        icon: "slab",
      },
      {
        value: "foreign",
        label: "Foreign or commemorative",
        short: "Foreign / commem.",
        detail: "Lunar, royal, themed or series coins",
        icon: "globe",
      },
      {
        value: "not-sure",
        label: "I’m not sure",
        short: "Not sure",
        detail: "That’s common. A specialist can identify them.",
        icon: "help",
      },
    ],
  },
  {
    id: "investedAmount",
    eyebrow: "Your investment",
    title: "Roughly how much did you",
    titleEm: "invest?",
    helper: "An estimate is fine. It helps us prepare your review.",
    summaryLabel: "Invested",
    amount: true,
    options: [
      { value: "under-25k", label: "Under $25,000", short: "Under $25K" },
      { value: "25k-75k", label: "$25,000 – $75,000", short: "$25K – $75K" },
      { value: "75k-150k", label: "$75,000 – $150,000", short: "$75K – $150K" },
      {
        value: "150k-350k",
        label: "$150,000 – $350,000",
        short: "$150K – $350K",
      },
      { value: "350k+", label: "$350,000 or more", short: "$350K+" },
    ],
  },
  {
    id: "heldIn",
    eyebrow: "Your account",
    title: "Where are your metals held",
    titleEm: "today?",
    helper: "Both IRA and home-stored metals can be reviewed.",
    summaryLabel: "Held in",
    options: [
      {
        value: "ira",
        label: "In a Gold or Silver IRA",
        short: "Gold IRA",
        detail: "Stored at a depository through a custodian",
        icon: "vault",
      },
      {
        value: "home",
        label: "Delivered to my home",
        short: "At home",
        detail: "Coins I hold personally or in a safe",
        icon: "home",
      },
      {
        value: "both",
        label: "Some of both",
        short: "IRA + home",
        detail: "Part in an IRA, part at home",
        icon: "split",
      },
    ],
  },
  {
    id: "mainIssue",
    eyebrow: "Your experience",
    title: "What’s been the",
    titleEm: "biggest issue?",
    helper: "Choose the one that fits best. You’re not the only one.",
    summaryLabel: "Main issue",
    options: [
      {
        value: "overpaid",
        label: "I paid more than they’re worth",
        short: "Overpaid",
        detail: "The markup was never explained",
        icon: "tag",
        accent: true,
      },
      {
        value: "low-buyback",
        label: "The buyback offer was too low",
        short: "Low buyback offer",
        detail: "A fraction of what I originally paid",
        icon: "down",
      },
      {
        value: "hidden-fees",
        label: "Fees I wasn’t told about",
        short: "Hidden fees",
        detail: "Storage, custodian or “admin” charges",
        icon: "receipt",
      },
      {
        value: "cant-reach-dealer",
        label: "I can’t reach my dealer",
        short: "Can’t reach dealer",
        detail: "Calls and emails go unanswered",
        icon: "phone",
      },
    ],
  },
];

/** Every buyback review is currently routed to Citadel Gold. */
export const BUYBACK_MATCHED_PROVIDER_ID = "citadel-gold";

function optionFor(id: BuybackQuestionId, value: string | undefined) {
  return BUYBACK_QUESTIONS.find((q) => q.id === id)?.options.find(
    (o) => o.value === value,
  );
}

export function buybackSummary(answers: BuybackAnswers) {
  return BUYBACK_QUESTIONS.map((q) => ({
    id: q.id,
    label: q.summaryLabel,
    value: optionFor(q.id, answers[q.id])?.short ?? "Not specified",
    full: optionFor(q.id, answers[q.id])?.label ?? "Not specified",
  }));
}

/** True only when every answer is one of the known option values. */
export function isCompleteBuybackAnswers(
  raw: unknown,
): raw is Required<BuybackAnswers> {
  if (!raw || typeof raw !== "object") return false;
  const answers = raw as Record<string, unknown>;
  return BUYBACK_QUESTIONS.every((q) =>
    q.options.some((o) => o.value === answers[q.id]),
  );
}

/** Keeps only answers that match a known option (unfinished forms may be partial). */
export function sanitizeBuybackAnswers(raw: unknown): BuybackAnswers {
  if (!raw || typeof raw !== "object") return {};
  const input = raw as Record<string, unknown>;
  const clean: Record<string, string> = {};
  for (const q of BUYBACK_QUESTIONS) {
    const value = input[q.id];
    if (q.options.some((o) => o.value === value)) clean[q.id] = value as string;
  }
  return clean as BuybackAnswers;
}
