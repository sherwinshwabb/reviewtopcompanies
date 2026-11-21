import { test, expect } from "@playwright/test";
import { getVisibleQuestions, scoreAndMatchGoldQuiz } from "../lib/gold-match";

test("quiz branching covers IRA rollover, low-balance, and cash paths, all matched to Citadel Gold", () => {
  expect(getVisibleQuestions({ hasRetirementAccount: "yes" })).toHaveLength(5);
  expect(getVisibleQuestions({ hasRetirementAccount: "no" })).toHaveLength(4);

  const highIntent = scoreAndMatchGoldQuiz({
    ageRange: "60-69",
    hasRetirementAccount: "yes",
    accountLocation: "former-employer-or-ira",
    accountBalance: "100k-250k",
    timeline: "within-30-days",
  });
  expect(highIntent.tier).toBe("Rollover-Ready Match");
  expect(highIntent.score).toBeGreaterThanOrEqual(90);
  expect(highIntent.matches.map((m) => m.provider.id)).toEqual([
    "citadel-gold",
  ]);
  expect(highIntent.matches[0].sponsored).toBe(true);

  const lowBalance = scoreAndMatchGoldQuiz({
    ageRange: "50-59",
    hasRetirementAccount: "yes",
    accountLocation: "current-employer",
    accountBalance: "under-25k",
    timeline: "1-3-months",
  });
  expect(lowBalance.matches.map((m) => m.provider.id)).toEqual([
    "citadel-gold",
  ]);

  const cashPath = scoreAndMatchGoldQuiz({
    ageRange: "under-50",
    hasRetirementAccount: "no",
    accountBalance: "25k-50k",
    timeline: "researching",
  });
  expect(cashPath.matches.map((m) => m.provider.id)).toEqual(["citadel-gold"]);
});

test("gold match landing page renders with minimal navigation, noindex, and alias redirect", async ({
  request,
}) => {
  const res = await request.get("/gold/match");
  expect(res.status()).toBe(200);
  const html = await res.text();

  expect(html).toContain('id="main-content"');
  expect(html.match(/<h1(?:\s|>)/g)?.length).toBe(1);
  expect(html).toMatch(/name="robots" content="noindex, follow"/);
  expect(html).not.toMatch(/our top pick|featured pick|editor.?s pick/i);
  expect(html).toContain("/advertising-disclosure");

  const alias = await request.get("/gold-ira-match", { maxRedirects: 0 });
  expect(alias.status()).toBe(308);
  expect(alias.headers().location).toBe("/gold/match");

  // Also verify minimal landing-page header & footer markup in SSR HTML
  expect(html).toContain("header-lp");
  expect(html).toContain("footer-lp");
});

test("POST /api/gold-match validates required fields before forwarding", async ({
  request,
}) => {
  const invalid = await request.post("/api/gold-match", {
    data: {
      firstName: "Jane",
      lastName: "Doe",
      email: "not-an-email",
      phone: "123",
      consent: true,
    },
  });
  expect(invalid.status()).toBe(400);

  const missingConsent = await request.post("/api/gold-match", {
    data: {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phone: "5558675309",
      consent: false,
    },
  });
  expect(missingConsent.status()).toBe(400);
});

test("POST /api/gold-match returns an error when the CRM rejects the lead", async ({
  request,
}) => {
  const { createServer } = await import("node:http");
  let crmCalls = 0;
  const mockCrm = createServer((_req, res) => {
    crmCalls++;
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Unauthorized" }));
  });
  await new Promise<void>((resolve) =>
    mockCrm.listen(3199, "127.0.0.1", resolve),
  );

  try {
    const response = await request.post("/api/gold-match", {
      data: {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        phone: "5558675309",
        consent: true,
        answers: {},
      },
    });
    expect(response.status()).toBe(502);
    const body = (await response.json()) as { error?: string; match?: unknown };
    expect(body.error).toBeTruthy();
    expect(body.match).toBeUndefined();
    // 401 is not retryable, so exactly one attempt.
    expect(crmCalls).toBe(1);
  } finally {
    await new Promise<void>((resolve) => mockCrm.close(() => resolve()));
  }
});

test("interactive quiz completes 5-question IRA flow, preserves UTMs, and displays matched companies", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  const capturedPayloads: Array<Record<string, unknown>> = [];
  await page.route("**/api/gold-match", async (route) => {
    const request = route.request();
    const payload = request.postDataJSON() as Record<string, unknown>;
    capturedPayloads.push(payload);
    const match = scoreAndMatchGoldQuiz(
      (payload.answers ?? {}) as Parameters<typeof scoreAndMatchGoldQuiz>[0],
    );
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        match,
        crmDelivered: true,
        submissionId: "test-sub-123",
      }),
    });
  });

  await page.goto(
    "/gold/match?utm_source=google&utm_medium=cpc&utm_campaign=gold-ira-match-test",
  );

  // Minimal navigation: full site nav and compare header must stay hidden.
  await expect(page.locator(".desktop-nav")).toHaveCount(0);
  await expect(page.locator(".compare-header")).toHaveCount(0);
  await expect(
    page.getByRole("heading", {
      name: /Find your best Gold IRA match in 2 minutes/i,
    }),
  ).toBeVisible();

  await page.getByRole("radio", { name: /60 – 69/ }).click();
  await page
    .getByRole("radio", { name: /Yes, I have a retirement account/ })
    .click();
  await page
    .getByRole("radio", { name: /Former employer or existing IRA/ })
    .click();
  await page.getByRole("radio", { name: /\$100,000 – \$250,000/ }).click();
  await page.getByRole("radio", { name: /Within 30 days/ }).click();

  await expect(page.getByLabel("First name")).toBeVisible();
  await page.getByLabel("First name").fill("Jane");
  await page.getByLabel("Last name").fill("Doe");
  await page.getByLabel("Email address").fill("jane.doe@example.com");
  await page.getByLabel("Phone number").fill("(555) 867-5309");

  await page.getByRole("button", { name: /See My Gold Match/ }).click();

  await expect(
    page.getByRole("heading", {
      name: /You qualify for a guided Gold IRA rollover/i,
    }),
  ).toBeVisible();

  expect(capturedPayloads).toHaveLength(1);
  const capturedPayload = capturedPayloads[0];
  expect(capturedPayload.firstName).toBe("Jane");
  expect(capturedPayload.email).toBe("jane.doe@example.com");
  expect(capturedPayload.consent).toBe(true);
  expect(capturedPayload.utms).toMatchObject({
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "gold-ira-match-test",
  });

  const citadelVisit = page.getByRole("link", { name: /Visit Citadel Gold/ });
  await expect(citadelVisit).toHaveAttribute(
    "rel",
    "noopener noreferrer sponsored",
  );
  await expect(
    page.locator('a.sponsored-tag[href="/advertising-disclosure"]'),
  ).toHaveCount(1);
});

test("selecting No retirement account skips the employer-plan question", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/gold/match");

  await page.getByRole("radio", { name: /50 – 59/ }).click();
  await page
    .getByRole("radio", { name: /No — looking to buy with cash or savings/ })
    .click();

  await expect(
    page.getByRole("heading", {
      name: /Roughly how much are you considering putting toward physical gold/i,
    }),
  ).toBeVisible();
});
