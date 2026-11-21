import { after, type NextRequest } from "next/server";

/**
 * Shared lead delivery to the ByeTalk CRM (`/api/forms/submit`).
 *
 * Every quiz route sends leads through `submitLeadToCrm`, which retries
 * transient failures. When a lead still isn't delivered it logs the full lead
 * (recoverable from server logs) and posts an alert to LEAD_ALERT_WEBHOOK_URL,
 * so a broken key or CRM outage can't quietly drop leads.
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanString(value: unknown, maxLength = 200): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export type ContactInput = {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  phone?: unknown;
  consent?: unknown;
};

export type CleanContact = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

/** Returns cleaned contact fields, or a user-facing error message. */
export function validateContact(
  body: ContactInput,
): { ok: true; contact: CleanContact } | { ok: false; error: string } {
  const firstName = cleanString(body.firstName, 100);
  const lastName = cleanString(body.lastName, 100);
  const email = cleanString(body.email, 255).toLowerCase();
  const phoneDigits = cleanString(body.phone, 40).replace(/\D/g, "");

  if (!firstName || !lastName) {
    return { ok: false, error: "Please enter your first and last name." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (phoneDigits.length < 10) {
    return { ok: false, error: "Please enter a valid 10-digit phone number." };
  }
  if (body.consent !== true) {
    return {
      ok: false,
      error: "Please confirm your contact consent to continue.",
    };
  }
  return {
    ok: true,
    contact: { firstName, lastName, email, phone: phoneDigits.slice(-10) },
  };
}

/**
 * Lenient check for unfinished (abandoned) forms: keep anything with a usable
 * email or phone number. Name and consent may be missing.
 */
export function validatePartialContact(
  body: ContactInput,
): { ok: true; contact: CleanContact } | { ok: false; error: string } {
  const email = cleanString(body.email, 255).toLowerCase();
  const phoneDigits = cleanString(body.phone, 40).replace(/\D/g, "");
  const hasEmail = EMAIL_RE.test(email);
  const hasPhone = phoneDigits.length >= 10;
  if (!hasEmail && !hasPhone) {
    return { ok: false, error: "Not enough contact details to save." };
  }
  return {
    ok: true,
    contact: {
      firstName: cleanString(body.firstName, 100) || "Unknown",
      lastName: cleanString(body.lastName, 100) || "Unknown",
      email: hasEmail ? email : "",
      phone: hasPhone ? phoneDigits.slice(-10) : "",
    },
  };
}

/**
 * Labels a lead as UNFINISHED so it's distinguishable in ByeTalk: separate
 * form_id/form_name, a flagged first message line, consent=false (the visitor
 * never clicked submit), and custom_fields.lead_status = "unfinished".
 */
export function markUnfinished(
  payload: CrmLeadPayload,
  lastStep: string,
): CrmLeadPayload {
  return {
    ...payload,
    form_id: `${payload.form_id}-unfinished`,
    form_name: `${payload.form_name} (UNFINISHED)`,
    message: [
      `UNFINISHED: visitor left before submitting (last step: ${lastStep}). They did NOT submit the consent form.`,
      payload.message,
    ].join("\n"),
    consent: false,
    custom_fields: {
      ...payload.custom_fields,
      lead_status: "unfinished",
      last_step: lastStep,
    },
  };
}

export type UtmInput = {
  utm_source?: unknown;
  utm_medium?: unknown;
  utm_campaign?: unknown;
  utm_content?: unknown;
  utm_term?: unknown;
};

export function readUtms(
  raw: unknown,
  defaults: { source: string; medium: string; campaign: string },
) {
  const utms = (raw && typeof raw === "object" ? raw : {}) as UtmInput;
  return {
    utm_source: cleanString(utms.utm_source, 100) || defaults.source,
    utm_medium: cleanString(utms.utm_medium, 100) || defaults.medium,
    utm_campaign: cleanString(utms.utm_campaign, 100) || defaults.campaign,
    utm_content: cleanString(utms.utm_content, 100) || null,
    utm_term: cleanString(utms.utm_term, 100) || null,
    original_utm_source: cleanString(utms.utm_source, 100) || null,
  };
}

export function readRequestMeta(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return {
    ip_address:
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null,
    user_agent: request.headers.get("user-agent") || null,
  };
}

export type CrmLeadPayload = {
  form_id: string;
  form_name: string;
  form_url: string;
  landing_page_url: string;
  referrer_url: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string | null;
  utm_term: string | null;
  qualifier_label: string;
  qualifier_answer: string;
  ip_address: string | null;
  user_agent: string | null;
  custom_fields: Record<string, unknown>;
};

type CrmDeliveryFailure = { ok: false; reason: string; attempts: number };
type CrmDeliveryResult =
  | { ok: true; submissionId: string | null; attempts: number }
  | CrmDeliveryFailure;

const CRM_MAX_ATTEMPTS = 3;
const CRM_ATTEMPT_TIMEOUT_MS = 6000;

function crmConfig() {
  const baseUrl = (
    process.env.CRM_API_URL || "https://www.byetalk.com"
  ).replace(/\/$/, "");
  const apiKey =
    process.env.CRM_FORMS_API_KEY ||
    process.env.FORMS_API_KEY ||
    "citadel-forms-key-2024";
  return { url: `${baseUrl}/api/forms/submit`, apiKey };
}

function isRetryableStatus(status: number) {
  return status === 408 || status === 429 || status >= 500;
}

async function deliverToCrm(
  payload: CrmLeadPayload,
): Promise<CrmDeliveryResult> {
  const { url, apiKey } = crmConfig();
  let reason = "unknown error";

  for (let attempt = 1; attempt <= CRM_MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(CRM_ATTEMPT_TIMEOUT_MS),
      });

      if (response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          success?: boolean;
          submission_id?: string;
        };
        if (data.success) {
          return {
            ok: true,
            submissionId: data.submission_id ?? null,
            attempts: attempt,
          };
        }
        // 2xx without success: the CRM processed and refused it; don't retry.
        return {
          ok: false,
          reason: `CRM responded ${response.status} without success: ${JSON.stringify(data).slice(0, 300)}`,
          attempts: attempt,
        };
      }

      const errorText = await response.text().catch(() => "");
      reason = `CRM responded ${response.status}: ${errorText.slice(0, 300)}`;
      if (!isRetryableStatus(response.status)) {
        // 401/400 etc. won't fix themselves (e.g. wrong API key).
        return { ok: false, reason, attempts: attempt };
      }
    } catch (error) {
      reason = `Request failed: ${error instanceof Error ? `${error.name}: ${error.message}` : String(error)}`;
    }

    console.warn(
      `[CRM] ${payload.form_id} attempt ${attempt}/${CRM_MAX_ATTEMPTS} failed: ${reason}`,
    );
    if (attempt < CRM_MAX_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
    }
  }

  return { ok: false, reason, attempts: CRM_MAX_ATTEMPTS };
}

