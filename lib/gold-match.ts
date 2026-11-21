import { providers, type Provider } from "./catalog";
import { isPaidPlacement } from "./commercial";

export type AgeRange = "under-50" | "50-59" | "60-69" | "70+";
export type HasRetirementAccount = "yes" | "no";
export type AccountLocation =
  "former-employer-or-ira" | "current-employer" | "not-sure";
export type AccountBalance =
  "under-25k" | "25k-50k" | "50k-100k" | "100k-250k" | "250k+";
export type RolloverTimeline =
  "within-30-days" | "1-3-months" | "3-6-months" | "researching";

export type GoldQuizAnswers = {
  ageRange?: AgeRange;
  hasRetirementAccount?: HasRetirementAccount;
  accountLocation?: AccountLocation;
  accountBalance?: AccountBalance;
  timeline?: RolloverTimeline;
};

export type QuizQuestionId = keyof GoldQuizAnswers;

export type QuizOption<T extends string = string> = {
  value: T;
  label: string;
  detail?: string;
};

export type QuizQuestion = {
  id: QuizQuestionId;
  stepLabel: string;
  prompt: string;
  helper: string;
  options: QuizOption[];
};

export type MatchedProvider = {
  provider: Provider;
  sponsored: boolean;
  matchHeadline: string;
  matchReason: string;
};

export type GoldMatchResult = {
  score: number;
  tier:
    | "Rollover-Ready Match"
    | "Guided Gold Match"
    | "Starter & Direct Bullion Match";
  summaryHeading: string;
  summaryBody: string;
  qualifierAnswer: string;
  chips: { label: string; value: string }[];
  matches: MatchedProvider[];
};

export const AGE_OPTIONS: QuizOption<AgeRange>[] = [
  { value: "under-50", label: "Under 50", detail: "Early retirement planning" },
  { value: "50-59", label: "50 – 59", detail: "Pre-retirement window" },
  { value: "60-69", label: "60 – 69", detail: "Approaching or in retirement" },
  {
    value: "70+",
    label: "70 or older",
    detail: "Distribution & preservation focus",
  },
];

export const RETIREMENT_ACCOUNT_OPTIONS: QuizOption<HasRetirementAccount>[] = [
  {
    value: "yes",
    label: "Yes, I have a retirement account",
    detail: "IRA, 401(k), 403(b), TSP, or similar workplace plan",
  },
  {
    value: "no",
    label: "No — looking to buy with cash or savings",
    detail: "Direct physical gold or silver delivery",
  },
];

export const ACCOUNT_LOCATION_OPTIONS: QuizOption<AccountLocation>[] = [
  {
    value: "former-employer-or-ira",
    label: "Former employer or existing IRA",
    detail: "Typically the cleanest, fastest direct rollover path",
  },
  {
    value: "current-employer",
    label: "Current employer workplace plan",
    detail: "Rollover rules depend on your plan's in-service options",
  },
  {
    value: "not-sure",
    label: "Both or not sure yet",
    detail: "A specialist can help check eligibility before any paperwork",
  },
];

export const ACCOUNT_BALANCE_OPTIONS: QuizOption<AccountBalance>[] = [
  { value: "under-25k", label: "Under $25,000" },
  { value: "25k-50k", label: "$25,000 – $50,000" },
  { value: "50k-100k", label: "$50,000 – $100,000" },
  { value: "100k-250k", label: "$100,000 – $250,000" },
  { value: "250k+", label: "$250,000+" },
];

export const TIMELINE_OPTIONS: QuizOption<RolloverTimeline>[] = [
  {
    value: "within-30-days",
    label: "Within 30 days",
    detail: "Ready to compare written quotes and minimums soon",
  },
  {
    value: "1-3-months",
    label: "1 – 3 months",
    detail: "Planning a move this quarter",
  },
  {
    value: "3-6-months",
    label: "3 – 6 months",
    detail: "Narrowing down options ahead of a decision",
  },
  {
    value: "researching",
    label: "Just researching / Not sure",
    detail: "Exploring fees, custody, and how rollovers work",
  },
];

export function getVisibleQuestions(answers: GoldQuizAnswers): QuizQuestion[] {
  const isCashPath = answers.hasRetirementAccount === "no";

  const questions: QuizQuestion[] = [
    {
      id: "ageRange",
      stepLabel: "Age bracket",
      prompt: "What is your current age?",
      helper:
        "Age helps determine retirement account rollover options, custodian rules, and RMD timelines.",
      options: AGE_OPTIONS,
    },
    {
      id: "hasRetirementAccount",
      stepLabel: "Account type",
      prompt:
        "Do you currently have retirement savings in an IRA, 401(k), 403(b), TSP, or similar workplace plan?",
      helper:
        "Most gold IRA rollovers move funds from an existing retirement account without triggering taxes or penalties.",
      options: RETIREMENT_ACCOUNT_OPTIONS,
    },
  ];

  if (!isCashPath) {
    questions.push({
      id: "accountLocation",
      stepLabel: "Account custody",
      prompt:
        "Is that money with a company you currently work for, or a former employer / existing IRA?",
      helper:
        "Existing IRAs and former-employer plans usually transfer cleanly; current-employer plans may have plan-specific rules.",
      options: ACCOUNT_LOCATION_OPTIONS,
    });
  }

  questions.push(
    {
      id: "accountBalance",
      stepLabel: isCashPath ? "Purchase amount" : "Account balance",
      prompt: isCashPath
        ? "Roughly how much are you considering putting toward physical gold or silver?"
        : "Roughly how much is in that specific retirement account?",
      helper:
        "Many gold IRA companies set minimums around $25,000 to $50,000, while direct bullion dealers handle smaller orders.",
      options: ACCOUNT_BALANCE_OPTIONS,
    },
    {
      id: "timeline",
      stepLabel: "Timeline",
      prompt: isCashPath
        ? "When are you considering making a purchase?"
        : "When are you considering moving or rolling over these funds?",
      helper:
        "Knowing your timeframe helps match you with dealers suited for immediate quotes or early research.",
      options: TIMELINE_OPTIONS,
    },
  );

  return questions;
}

