// Drive the preview in an isolated browser and save what it shows.
// usage: node shot.mjs <json-spec-file>
import { chromium, webkit } from 'playwright';
import fs from 'node:fs';

const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const CHROME = process.env.CHROME_PATH || undefined; // unset: Playwright's own Chromium
const engine = spec.engine === 'webkit' ? webkit : chromium;
const browser = await engine.launch(spec.engine === 'webkit' ? {} : { executablePath: CHROME, args: ['--autoplay-policy=no-user-gesture-required'] });
const context = await browser.newContext({
  viewport: spec.viewport ?? { width: 1440, height: 900 },
  deviceScaleFactor: spec.dpr ?? 1,
  hasTouch: !!spec.touch,
  isMobile: !!spec.mobile,
  reducedMotion: spec.reducedMotion ? 'reduce' : 'no-preference',
  javaScriptEnabled: spec.js !== false,
});
const page = await context.newPage();
const logs = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) logs.push(`${m.type()}: ${m.text()}`); });
page.on('pageerror', (e) => logs.push(`pageerror: ${e.message}`));
page.on('requestfailed', (r) => logs.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));
const out = { url: spec.url, steps: [] };
await page.goto(spec.url, { waitUntil: 'load' });
await page.waitForTimeout(spec.settle ?? 1200);
if (spec.warm) {
  // Walk the page once so lazy images load, then return to the top.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(60); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
}
for (const step of spec.steps ?? []) {
  const rec = { ...step };
  if (step.scroll !== undefined) {
    // Scroll the way a wheel does, in small moves, so scrubbed motion is exercised.
    const from = await page.evaluate(() => window.scrollY);
    const to = typeof step.scroll === 'string' ? await page.evaluate(step.scroll) : step.scroll;
    const n = step.jump ? 1 : Math.max(1, Math.ceil(Math.abs(to - from) / 120));
    for (let i = 1; i <= n; i++) { await page.evaluate((y) => window.scrollTo(0, y), from + ((to - from) * i) / n); await page.waitForTimeout(16); }
  }
  if (step.click) await page.click(step.click);
  if (step.press) await page.keyboard.press(step.press);
  if (step.tap) await page.tap(step.tap);
  if (step.wait) await page.waitForTimeout(step.wait); else await page.waitForTimeout(900);
  if (step.eval) rec.result = await page.evaluate(step.eval);
  if (step.shot) await page.screenshot({ path: step.shot, fullPage: !!step.full, clip: step.clip });
  rec.scrollY = await page.evaluate(() => Math.round(window.scrollY));
  out.steps.push(rec);
}
out.logs = logs;
console.log(JSON.stringify(out, null, 1));
await browser.close();