/**
 * Posts a Slack-compatible `{ text }` message to LEAD_ALERT_WEBHOOK_URL so a
 * failed lead gets noticed and can be entered into the CRM by hand.
 */
async function sendLeadFailureAlert(
  delivery: CrmDeliveryFailure,
  lead: CrmLeadPayload,
) {
  const webhookUrl = process.env.LEAD_ALERT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error(
      "[CRM] LEAD_ALERT_WEBHOOK_URL is not set; failed lead was only logged.",
    );
    return;
  }

  const text = [
    `:rotating_light: ${lead.form_name} lead was NOT delivered to ByeTalk`,
    `Reason: ${delivery.reason} (after ${delivery.attempts} attempt(s))`,
    `Name: ${lead.first_name} ${lead.last_name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    `UTM: ${lead.utm_source} / ${lead.utm_campaign}`,
    lead.message,
  ].join("\n");

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      console.error(
        "[CRM] Lead failure alert webhook responded",
        response.status,
      );
    }
  } catch (error) {
    console.error("[CRM] Failed to send lead failure alert:", error);
  }
}

/**
 * Delivers a lead with retries. On final failure, logs the full lead and
 * schedules an alert after the response is sent.
 */
export async function submitLeadToCrm(
  payload: CrmLeadPayload,
): Promise<{ ok: true; submissionId: string | null } | { ok: false }> {
  const delivery = await deliverToCrm(payload);
  if (delivery.ok) {
    return { ok: true, submissionId: delivery.submissionId };
  }

  console.error(
    "[CRM] LEAD NOT DELIVERED:",
    JSON.stringify({
      reason: delivery.reason,
      attempts: delivery.attempts,
      lead: payload,
    }),
  );
  after(() => sendLeadFailureAlert(delivery, payload));
  return { ok: false };
}

export const LEAD_NOT_SAVED_ERROR =
  "We couldn't save your details just now. Please try again in a moment.";
