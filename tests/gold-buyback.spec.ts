import { createServer, type Server } from "node:http";
import { test, expect } from "@playwright/test";
import { isCompleteBuybackAnswers } from "../lib/gold-buyback";

const VALID_ANSWERS = {
  coinType: "collector",
  investedAmount: "75k-150k",
  heldIn: "ira",
  mainIssue: "overpaid",
};

const CONTACT = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "5558675309",
  consent: true,
};

/** Mock ByeTalk on the port playwright.config.ts points CRM_API_URL at. */
async function withMockCrm(
  status: number,
  body: unknown,
  run: (received: Array<Record<string, unknown>>) => Promise<void>,
) {
  const received: Array<Record<string, unknown>> = [];
  const server: Server = createServer((req, res) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      received.push(JSON.parse(raw || "{}"));
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(body));
    });
  });
  await new Promise<void>((r) => server.listen(3199, "127.0.0.1", r));
  try {
    await run(received);
  } finally {
    await new Promise<void>((r) => server.close(() => r()));
  }
}

test("buyback answers must all be known option values", () => {
  expect(isCompleteBuybackAnswers(VALID_ANSWERS)).toBe(true);
  expect(isCompleteBuybackAnswers({ ...VALID_ANSWERS, heldIn: "moon" })).toBe(
    false,
  );
  expect(isCompleteBuybackAnswers({ coinType: "collector" })).toBe(false);
});

test("POST /api/gold-buyback forwards a Citadel Gold lead to the CRM", async ({
  request,
}) => {
  await withMockCrm(
    200,
    { success: true, submission_id: "sub-1" },
    async (received) => {
      const res = await request.post("/api/gold-buyback", {
        data: {
          ...CONTACT,
          answers: VALID_ANSWERS,
          utms: { utm_source: "facebook", utm_campaign: "buyback-test" },
        },
      });
      expect(res.status()).toBe(200);
      expect(await res.json()).toMatchObject({
        ok: true,
        submissionId: "sub-1",
      });

      expect(received).toHaveLength(1);
      expect(received[0]).toMatchObject({
        form_id: "tpp-gold-buyback-review",
        first_name: "Jane",
        email: "jane@example.com",
        phone: "5558675309",
        utm_source: "facebook",
        utm_campaign: "buyback-test",
        custom_fields: {
          coin_type: "collector",
          invested_amount: "75k-150k",
          held_in: "ira",
          main_issue: "overpaid",
          matched_providers: ["citadel-gold"],
        },
      });
    },
  );
});

test("POST /api/gold-buyback rejects incomplete input and surfaces CRM failure", async ({
  request,
}) => {
  const missingAnswers = await request.post("/api/gold-buyback", {
    data: { ...CONTACT, answers: { coinType: "collector" } },
  });
  expect(missingAnswers.status()).toBe(400);

  await withMockCrm(401, { error: "Unauthorized" }, async (received) => {
    const res = await request.post("/api/gold-buyback", {
      data: { ...CONTACT, answers: VALID_ANSWERS },
    });
    expect(res.status()).toBe(502);
    expect((await res.json()).error).toBeTruthy();
    expect(received).toHaveLength(1);
  });
});

test("buyback page renders the landing chrome, noindex and alias", async ({
  request,
}) => {
  const res = await request.get("/gold/buyback");
  expect(res.status()).toBe(200);
  const html = await res.text();
  expect(html.match(/<h1(?:\s|>)/g)?.length).toBe(1);
  expect(html).toMatch(/name="robots" content="noindex, follow"/);
  expect(html).toContain("header-lp");
  expect(html).toContain("Free Buyback Review");

  const alias = await request.get("/gold-buyback-review", { maxRedirects: 0 });
  expect(alias.status()).toBe(308);
  expect(alias.headers().location).toBe("/gold/buyback");
});

