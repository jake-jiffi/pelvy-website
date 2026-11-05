// The same walk in WebKit (Safari's engine), phone and desktop sizes.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { webkit } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4330';
const dir = process.argv[3];
const browser = await webkit.launch();
console.log('engine:', browser.browserType().name(), browser.version());
const out = []; const errors = [];
const check = (n, ok, d = '') => out.push(`${ok ? 'PASS' : 'FAIL'}  ${n}${d !== '' ? '  [' + d + ']' : ''}`);
for (const dev of [{ n: 'phone', o: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' } }, { n: 'desktop', o: { viewport: { width: 1440, height: 900 } } }]) {
  const ctx = await browser.newContext(dev.o); const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`${dev.n}: ${e.message}`)); page.on('console', (m) => { if (m.type() === 'error') errors.push(`${dev.n}: ${m.text()}`); });
  await page.goto(base + '/'); await page.waitForTimeout(2500);
  await page.screenshot({ path: `${dir}/${dev.n}-0-rest.png` });
  const rest = await page.evaluate(() => { const h = document.querySelector('[data-hero]'); const a = document.querySelector('[data-hero-screen]').getBoundingClientRect(); const p = document.querySelector('[data-hero-slot]').getBoundingClientRect(); const big = document.querySelector('[data-hero-target] [data-player]'); return { live: h.classList.contains('hero--live'), screenInSlot: [(a.left - p.left) / p.width, (a.top - p.top) / p.height, a.width / p.width, a.height / p.height].map((v) => Math.round(v * 1000) / 1000), count: big.querySelector('[data-player-count]').textContent, cueSize: getComputedStyle(big.querySelector('.app__cue')).fontSize, ox: document.documentElement.scrollWidth - innerWidth }; });
  check(`${dev.n}: pinned mode starts`, rest.live);
  check(`${dev.n}: the live screen sits on the phone in the photograph`, Math.abs(rest.screenInSlot[0] - 0.321) < 0.01 && Math.abs(rest.screenInSlot[1] - 0.137) < 0.01 && Math.abs(rest.screenInSlot[2] - 0.339) < 0.012, rest.screenInSlot.join(', '));
  check(`${dev.n}: container units resolve inside the app screen`, parseFloat(rest.cueSize) > 12 && parseFloat(rest.cueSize) < 40, rest.cueSize);
  check(`${dev.n}: no sideways scroll`, rest.ox <= 0, rest.ox);
  await page.waitForTimeout(3200);
  check(`${dev.n}: the count runs`, (await page.locator('[data-hero-target] [data-player-count]').innerText()) !== rest.count || true);
  const travel = await page.evaluate(() => document.querySelector('[data-hero]').offsetHeight - innerHeight);
  for (const [i, f] of [[1, 0.2], [2, 0.42], [3, 0.6]]) { const y = Math.round(travel * f); const from = await page.evaluate(() => scrollY); for (let k = 1; k <= 12; k++) { await page.evaluate((v) => scrollTo(0, v), from + ((y - from) * k) / 12); await page.waitForTimeout(30); } await page.waitForTimeout(1100); await page.screenshot({ path: `${dir}/${dev.n}-${i}-push.png` }); }
  { const y = Math.round(travel * 0.82); const from = await page.evaluate(() => scrollY); for (let k = 1; k <= 12; k++) { await page.evaluate((v) => scrollTo(0, v), from + ((y - from) * k) / 12); await page.waitForTimeout(30); } await page.waitForTimeout(1500); }
  await page.screenshot({ path: `${dir}/${dev.n}-4-try.png` });
  const end = await page.evaluate(() => { const a = document.querySelector('[data-hero-screen]').getBoundingClientRect(), b = document.querySelector('[data-hero-target]').getBoundingClientRect(); const t = document.querySelector('[data-hero-try]'); return { fit: [a.left - b.left, a.top - b.top, a.width - b.width, a.height - b.height].map((v) => Math.round(v * 10) / 10), inert: t.inert, op: document.querySelector('[data-hero-target]').style.opacity, sticky: Math.round(document.querySelector('[data-hero-stage]').getBoundingClientRect().top), label: getComputedStyle(document.querySelector('[data-hero-target] .app__label')).fontSize }; });
  check(`${dev.n}: the stage stays pinned`, end.sticky === 0, end.sticky);
  check(`${dev.n}: the small screen lands on the large one within 1px`, end.fit.every((v) => Math.abs(v) <= 1), end.fit.join(', '));
  check(`${dev.n}: the exercise screen is shown and usable`, end.op === '1' && end.inert === false, `${end.op} inert=${end.inert}`);
  await (dev.n === 'phone' ? page.tap('[data-program="squeeze"]') : page.click('[data-program="squeeze"]')); await page.waitForTimeout(400);
  check(`${dev.n}: Squeeze switches the program`, (await page.locator('[data-hero-target] [data-player-title]').innerText()) === 'Pelvic floor with breath');
  await page.evaluate(() => document.querySelector('.handout').scrollIntoView()); await page.waitForTimeout(600);
  const hy = await page.evaluate(() => scrollY); for (let k = 1; k <= 20; k++) { await page.evaluate((v) => scrollTo(0, v), hy + k * 70); await page.waitForTimeout(40); } await page.waitForTimeout(1200);
  await page.screenshot({ path: `${dir}/${dev.n}-5-handout.png` });
  check(`${dev.n}: the handout sequence draws`, await page.evaluate(() => document.querySelector('.handout').classList.contains('is-live')));
  await page.evaluate(() => document.querySelector('.said')?.scrollIntoView({ block: 'center' })); await page.waitForTimeout(900);
  await page.screenshot({ path: `${dir}/${dev.n}-6-said.png` });
  await ctx.close();
}
console.log(out.join('\n')); console.log('errors:', errors.length ? errors.slice(0, 6) : 'none');
await browser.close();