function findLabel<T extends string>(
  options: QuizOption<T>[],
  value: T | undefined,
  fallback = "Not specified",
): string {
  return options.find((o) => o.value === value)?.label ?? fallback;
}

function getGoldProvider(id: string): Provider {
  const found = providers.find((p) => p.category === "gold" && p.id === id);
  if (!found) {
    throw new Error(`Missing gold provider in catalog: ${id}`);
  }
  return found;
}

export function scoreAndMatchGoldQuiz(
  answers: GoldQuizAnswers,
): GoldMatchResult {
  let score = 20;
  const hasAccount = answers.hasRetirementAccount === "yes";
  if (hasAccount) score += 25;

  if (answers.ageRange === "60-69" || answers.ageRange === "70+") score += 20;
  else if (answers.ageRange === "50-59") score += 15;
  else if (answers.ageRange === "under-50") score += 5;

  if (answers.accountBalance === "250k+") score += 25;
  else if (answers.accountBalance === "100k-250k") score += 22;
  else if (answers.accountBalance === "50k-100k") score += 18;
  else if (answers.accountBalance === "25k-50k") score += 10;
  else if (answers.accountBalance === "under-25k") score += 3;

  if (answers.timeline === "within-30-days") score += 15;
  else if (answers.timeline === "1-3-months") score += 10;
  else if (answers.timeline === "3-6-months") score += 5;

  if (answers.accountLocation === "former-employer-or-ira") score += 5;
  else if (answers.accountLocation === "current-employer") score += 2;

  score = Math.max(0, Math.min(100, score));

  const isHigherBalance =
    answers.accountBalance === "50k-100k" ||
    answers.accountBalance === "100k-250k" ||
    answers.accountBalance === "250k+";
  const isTwentyFiveKPlus =
    answers.accountBalance === "25k-50k" || isHigherBalance;

  const tier: GoldMatchResult["tier"] =
    hasAccount && isHigherBalance && score >= 70
      ? "Rollover-Ready Match"
      : score >= 45
        ? "Guided Gold Match"
        : "Starter & Direct Bullion Match";

  const ageLabel = findLabel(AGE_OPTIONS, answers.ageRange);
  const accountLabel = hasAccount
    ? "Existing retirement account"
    : "Cash / direct purchase";
  const locationLabel = hasAccount
    ? findLabel(ACCOUNT_LOCATION_OPTIONS, answers.accountLocation)
    : "Direct delivery / non-IRA";
  const balanceLabel = findLabel(
    ACCOUNT_BALANCE_OPTIONS,
    answers.accountBalance,
  );
  const timelineLabel = findLabel(TIMELINE_OPTIONS, answers.timeline);

  // All quiz paths currently recommend Citadel Gold.
  const citadel = getGoldProvider("citadel-gold");

  const matchHeadline = hasAccount
    ? isTwentyFiveKPlus
      ? "Guided four-step Gold IRA rollover"
      : "Gold IRA or direct-purchase guidance"
    : "Specialist guidance for physical gold & silver";

  const matchReason = hasAccount
    ? isTwentyFiveKPlus
      ? `Matches your ${balanceLabel} retirement balance and ${timelineLabel.toLowerCase()} timeline. Citadel Gold states a $25,000 IRA minimum and walks you through consultation, funding, metal selection, and depository shipping.`
      : `Citadel Gold states a $25,000 IRA minimum, so with a balance under $25,000 a specialist can tell you whether a Gold IRA makes sense yet or whether buying physical metal directly fits better.`
    : "Citadel Gold sells physical gold and silver directly, and can walk you through IRA options too if your plans change.";

  const matches: MatchedProvider[] = [
    {
      provider: citadel,
      sponsored: isPaidPlacement(citadel.id),
      matchHeadline,
      matchReason,
    },
  ];

  const summaryHeading = hasAccount
    ? isTwentyFiveKPlus
      ? "You qualify for a guided Gold IRA rollover"
      : "Your Gold IRA match is ready"
    : "Your physical gold & silver match is ready";

  const summaryBody = hasAccount
    ? isTwentyFiveKPlus
      ? `Based on your ${balanceLabel} ${locationLabel.toLowerCase()} account, we matched you with Citadel Gold. Before moving funds, ask for your itemized metal quote, custodian fees, and buyback terms in writing.`
      : `With an account under $25,000, ask about the IRA minimum and annual custodian fees first. Smaller IRAs can lose more to flat yearly fees than a direct purchase would.`
    : `Since you're buying without a retirement account, ask for the all-in delivered price (payment method, shipping, and buyback spread) for the exact coin or bar you want.`;

  const chips = [
    { label: "Age", value: ageLabel },
    { label: "Path", value: accountLabel },
    ...(hasAccount ? [{ label: "Account", value: locationLabel }] : []),
    { label: "Amount", value: balanceLabel },
    { label: "Timeline", value: timelineLabel },
  ];

  const qualifierAnswer = chips
    .map((c) => `${c.label}: ${c.value}`)
    .join(" | ");

  return {
    score,
    tier,
    summaryHeading,
    summaryBody,
    qualifierAnswer,
    chips,
    matches,
  };
}
