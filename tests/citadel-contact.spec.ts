import { test, expect, type Page } from "@playwright/test";

const goldPage = "/gold/best-gold-companies";
const footer = (page: Page) =>
  page.getByRole("complementary", { name: "Citadel Gold preferred company" });
const contact = (page: Page) =>
  page.getByRole("dialog", { name: "Your next chapter. Backed by gold." });

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

async function screenshot(page: Page, path: string) {
  await page
    .locator(
      'dialog[open] img, aside[aria-label="Citadel Gold preferred company"] img',
    )
    .evaluateAll(async (images) => {
      await Promise.all(
        images.map((image) => (image as HTMLImageElement).decode()),
      );
    });
  await page.screenshot({ path, animations: "disabled" });
}

async function reachCitadel(page: Page) {
  await page
    .locator("#citadel-gold .provider-description h2")
    .evaluate((element) => {
      window.scrollTo({
        top: window.scrollY + element.getBoundingClientRect().top - 170,
        behavior: "instant",
      });
    });
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
}

test("mobile footer loads immediately, then the #1 placement opens contact once per session", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(goldPage);
  await expect(footer(page)).toBeVisible();
  await expect(contact(page)).not.toBeVisible();
  await expect(
    footer(page).getByRole("link", { name: "Call now" }),
  ).toHaveAttribute("href", "tel:+18006055597");
  await screenshot(page, "/tmp/reviewtopcompanies-citadel-mobile-footer.png");

  await reachCitadel(page);
  await expect(contact(page)).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await expect(
    contact(page).getByRole("link", { name: "Learn more" }),
  ).toHaveAttribute("href", "https://www.citadelgold.com/gold-ira/");
  await expect(
    contact(page).getByRole("link", { name: "Learn more" }),
  ).toHaveAttribute("rel", "noopener noreferrer sponsored");
  await expect(
    contact(page).getByRole("img", {
      name: "American Gold Eagle coin against deep green velvet",
    }),
  ).toBeVisible();
  await screenshot(page, "/tmp/reviewtopcompanies-citadel-mobile-modal.png");
  await contact(page)
    .getByRole("button", { name: "Close Citadel Gold contact" })
    .click();
  await expect(contact(page)).not.toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await reachCitadel(page);
  await expect(contact(page)).not.toBeVisible();
  await page.reload();
  await reachCitadel(page);
  await expect(contact(page)).not.toBeVisible();
  await expect(footer(page)).toBeVisible();
  await footer(page).getByRole("button", { name: "Learn more" }).click();
  await expect(contact(page)).toBeVisible();
});

test("desktop uses a compact footer and an intentional two-column contact panel", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(goldPage);
  await expect(footer(page)).toBeVisible();
  await screenshot(page, "/tmp/reviewtopcompanies-citadel-desktop-footer.png");
  await reachCitadel(page);
  await expect(contact(page)).not.toBeVisible();
  await footer(page).getByRole("button", { name: "Learn more" }).click();
  await expect(contact(page)).toBeVisible();
  const close = contact(page).getByRole("button", {
    name: "Close Citadel Gold contact",
  });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    contact(page).getByRole("button", { name: "Continue comparing companies" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await screenshot(page, "/tmp/reviewtopcompanies-citadel-desktop-modal.png");
  await page.keyboard.press("Escape");
  await expect(contact(page)).not.toBeVisible();
  await expect(
    footer(page).getByRole("button", { name: "Learn more" }),
  ).toBeFocused();
});

test("dismissing the mobile footer also suppresses automatic contact", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(goldPage);
  await footer(page)
    .getByRole("button", { name: "Dismiss Citadel Gold footer" })
    .click();
  await expect(footer(page)).not.toBeVisible();
  await reachCitadel(page);
  await expect(contact(page)).not.toBeVisible();
});

test("the comparison tray takes priority and other categories have no Citadel footer", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(goldPage);
  await page
    .locator("#citadel-gold")
    .getByRole("button", { name: "Add to compare" })
    .evaluate((element: HTMLButtonElement) => element.click());
  await expect(
    page.getByRole("complementary", { name: "Your comparison" }),
  ).toBeVisible();
  await expect(footer(page)).not.toBeVisible();
  await reachCitadel(page);
  await expect(contact(page)).not.toBeVisible();
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(footer(page)).toBeVisible();
  await page.goto("/mortgages/best-mortgage-lenders");
  await expect(footer(page)).toHaveCount(0);
});

test("small mobile and tablet layouts fit the viewport and remain dismissible", async ({
  page,
}) => {
  for (const size of [
    { width: 320, height: 568 },
    { width: 768, height: 1024 },
  ]) {
    await page.setViewportSize(size);
    await page.goto(goldPage);
    await expect(footer(page)).toBeVisible();
    await footer(page).getByRole("button", { name: "Learn more" }).click();
    await expect(contact(page)).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    const bounds = await contact(page).boundingBox();
    expect(bounds!.height).toBeLessThan(size.height);
    expect(bounds!.width).toBeLessThan(size.width);
    await contact(page)
      .getByRole("button", { name: "Continue comparing companies" })
      .click();
    await expect(contact(page)).not.toBeVisible();
  }
});
