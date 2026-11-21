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
import { scoreAndMatchGoldQuiz, type GoldQuizAnswers } from "@/lib/gold-match";

type GoldMatchRequestBody = ContactInput & {
  answers?: GoldQuizAnswers;
  landingPageUrl?: unknown;
  referrerUrl?: unknown;
  utms?: unknown;
  /** Set by the page's leave-beacon for forms that were never submitted. */
  partial?: unknown;
  lastStep?: unknown;
};

export async function POST(request: NextRequest) {
  let body: GoldMatchRequestBody;
  try {
    body = (await request.json()) as GoldMatchRequestBody;
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
  const { contact } = validated;

  const answers: GoldQuizAnswers =
    body.answers && typeof body.answers === "object" ? body.answers : {};
  const match = scoreAndMatchGoldQuiz(answers);

  const { original_utm_source, ...utms } = readUtms(body.utms, {
    source: "tpp",
    medium: "paid-quiz",
    campaign: "tpp-gold-match-quiz",
  });

  const message = [
    `Match Tier: ${match.tier} (${match.score}/100)`,
    match.qualifierAnswer,
    `Matched Providers: ${match.matches.map((m) => m.provider.name).join(", ")}`,
  ].join("\n");

  const lead: CrmLeadPayload = {
    form_id: "tpp-gold-match-quiz",
    form_name: "Top Provider Picks — Gold IRA Match Quiz",
    form_url: "https://topproviderpicks.com/gold/match",
    landing_page_url:
      cleanString(body.landingPageUrl, 500) ||
      "https://topproviderpicks.com/gold/match",
    referrer_url: cleanString(body.referrerUrl, 500) || null,
    first_name: contact.firstName,
    last_name: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    message,
    consent: true,
    ...utms,
    qualifier_label: "Gold IRA Match Profile",
    qualifier_answer: match.qualifierAnswer,
    ...readRequestMeta(request),
    custom_fields: {
      source_site: "topproviderpicks.com",
      age_range: answers.ageRange || null,
      has_retirement_account: answers.hasRetirementAccount || null,
      account_location: answers.accountLocation || null,
      account_balance: answers.accountBalance || null,
      timeline: answers.timeline || null,
      qualification_tier: match.tier,
      qualification_score: match.score,
      matched_providers: match.matches.map((m) => m.provider.id),
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

  if (isPartial) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({
    ok: true,
    match,
    crmDelivered: true,
    submissionId: delivery.submissionId,
  });
}
