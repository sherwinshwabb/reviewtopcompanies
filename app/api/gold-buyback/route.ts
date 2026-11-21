import { NextRequest, NextResponse } from "next/server";
import {
  cleanString,
  LEAD_NOT_SAVED_ERROR,
  markUnfinished,
  readRequestMeta,
  readUtms,
  submitLeadToCrm,
  validateContact,
  validatePartialContact,
  type ContactInput,
  type CrmLeadPayload,
} from "@/lib/crm";
import {
  BUYBACK_MATCHED_PROVIDER_ID,
  buybackSummary,
  isCompleteBuybackAnswers,
  sanitizeBuybackAnswers,
} from "@/lib/gold-buyback";

type GoldBuybackRequestBody = ContactInput & {
  answers?: unknown;
  landingPageUrl?: unknown;
  referrerUrl?: unknown;
  utms?: unknown;
  /** Set by the page's leave-beacon for forms that were never submitted. */
  partial?: unknown;
  lastStep?: unknown;
};

const FORM_URL = "https://topproviderpicks.com/gold/buyback";

export async function POST(request: NextRequest) {
  let body: GoldBuybackRequestBody;
  try {
    body = (await request.json()) as GoldBuybackRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 },
    );
  }

  const isPartial = body.partial === true;
  const validated = isPartial
    ? validatePartialContact(body)
    : validateContact(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }
  if (!isPartial && !isCompleteBuybackAnswers(body.answers)) {
    return NextResponse.json(
      { error: "Please answer all four questions before submitting." },
      { status: 400 },
    );
  }
  const { contact } = validated;
  const answers = sanitizeBuybackAnswers(body.answers);
  const summary = buybackSummary(answers);
  const qualifierAnswer = summary
    .map((s) => `${s.label}: ${s.full}`)
    .join(" | ");

  const { original_utm_source, ...utms } = readUtms(body.utms, {
    source: "tpp",
    medium: "paid-quiz",
    campaign: "tpp-gold-buyback-review",
  });

  const lead: CrmLeadPayload = {
    form_id: "tpp-gold-buyback-review",
    form_name: "Top Provider Picks — Gold Buyback Review Quiz",
    form_url: FORM_URL,
    landing_page_url: cleanString(body.landingPageUrl, 500) || FORM_URL,
    referrer_url: cleanString(body.referrerUrl, 500) || null,
    first_name: contact.firstName,
    last_name: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    message: [
      "Free buyback review request",
      qualifierAnswer,
      "Matched Provider: Citadel Gold",
    ].join("\n"),
    consent: true,
    ...utms,
    qualifier_label: "Gold Buyback Review Profile",
    qualifier_answer: qualifierAnswer,
    ...readRequestMeta(request),
    custom_fields: {
      source_site: "topproviderpicks.com",
      coin_type: answers.coinType ?? null,
      invested_amount: answers.investedAmount ?? null,
      held_in: answers.heldIn ?? null,
      main_issue: answers.mainIssue ?? null,
      matched_providers: [BUYBACK_MATCHED_PROVIDER_ID],
      original_utm_source,
    },
  };
  const delivery = await submitLeadToCrm(
    isPartial
      ? markUnfinished(lead, cleanString(body.lastStep, 60) || "contact form")
      : lead,
  );

  if (!delivery.ok) {
    return NextResponse.json({ error: LEAD_NOT_SAVED_ERROR }, { status: 502 });
  }

  return NextResponse.json({ ok: true, submissionId: delivery.submissionId });
}
