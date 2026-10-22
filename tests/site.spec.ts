import { test, expect } from "@playwright/test";
import { categories, providers } from "../lib/catalog";
import { guides } from "../lib/guides";
import { policies } from "../lib/policies";
import { calculateLoan } from "../lib/loan";
import { rankProviders, seededShuffle } from "../lib/ranking";

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
test("ranking pins Citadel Gold first and shuffles the rest with a stable seed", () => {
  const ids = categories.map((c) => c.id);
  const a = rankProviders(providers, ids, "seed-a").map((p) => p.id);
  const b = rankProviders(providers, ids, "seed-b").map((p) => p.id);
  expect(rankProviders(providers, ids, "seed-a").map((p) => p.id)).toEqual(a);
  expect(a).not.toEqual(b);
  expect(a).toHaveLength(providers.length);
  expect(new Set(a).size).toBe(a.length);
  for (const seed of ["seed-a", "seed-b"]) {
    const gold = rankProviders(providers, ids, seed).filter(
      (p) => p.category === "gold",
    );
    expect(gold[0].id).toBe("citadel-gold");
  }
  expect(seededShuffle([1, 2, 3, 4, 5], "x")).toEqual(
    seededShuffle([1, 2, 3, 4, 5], "x"),
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
    expect(await (await request.get(svg)).text()).toContain("PROVIDER PICKS");
  const missing = await request.get("/this-page-does-not-exist");
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain("WRONG TURN");
  const redirect = await request.get("/best-gold-companies", {
    maxRedirects: 0,
  });
  expect(redirect.status()).toBe(308);
  expect(redirect.headers().location).toBe("/gold/best-gold-companies");
});

test("every page has unique, complete metadata, a social image, and valid structured data", async ({
  request,
}) => {
  const { contentPaths } = await import("../lib/seo");
  const paths = ["/", ...contentPaths];
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  const decode = (s: string) =>
    s
      .replace(/&amp;/g, "&")
      .replace(/&#x27;/g, "'")
      .replace(/&quot;/g, '"');
  for (let start = 0; start < paths.length; start += 8) {
    await Promise.all(
      paths.slice(start, start + 8).map(async (path) => {
        const html = await (await request.get(path)).text();
        const title = decode(html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "");
        const pageTitle = title.replace(/ \| Top Provider Picks$/, "");
        expect(pageTitle.length, `${path} title "${title}"`).toBeGreaterThan(
          10,
        );
        expect(
          pageTitle.length,
          `${path} title "${title}"`,
        ).toBeLessThanOrEqual(70);
        expect(titles.get(title), `duplicate title on ${path}`).toBeUndefined();
        titles.set(title, path);
        const description = decode(
          html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "",
        );
        expect(description.length, `${path} description`).toBeGreaterThan(40);
        expect(description.length, `${path} description`).toBeLessThanOrEqual(
          175,
        );
        expect(
          descriptions.get(description),
          `duplicate description on ${path}`,
        ).toBeUndefined();
        descriptions.set(description, path);
        expect(html, path).toContain(
          `rel="canonical" href="https://topproviderpicks.com${path === "/" ? "" : path}"`,
        );
        const image = path === "/" ? "/opengraph-image" : `/og${path}`;
        expect(html, path).toContain(
          `property="og:image" content="https://topproviderpicks.com${image}`,
        );
        for (const tag of [
          'property="og:title"',
          'property="og:description"',
          'property="og:url"',
          'name="twitter:card" content="summary_large_image"',
          'name="twitter:image"',
        ])
          expect(html, `${path} ${tag}`).toContain(tag);
        const scripts = [
          ...html.matchAll(
            /<script type="application\/ld\+json">([^<]+)<\/script>/g,
          ),
        ].map((m) => JSON.parse(m[1]) as { "@type": string });
        expect(scripts.length, `${path} JSON-LD`).toBeGreaterThanOrEqual(2);
        const types = scripts.map((s) => s["@type"]);
        for (const t of types) expect(t, path).toBeTruthy();
        if (categories.some((c) => c.path === path)) {
          expect(types, path).toContain("CollectionPage");
          expect(types, path).toContain("FAQPage");
          expect(types, path).toContain("BreadcrumbList");
        }
        if (path.startsWith("/reviews/") || path.startsWith("/guides/"))
          expect(types, path).toContain("Article");
      }),
    );
  }
  const image = await request.get("/og/gold/best-gold-companies");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
  expect((await request.get("/og/reviews/citadel-gold")).status()).toBe(200);
  expect((await request.get("/og/not-a-page")).status()).toBe(404);
  expect((await request.get("/og/compare")).status()).toBe(404);
});
test("category pages carry year-stamped titles and headings, six unique FAQs, and the review pages name the company in every heading", async ({
  request,
}) => {
  const { categorySeo, providerSeo } = await import("../lib/seo");
  const questions = new Set<string>();
  for (const category of categories) {
    const seo = categorySeo[category.id];
    expect(seo.metaTitle, category.id).toContain("2026");
    expect(seo.metaTitle.length, category.id).toBeLessThanOrEqual(60);
    expect(seo.h1, category.id).toContain("2026");
    expect(seo.faqs, category.id).toHaveLength(6);
    for (const faq of seo.faqs) {
      expect(questions.has(faq.question), faq.question).toBeFalsy();
      questions.add(faq.question);
    }
    const html = await (await request.get(category.path)).text();
    const escape = (t: string) =>
      t.replace(/&/g, "&amp;").replace(/'/g, "&#x27;").replace(/"/g, "&quot;");
    expect(html, category.path).toContain(`<h1>${escape(seo.h1)}</h1>`);
    expect(html, category.path).toContain(
      `Frequently asked questions about ${seo.plural}`,
    );
    expect(html, category.path).not.toContain(
      "Do I have to give you my contact details?",
    );
  }
  const gold = await (await request.get("/gold/best-gold-companies")).text();
  expect(gold).toContain(
    "<title>Best Gold IRA Companies &amp; Bullion Dealers, Ranked for 2026 | Top Provider Picks</title>",
  );
  for (const p of providers) {
    const seo = providerSeo(p);
    expect(seo.metaTitle, p.id).toMatch(/ Review 2026: /);
    expect(seo.metaTitle.length, p.id).toBeLessThanOrEqual(70);
  }
  const review = await (await request.get("/reviews/goldco")).text();
  expect(review).toContain(
    "<title>Goldco Review 2026: Gold IRA Costs &amp; Buyback | Top Provider Picks</title>",
  );
  for (const heading of [
    "<h1>Goldco review</h1>",
    "Goldco pros and cons",
    "Goldco costs, terms, and who qualifies",
    "Who Goldco is for",
    "How we reviewed Goldco",
  ])
    expect(review).toContain(heading);
  const guide = await (await request.get("/guides/gold-ira-fees")).text();
  expect(guide).toContain(
    "<title>What a Gold IRA Really Costs: Every Fee, Line by Line | Top Provider Picks</title>",
  );
  expect(guide).toContain(
    "<h1>What a Gold IRA Really Costs: Every Fee, Line by Line</h1>",
  );
  const method = await (await request.get("/methodology/gold")).text();
  expect(method).toContain(
    "<title>How We Rank Gold Companies (2026 Criteria &amp; Weights) | Top Provider Picks</title>",
  );
  const disclosure = await (
    await request.get("/advertising-disclosure")
  ).text();
  expect(disclosure).toContain("<h1>Advertising disclosure</h1>");
});
test("the paid gold listing carries one Sponsored line on its category card and links carry the right rel", async ({
  request,
}) => {
  const label =
    'class="sponsored-tag" href="/advertising-disclosure">Sponsored</a>';
  const home = await (await request.get("/")).text();
  const gold = await (await request.get("/gold/best-gold-companies")).text();
  expect(gold.split(label).length - 1).toBe(1);
  expect(gold).not.toContain("table-sponsored");
  expect(home).not.toContain('class="sponsored-tag"');
  for (const html of [home, gold])
    expect(html).not.toMatch(/our top pick|featured pick|editor.?s pick/i);
  expect(await (await request.get("/advertising-disclosure")).text()).toContain(
    "first position in our gold comparison is a paid placement",
  );
  const homeTop = [
    ...home
      .slice(home.indexOf('class="featured-companies"'))
      .matchAll(/href="\/reviews\/([a-z0-9-]+)"/g),
  ]
    .map((m) => m[1])
    .filter((id, i, all) => all.indexOf(id) === i)
    .slice(0, 3);
  const goldTop = [
    ...gold.matchAll(
      /class="quick-pick" data-rank="\d"[\s\S]*?href="#([a-z0-9-]+)"/g,
    ),
  ].map((m) => m[1]);
  expect(homeTop[0]).toBe("citadel-gold");
  expect(goldTop).toEqual(homeTop);
  const citadelReview = await (
    await request.get("/reviews/citadel-gold")
  ).text();
  expect(citadelReview).not.toMatch(/#1 of \d+ in Gold/);
  expect(await (await request.get(`/reviews/${goldTop[1]}`)).text()).toContain(
    "#2 of 7 in Gold",
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
    expect(html, category.path).toContain(
      'class="disclosure-line"><a href="/advertising-disclosure">Advertising disclosure</a>',
    );
    expect(html, category.path).toContain('dateTime="2026-10-21"');
    expect(html, category.path).toContain('id="compare-table"');
    expect(html, category.path).toContain("The top three on our list.");
    for (const rank of [1, 2, 3]) {
      expect(html, category.path).toContain(
        `<article class="quick-pick" data-rank="${rank}">`,
      );
    }
    expect(html, category.path).not.toContain(
      'class="quick-pick" data-rank="4"',
    );
    expect(html, category.path).not.toContain(
      'class="rank-badge" data-rank="4"',
    );
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