test("buyback quiz walks intro → 4 questions → form → confirmation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const payloads: Array<Record<string, unknown>> = [];
  await page.route("**/api/gold-buyback", async (route) => {
    payloads.push(route.request().postDataJSON());
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, submissionId: "sub-1" }),
    });
  });

  await page.goto("/gold/buyback?utm_source=facebook&utm_campaign=bb");
  await page.getByRole("button", { name: /Start the quiz/ }).click();
  await page.getByRole("radio", { name: /Collector coins/ }).click();
  await page.getByRole("radio", { name: /\$75,000 – \$150,000/ }).click();
  await page.getByRole("radio", { name: /In a Gold or Silver IRA/ }).click();
  await page
    .getByRole("radio", { name: /I paid more than they’re worth/ })
    .click();

  await expect(page.getByText("You qualify for a free review")).toBeVisible();
  await expect(page.getByText("Citadel Gold").first()).toBeVisible();

  await page.getByLabel("First name").fill("Robert");
  await page.getByLabel("Last name").fill("Hayes");
  await page.getByLabel("Email").fill("rhayes@example.com");
  await page.getByLabel("Phone").fill("5552140877");
  await expect(page.getByLabel("Phone")).toHaveValue("(555) 214-0877");
  await page.getByRole("button", { name: /Get my free review/ }).click();

  await expect(
    page.getByRole("heading", { name: /You’re all set, Robert/ }),
  ).toBeVisible();
  expect(payloads).toHaveLength(1);
  expect(payloads[0]).toMatchObject({
    phone: "5552140877",
    consent: true,
    answers: VALID_ANSWERS,
    utms: { utm_source: "facebook", utm_campaign: "bb" },
  });
});

test("unfinished buyback form is sent to the CRM labelled UNFINISHED", async ({
  request,
}) => {
  // No contact details at all: nothing worth saving.
  const empty = await request.post("/api/gold-buyback", {
    data: { partial: true, answers: { coinType: "collector" } },
  });
  expect(empty.status()).toBe(400);

  await withMockCrm(200, { success: true }, async (received) => {
    const res = await request.post("/api/gold-buyback", {
      data: {
        partial: true,
        email: "left-early@example.com",
        answers: { coinType: "collector", heldIn: "bogus" },
      },
    });
    expect(res.status()).toBe(200);
    expect(received).toHaveLength(1);
    expect(received[0]).toMatchObject({
      form_id: "tpp-gold-buyback-review-unfinished",
      form_name: expect.stringContaining("(UNFINISHED)"),
      email: "left-early@example.com",
      first_name: "Unknown",
      consent: false,
      custom_fields: {
        lead_status: "unfinished",
        coin_type: "collector",
        held_in: null,
      },
    });
    expect(String(received[0].message)).toMatch(/^UNFINISHED/);
  });
});

test("leaving the buyback contact step sends an unfinished-lead beacon", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const partials: Array<Record<string, unknown>> = [];
  await page.route("**/api/gold-buyback", async (route) => {
    const body = route.request().postDataJSON() as Record<string, unknown>;
    if (body.partial) partials.push(body);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"ok":true}',
    });
  });

  await page.goto("/gold/buyback");
  await page.getByRole("button", { name: /Start the quiz/ }).click();
  await page.getByRole("radio", { name: /Collector coins/ }).click();
  await page.getByRole("radio", { name: /\$75,000 – \$150,000/ }).click();
  await page.getByRole("radio", { name: /In a Gold or Silver IRA/ }).click();
  await page
    .getByRole("radio", { name: /I paid more than they’re worth/ })
    .click();
  await page.getByLabel("First name").fill("Robert");
  await page.getByLabel("Email").fill("rhayes@example.com");

  await page.evaluate(() => window.dispatchEvent(new Event("pagehide")));
  await expect.poll(() => partials.length).toBe(1);
  expect(partials[0]).toMatchObject({
    partial: true,
    firstName: "Robert",
    email: "rhayes@example.com",
    answers: VALID_ANSWERS,
  });
});
