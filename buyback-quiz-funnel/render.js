// Renders each .screen in buyback-funnel.html to a 3x JPG.
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000, deviceScaleFactor: 3 });
  await page.goto('file://' + path.join(__dirname, 'buyback-funnel.html'), { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const ids = await page.$$eval('.screen', els => els.map(e => e.id));
  for (const id of ids) {
    const el = await page.$('#' + id);
    const out = path.join(__dirname, 'jpg', id + '.jpg');
    await el.screenshot({ path: out, type: 'jpeg', quality: 92 });
    console.log(out);
  }
  await browser.close();
})();
