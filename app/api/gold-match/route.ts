import { NextRequest, NextResponse } from "next/server";
import {
  scoreAndMatchGoldQuiz,
  type GoldQuizAnswers,
} from "@/lib/gold-match";

type GoldMatchRequestBody = {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  phone?: unknown;
  consent?: unknown;
  answers?: GoldQuizAnswers;
  landingPageUrl?: unknown;
  referrerUrl?: unknown;
  utms?: {
    utm_source?: unknown;
    utm_medium?: unknown;
    utm_campaign?: unknown;
    utm_content?: unknown;
    utm_term?: unknown;
  };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanString(value: unknown, maxLength = 200): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

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

  const firstName = cleanString(body.firstName, 100);
  const lastName = cleanString(body.lastName, 100);
  const email = cleanString(body.email, 255).toLowerCase();
  const rawPhone = cleanString(body.phone, 40);
  const phoneDigits = rawPhone.replace(/\D/g, "");
  const consent = body.consent === true;
  const answers: GoldQuizAnswers =
    body.answers && typeof body.answers === "object" ? body.answers : {};

  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "Please enter your first and last name." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (phoneDigits.length < 10) {
    return NextResponse.json(
      { error: "Please enter a valid 10-digit phone number." },
      { status: 400 },
    );
  }
  if (!consent) {
    return NextResponse.json(
      { error: "Please confirm your contact consent before viewing matches." },
      { status: 400 },
    );
  }

  const match = scoreAndMatchGoldQuiz(answers);
  const matchedProviderIds = match.matches.map((m) => m.provider.id);

  const utms = body.utms && typeof body.utms === "object" ? body.utms : {};
  const utmSource = cleanString(utms.utm_source, 100) || "tpp";
  const utmMedium = cleanString(utms.utm_medium, 100) || "paid-quiz";
  const utmCampaign =
    cleanString(utms.utm_campaign, 100) || "tpp-gold-match-quiz";
  const utmContent = cleanString(utms.utm_content, 100) || null;
  const utmTerm = cleanString(utms.utm_term, 100) || null;

  const landingPageUrl =
    cleanString(body.landingPageUrl, 500) ||
    "https://topproviderpicks.com/gold/match";
  const referrerUrl = cleanString(body.referrerUrl, 500) || null;

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ipAddress =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;
  const userAgent = request.headers.get("user-agent") || null;

  const crmBaseUrl = (
    process.env.CRM_API_URL || "https://www.byetalk.com"
  ).replace(/\/$/, "");
  const crmApiKey =
    process.env.CRM_FORMS_API_KEY ||
    process.env.FORMS_API_KEY ||
    "citadel-forms-key-2024";

  let crmDelivered = false;
  let submissionId: string | null = null;

  const message = [
    `Match Tier: ${match.tier} (${match.score}/100)`,
    match.qualifierAnswer,
    `Matched Providers: ${match.matches.map((m) => m.provider.name).join(", ")}`,
  ].join("\n");

  try {
    const crmResponse = await fetch(`${crmBaseUrl}/api/forms/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": crmApiKey,
      },
      body: JSON.stringify({
        form_id: "tpp-gold-match-quiz",
        form_name: "Top Provider Picks — Gold IRA Match Quiz",
        form_url: "https://topproviderpicks.com/gold/match",
        landing_page_url: landingPageUrl,
        referrer_url: referrerUrl,
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phoneDigits.slice(-10),
        message,
        consent: true,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
        utm_term: utmTerm,
        qualifier_label: "Gold IRA Match Profile",
        qualifier_answer: match.qualifierAnswer,
        ip_address: ipAddress,
        user_agent: userAgent,
        custom_fields: {
          source_site: "topproviderpicks.com",
          age_range: answers.ageRange || null,
          has_retirement_account: answers.hasRetirementAccount || null,
          account_location: answers.accountLocation || null,
          account_balance: answers.accountBalance || null,
          timeline: answers.timeline || null,
          qualification_tier: match.tier,
          qualification_score: match.score,
          matched_providers: matchedProviderIds,
          original_utm_source: cleanString(utms.utm_source, 100) || null,
        },
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (crmResponse.ok) {
      const crmData = (await crmResponse.json()) as {
        success?: boolean;
        submission_id?: string;
      };
      crmDelivered = Boolean(crmData.success);
      submissionId = crmData.submission_id ?? null;
    } else {
      const errorText = await crmResponse.text().catch(() => "");
      console.error(
        "[Gold Match API] CRM rejected submission:",
        crmResponse.status,
        errorText.slice(0, 300),
      );
    }
  } catch (error) {
    console.error("[Gold Match API] Failed to forward lead to CRM:", error);
  }

  return NextResponse.json({
    ok: true,
    match,
    crmDelivered,
    submissionId,
  });
}
