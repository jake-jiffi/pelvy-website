// Round 2 hero criteria 1 to 4, measured.
import { chromium } from 'playwright';
const CHROME = process.env.CHROME_PATH || undefined; // unset: Playwright's own Chromium
const base = process.argv[2] || 'http://127.0.0.1:4322';
const dir = process.argv[3];
const browser = await chromium.launch({ executablePath: CHROME, args: ['--autoplay-policy=no-user-gesture-required'] });
const out = []; const check = (n, ok, d = '') => out.push(`${ok ? 'PASS' : 'FAIL'}  ${n}  [${d}]`);
const settle = async (page, y) => { const from = await page.evaluate(() => scrollY); const n = Math.max(1, Math.ceil(Math.abs(y - from) / 60)); for (let i = 1; i <= n; i++) { await page.evaluate((v) => scrollTo(0, v), from + ((y - from) * i) / n); await page.waitForTimeout(16); } await page.waitForTimeout(1400); };

// 1. the count label fits its disc
for (const [w, h] of [[320, 568], [360, 640], [375, 620], [375, 667], [390, 664], [393, 659], [390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }); const page = await ctx.newPage();
  await page.goto(base + '/'); await page.waitForTimeout(1800);
  const live = await page.evaluate(() => document.querySelector('[data-hero]').classList.contains('hero--live'));
  if (live) await settle(page, await page.evaluate(() => { const hgt = document.querySelector('[data-hero]'); return Math.round((hgt.offsetHeight - innerHeight) * 0.8); }));
  else { await page.evaluate(() => document.querySelector('[data-hero-target]').scrollIntoView({ block: 'center' })); await page.waitForTimeout(800); }
  await page.waitForFunction(() => document.querySelector('[data-hero-target] [data-player]').dataset.phase === 'out', null, { timeout: 15000 });
  await page.waitForTimeout(300);
  const m = await page.evaluate(() => { const root = document.querySelector('[data-hero-target] [data-player]'); const disc = root.querySelector('.app__disc').getBoundingClientRect(); const lab = root.querySelector('.app__label'); const r = lab.getBoundingClientRect(); const range = document.createRange(); range.selectNodeContents(lab); const rects = [...range.getClientRects()]; const t = range.getBoundingClientRect(); const cx = disc.left + disc.width / 2, cy = disc.top + disc.height / 2, rad = disc.width / 2; const far = Math.max(...[[t.left, t.top], [t.right, t.top], [t.left, t.bottom], [t.right, t.bottom]].map(([x, y]) => Math.hypot(x - cx, y - cy))); const scr = root.getBoundingClientRect(); return { screen: Math.round(scr.width), disc: Math.round(disc.width), text: Math.round(t.width), lines: new Set(rects.map((q) => Math.round(q.top))).size, inside: Math.round((rad - far) * 10) / 10, font: getComputedStyle(lab).fontSize, pauseH: Math.round(root.querySelector('.app__pause').getBoundingClientRect().height), ox: document.documentElement.scrollWidth - innerWidth, bottom: Math.round(scr.bottom), vh: innerHeight }; });
  await page.screenshot({ path: `${dir}/label-${w}x${h}.png` });
  check(`1. ${w}x${h} (${live ? 'pinned' : 'static'}): "Breathe out" on one line, corners 4px or more inside the disc, 24px, Pause 44px`, m.lines === 1 && m.inside >= 4 && parseFloat(m.font) >= 24 && m.pauseH >= 44 && m.ox <= 0, JSON.stringify(m));
  await ctx.close();
}
// 2. the app is in the first phone screen
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 664 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }); const page = await ctx.newPage();
  await page.goto(base + '/'); await page.waitForTimeout(2200);
  const m = await page.evaluate(() => { const b = (s) => { const r = document.querySelector(s).getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom)]; }; return { numeral: b('[data-hero-screen] [data-player-count]'), h1: b('#hero-title'), demo: b('.hero__copy a.btn'), vh: innerHeight, ox: document.documentElement.scrollWidth - innerWidth }; });
  await page.screenshot({ path: `${dir}/first-screen-390x664.png` });
  check('2. 390x664 at rest: numeral, whole headline and Book a demo are in the first screen', m.numeral[0] > 0 && m.numeral[1] <= m.vh && m.h1[0] >= 0 && m.h1[1] <= m.vh && m.demo[1] <= m.vh && m.ox <= 0, JSON.stringify(m));
  await ctx.close();
}
// 3. the header does not cover the heading on the way back up
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }); const page = await ctx.newPage();
  await page.goto(base + '/'); await page.waitForTimeout(1800);
  const y = await page.evaluate(() => { const hgt = document.querySelector('[data-hero]'); return Math.round((hgt.offsetHeight - innerHeight) * 0.9); });
  await settle(page, y); await settle(page, y - 200);
  const m = await page.evaluate(() => { const hd = document.querySelector('[data-header]'); const hr = hd.getBoundingClientRect(); const t = document.querySelector('.try__copy .h1').getBoundingClientRect(); return { headerShown: !hd.classList.contains('is-away'), header: [Math.round(hr.top), Math.round(hr.bottom)], heading: [Math.round(t.top), Math.round(t.bottom)], op: document.querySelector('.try__copy').style.opacity }; });
  await page.screenshot({ path: `${dir}/header-heading-390x844.png` });
  check('3. 390x844, hold then up 200px: the header is back and clear of the heading', m.headerShown && m.heading[0] >= m.header[1], JSON.stringify(m));
  await ctx.close();
}
// 4. no collision at the first notch
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  await page.goto(base + '/'); await page.waitForTimeout(1800);
  for (const y of [60, 120, 180, 240]) {
    await settle(page, y);
    const m = await page.evaluate(() => { const c = document.querySelector('[data-hero-copy]'); const cr = c.getBoundingClientRect(); const g = document.querySelector('[data-hero-ground]'); const st = document.querySelector('[data-hero-stage]').getBoundingClientRect(); const ins = (g.style.clipPath.match(/inset\(([^)]*?) round/) || [])[1].split(' ').map(parseFloat); const edge = st.left + ins[3]; return { opacity: Math.round(Number(c.style.opacity || 1) * 100) / 100, copyRight: Math.round(cr.right), groundLeft: Math.round(edge) }; });
    await page.screenshot({ path: `${dir}/notch-${y}.png` });
    check(`4. 1440x900 settled at y=${y}: copy gone, or the ground's edge is clear of it`, m.opacity <= 0.05 || m.groundLeft >= m.copyRight, JSON.stringify(m));
  }
  await ctx.close();
}
console.log(out.join('\n'));
await browser.close();
