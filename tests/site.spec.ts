import { test, expect } from "@playwright/test";
import { categories, providers } from "../lib/catalog";
import { guides } from "../lib/guides";
import { policies } from "../lib/policies";
import { calculateLoan } from "../lib/loan";

test("the category inventory is exactly the ten requested labels", () => {
  expect(categories.map((c) => c.title)).toEqual([
    "Best Gold Companies",
    "Best Mortgage Companies",
    "Best Personal Injury Law Firms",
    "Best Student Loan Refinance",
    "Best Credit Cards",
    "Best banks",
    "Best Lemon Law Lawyers",
    "Best Debt Relief Companies",
    "Best Credit Repair Companies",
    "Best Investment Companies",
  ]);
  for (const c of categories) {
    expect(c.criteria.reduce((sum, [, weight]) => sum + weight, 0)).toBe(100);
    expect(
      providers.filter((p) => p.category === c.id).length,
    ).toBeGreaterThanOrEqual(3);
    expect(guides.some((g) => g.category === c.id)).toBeTruthy();
  }
  expect(new Set(providers.map((p) => p.id)).size).toBe(providers.length);
  expect(providers.filter((p) => p.category === "gold")[0].id).toBe(
    "citadel-gold",
  );
});
test("repayment math handles normal, zero, tiny, and invalid rates", () => {
  const result = calculateLoan(30000, 6.5, 10)!;
  expect(result.monthly).toBeCloseTo(340.64, 2);
  expect(result.total).toBeCloseTo(result.monthly * 120, 8);
  expect(calculateLoan(12000, 0, 10)).toEqual({
    monthly: 100,
    total: 12000,
    interest: 0,
    months: 120,
  });
  expect(calculateLoan(12000, 0.000000001, 10)!.monthly).toBeCloseTo(100, 6);
  for (const values of [
    [NaN, 5, 10],
    [10000, Infinity, 10],
    [-1, 5, 10],
    [0, 5, 10],
    [10000, -1, 10],
    [10000, 101, 10],
    [10000, 5, 0],
    [10000, 5, 1.5],
    [10000, 5, 51],
  ])
    expect(calculateLoan(...(values as [number, number, number]))).toBeNull();
});
test("every category, profile, guide, method, and supporting page renders", async ({
  request,
}) => {
  const paths = [
    "/",
    ...categories.map((c) => c.path),
    ...providers.map((p) => `/reviews/${p.id}`),
    ...guides.map((g) => `/guides/${g.slug}`),
    ...categories.map((c) => `/methodology/${c.id}`),
    ...Object.keys(policies).map((p) => `/${p}`),
    "/categories",
    "/companies",
    "/guides",
    "/methodology",
    "/compare",
    "/search?q=gold",
  ];
  const internalLinks = new Set<string>();
  for (let start = 0; start < paths.length; start += 8) {
    await Promise.all(
      paths.slice(start, start + 8).map(async (path) => {
        const response = await request.get(path);
        expect(response.status(), path).toBe(200);
        const html = await response.text();
        expect(html, path).toContain('id="main-content"');
        expect(html, path).not.toContain("Create Next App");
        expect(html.match(/<h1(?:\s|>)/g)?.length, path).toBe(1);
        if (path === "/compare" || path.startsWith("/search"))
          expect(html, path).toMatch(/name="robots" content="noindex, follow"/);
        else expect(html, path).not.toMatch(/name="robots" content="noindex/);
        expect(html, path).toMatch(
          /<meta name="description" content="[^"]{40,}"/,
        );
        expect(html, path).toMatch(/property="og:title"/);
        for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
          const href = m[1];
          if (!href.startsWith("/_next/") && !href.startsWith("/brand/"))
            internalLinks.add(href);
        }
      }),
    );
  }
  for (const path of internalLinks) {
    expect((await request.get(path)).status(), `Internal link ${path}`).toBe(
      200,
    );
  }
});
test("indexing controls, branding assets, canonical metadata, and error handling", async ({
  request,
}) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Allow: /");
  expect(robots).toContain("Disallow: /search");
  expect(robots).toContain("Sitemap: https://topproviderpicks.com/sitemap.xml");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(
    "<loc>https://topproviderpicks.com/gold/best-gold-companies</loc>",
  );
  expect(sitemap).not.toContain(
    "<loc>https://topproviderpicks.com/compare</loc>",
  );
  for (const asset of [
    "/brand/logo.svg",
    "/brand/mark.svg",
    "/brand/logo-monochrome.svg",
    "/brand/logo-horizontal.svg",
    "/opengraph-image",
  ])
    expect((await request.get(asset)).status(), asset).toBe(200);
  const gold = await (await request.get("/gold/best-gold-companies")).text();
  expect(gold).toContain(
    'rel="canonical" href="https://topproviderpicks.com/gold/best-gold-companies"',
  );
  expect(gold).toContain(
    'class="sponsored-tag" href="/advertising-disclosure">Sponsored</a>',
  );
  expect(gold).not.toContain("TOP PICK");
  expect(gold).toContain("application/ld+json");
  expect(gold).toContain('"@type":"FAQPage"');
  expect(gold).toContain('"@type":"ItemList"');
  expect(gold).toContain("<title>Best Gold IRA Companies");
  for (const svg of ["/brand/logo.svg", "/brand/logo-horizontal.svg"])
    expect(await (await request.get(svg)).text()).toContain("provider picks");
  const missing = await request.get("/this-page-does-not-exist");
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain("WRONG TURN");
  const redirect = await request.get("/best-gold-companies", {
    maxRedirects: 0,
  });
  expect(redirect.status()).toBe(308);
  expect(redirect.headers().location).toBe("/gold/best-gold-companies");
});

test("the paid gold listing is labeled Sponsored wherever it is ranked and links carry the right rel", async ({
  request,
}) => {
  const label =
    'class="sponsored-tag" href="/advertising-disclosure">Sponsored</a>';
  for (const path of ["/", "/gold/best-gold-companies"]) {
    const html = await (await request.get(path)).text();
    expect(html, path).toContain(label);
    expect(html, path).not.toMatch(
      /our top pick|featured pick|editor.?s pick/i,
    );
  }
  expect(await (await request.get("/advertising-disclosure")).text()).toContain(
    "Citadel Gold pays for the #1 spot",
  );
  for (const path of [
    "/mortgages/best-mortgage-lenders",
    "/reviews/goldco",
    "/reviews/citadel-gold",
    "/methodology/gold",
  ]) {
    const html = await (await request.get(path)).text();
    expect(html, path).not.toContain('class="sponsored-tag"');
  }
  for (const category of categories) {
    const html = await (await request.get(category.path)).text();
    expect(html, category.path).toContain("Last reviewed");
    expect(html, category.path).toContain('dateTime="2026-10-21"');
    expect(html, category.path).toContain('id="compare-table"');
    for (const p of providers.filter((x) => x.category === category.id)) {
      const rel =
        p.id === "citadel-gold"
          ? 'rel="noopener noreferrer sponsored"'
          : 'rel="noopener noreferrer nofollow"';
      expect(html, `${category.path} ${p.name}`).toContain(
        `href="${p.domain}" target="_blank" ${rel}`,
      );
    }
  }
});
