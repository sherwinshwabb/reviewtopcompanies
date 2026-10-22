import { chromium } from "../../node_modules/playwright/index.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const here = path.dirname(fileURLToPath(import.meta.url));
const [html = "lead-in.html", outDir = path.join(here, "out")] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const base = path.basename(html, ".html");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 1000 }, deviceScaleFactor: 2 });
await page.goto("file://" + path.resolve(here, html));
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(outDir, `${base}-2400x2000.png`), type: "png" });
await page.screenshot({ path: path.join(outDir, `${base}-2400x2000.jpg`), type: "jpeg", quality: 92 });
const small = await browser.newPage({ viewport: { width: 1200, height: 1000 }, deviceScaleFactor: 1 });
await small.goto("file://" + path.resolve(here, html));
await small.evaluate(() => document.fonts.ready);
await small.waitForTimeout(400);
await small.screenshot({ path: path.join(outDir, `${base}-1200x1000.jpg`), type: "jpeg", quality: 90 });
await browser.close();
console.log(fs.readdirSync(outDir).join("\n"));
