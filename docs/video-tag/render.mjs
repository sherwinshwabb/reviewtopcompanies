// Renders the 9:16 overlays to 2160x3840 (4K) MOV files.
//
//   tag.html      the brand tag, ProRes 4444 with alpha, 60s by default
//   endcard.html  the white closing frame, ProRes 422 HQ, 6s by default
//
//   node docs/video-tag/render.mjs                       # top tag, dark, 60s, 30fps
//   node docs/video-tag/render.mjs --pos bottom --theme light --dur 30
//   node docs/video-tag/render.mjs --out                 # fade the tag out at the end
//   node docs/video-tag/render.mjs --page endcard        # the end card
//
// Tag options:      --pos top|bottom  --inset <percent>  --align center|left
//                   --theme dark|light  --sub "<second line>"  --out
// End card options: --url "<address>"  --tagline "<line one|line two>"
// Both:             --dur <seconds>  --fps <n>  --name <file name without extension>
//
// Same approach as the card-maker renderer: seek the page one frame at a
// time, capture a transparent PNG and pipe it into ffmpeg. Frames after the
// intro are identical, so they are captured once and repeated.
import { chromium } from "../../node_modules/playwright/index.mjs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf("--" + name);
  return i >= 0 && args[i + 1] !== undefined && !args[i + 1].startsWith("--") ? args[i + 1] : fallback;
};
const flag = (name) => args.includes("--" + name);

const pageName = opt("page", "tag") === "endcard" ? "endcard" : "tag";
const alpha = pageName === "tag";
const pos = opt("pos", "top");
const theme = opt("theme", "dark");
const align = opt("align", "center");
const dur = Number(opt("dur", alpha ? 60 : 6));
const fps = Number(opt("fps", 30));
const outDir = path.join(here, "out");
fs.mkdirSync(outDir, { recursive: true });
const name = opt("name", alpha ? `tpp-tag-${pos}-${theme}-9x16-4k` : "tpp-endcard-9x16-4k");
const movPath = path.join(outDir, name + ".mov");
const stillPath = path.join(outDir, name + "-still.png");

const params = new URLSearchParams({ export: "1", dur: String(dur), fps: String(fps) });
if (alpha) {
  params.set("pos", pos);
  params.set("theme", theme);
  params.set("align", align);
  if (opt("inset") !== undefined) params.set("inset", opt("inset"));
  if (opt("sub") !== undefined) params.set("sub", opt("sub"));
  if (flag("out")) params.set("out", "1");
} else {
  if (opt("url") !== undefined) params.set("url", opt("url"));
  if (opt("tagline") !== undefined) params.set("tagline", opt("tagline"));
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });
await page.goto("file://" + path.join(here, pageName + ".html") + "?" + params.toString());
await page.waitForFunction("window.READY === true", null, { timeout: 30000 });
const { introEnd, outStart } = await page.evaluate(() => ({ introEnd: window.INTRO_END, outStart: window.OUT_START }));

const total = Math.round(dur * fps);
const ffmpeg = spawn(
  "ffmpeg",
  [
    "-y", "-f", "image2pipe", "-c:v", "png", "-framerate", String(fps), "-i", "-",
    // the tag keeps its alpha channel; the end card is opaque, so 422 HQ is enough
    "-c:v", "prores_ks", "-profile:v", alpha ? "4" : "3", "-pix_fmt", alpha ? "yuva444p10le" : "yuv422p10le", "-vendor", "apl0",
    "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
    "-t", String(dur), movPath,
  ],
  { stdio: ["pipe", "ignore", "pipe"] },
);
let ffErr = "";
ffmpeg.stderr.on("data", (c) => { ffErr = (ffErr + c).slice(-4000); });
const ffDone = new Promise((res, rej) =>
  ffmpeg.on("close", (code) => (code === 0 ? res() : rej(new Error("ffmpeg exited " + code + "\n" + ffErr)))),
);

const capture = async (t) => {
  await page.evaluate((time) => window.SEEK(time), t);
  return page.screenshot({ type: "png", omitBackground: alpha });
};
let hold = null;
const started = Date.now();
for (let i = 0; i < total; i++) {
  const t = i / fps;
  const holding = t >= introEnd && (outStart === null || t < outStart);
  let frame;
  if (holding) {
    if (!hold) {
      hold = await capture(t);
      fs.writeFileSync(stillPath, hold);
    }
    frame = hold;
  } else {
    frame = await capture(t);
  }
  if (!ffmpeg.stdin.write(frame)) await new Promise((r) => ffmpeg.stdin.once("drain", r));
  if ((i + 1) % 150 === 0 || i + 1 === total) process.stdout.write(`frame ${i + 1}/${total}\n`);
}
ffmpeg.stdin.end();
await ffDone;
await browser.close();
const mb = (fs.statSync(movPath).size / 1e6).toFixed(1);
console.log(`${movPath}\n${mb} MB, ${dur}s at ${fps}fps, ${((Date.now() - started) / 1000).toFixed(0)}s to render`);
console.log(stillPath);
