// Walk the things a visitor can operate, by pointer, touch and keyboard.
import { chromium } from 'playwright';
const CHROME = process.env.CHROME_PATH || undefined; // unset: Playwright's own Chromium
const browser = await chromium.launch({ executablePath: CHROME, args: ['--autoplay-policy=no-user-gesture-required'] });
const base = process.argv[2] || 'http://127.0.0.1:4322';
const out = [];
const check = (name, ok, detail = '') => out.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail !== '' ? '  [' + detail + ']' : ''}`);
const errors = [];
const watch = (page) => { page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); }); };
const scrollTo = async (page, y) => { const from = await page.evaluate(() => scrollY); const n = Math.max(1, Math.ceil(Math.abs(y - from) / 100)); for (let i = 1; i <= n; i++) { await page.evaluate((v) => scrollTo(0, v), from + ((y - from) * i) / n); await page.waitForTimeout(14); } await page.waitForTimeout(900); };

{ // desktop, normal motion
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } }); watch(page);
  await page.goto(base + '/'); await page.waitForTimeout(2200);
  const big = '[data-hero-target] [data-player]';
  const snap = () => page.evaluate((sel) => { const r = document.querySelector(sel); return { phase: r.dataset.phase, count: r.querySelector('[data-player-count]').textContent, rep: r.querySelector('[data-player-rep]').textContent, title: r.querySelector('[data-player-title]').textContent, s: r.style.getPropertyValue('--s') }; }, big);
  const a = await snap(); await page.waitForTimeout(3400); const b = await snap();
  check('player: counts by itself at rest', a.count !== b.count || a.phase !== b.phase, `${a.phase} ${a.count} -> ${b.phase} ${b.count}`);
  const mini = await page.evaluate(() => { const m = document.querySelector('[data-hero-screen] [data-player]'), g = document.querySelector('[data-hero-target] [data-player]'); return m.dataset.phase === g.dataset.phase && m.querySelector('[data-player-count]').textContent === g.querySelector('[data-player-count]').textContent; });
  check('player: the small screen in the room and the large one agree', mini);
  check('hero: video is playing', await page.evaluate(() => { const v = document.querySelector('[data-hero-video]'); return !v.paused && v.currentTime > 0; }));

  // push-in geometry: at the end the small screen sits exactly on the large one
  const end = await page.evaluate(() => { const h = document.querySelector('[data-hero]'); return h.offsetTop + (h.offsetHeight - innerHeight) * 0.8; });
  await scrollTo(page, end * 0.42);
  const mid = await page.evaluate(() => { const p = document.querySelector('[data-hero-ground]'); return { clip: p.style.clipPath, photo: document.querySelector('[data-hero-photo]').style.opacity, world: document.querySelector('[data-hero-world]').style.transform }; });
  check('hero: part way, the ground has opened and the room has scaled', /inset\(0(\.00)?px/.test(mid.clip) && /scale\(1\.[1-9]/.test(mid.world), `${mid.clip} | ${mid.world}`);
  await scrollTo(page, end * 0.7);
  const fit = await page.evaluate(() => { const a = document.querySelector('[data-hero-screen]').getBoundingClientRect(), b = document.querySelector('[data-hero-target]').getBoundingClientRect(); return [a.left - b.left, a.top - b.top, a.width - b.width, a.height - b.height].map((v) => Math.round(v * 10) / 10); });
  await scrollTo(page, end);
  const fit2 = await page.evaluate(() => { const a = document.querySelector('[data-hero-screen]').getBoundingClientRect(), b = document.querySelector('[data-hero-target]').getBoundingClientRect(); return [a.left - b.left, a.top - b.top, a.width - b.width, a.height - b.height].map((v) => Math.round(v * 10) / 10); });
  check('hero: at the end the small screen lands on the large one within 1px', fit2.every((v) => Math.abs(v) <= 1), `${fit2.join(', ')} (earlier ${fit.join(', ')})`);
  check('hero: the large screen and its controls are showing', await page.evaluate(() => Number(document.querySelector('[data-hero-target]').style.opacity) === 1 && document.querySelector('[data-hero-try]').classList.contains('is-on')));
  check('hero: the room clip is paused once it is out of sight', await page.evaluate(() => document.querySelector('[data-hero-video]').paused));

  // the switch
  await page.click('[data-program="squeeze"]'); await page.waitForTimeout(300);
  const sq = await snap();
  check('switch: Squeeze changes the program and restarts the count', sq.title === 'Pelvic floor with breath' && sq.rep === '1' && sq.phase === 'in', JSON.stringify(sq));
  check('switch: pressed state follows', await page.evaluate(() => document.querySelector('[data-program="squeeze"]').getAttribute('aria-pressed') === 'true' && document.querySelector('[data-program="letgo"]').getAttribute('aria-pressed') === 'false'));
  await page.waitForTimeout(5300); const sq2 = await snap();
  check('switch: Squeeze reaches the slate out-breath with its cue', sq2.phase === 'out' && /Squeeze your pelvic floor/.test(await page.locator(big + ' [data-player-cue]').innerText()), sq2.phase);
  // pause
  await page.click(big + ' [data-player-toggle]'); const p1 = await snap(); await page.waitForTimeout(2300); const p2 = await snap();
  check('pause: the count stops and the disc holds its size', p1.count === p2.count && p1.s === p2.s && p1.phase === p2.phase, `${p1.count}/${p1.s} -> ${p2.count}/${p2.s}`);
  check('pause: the button now says Start', (await page.locator(big + ' [data-player-toggle-label]').innerText()) === 'Start');
  // leaving and coming back must not restart something a person stopped
  await scrollTo(page, end + 2600); await scrollTo(page, end); const p3 = await snap();
  check('pause: scrolling away and back does not restart it', p3.count === p2.count && p3.phase === p2.phase, `${p2.count} -> ${p3.count}`);
  await page.click(big + ' [data-player-toggle]'); await page.waitForTimeout(1300); const p4 = await snap();
  check('pause: Start resumes from where it stopped', p4.phase === p2.phase ? Number(p4.count) <= Number(p2.count) : true, `${p2.phase} ${p2.count} -> ${p4.phase} ${p4.count}`);
  // rapid switching
  for (let i = 0; i < 12; i++) await page.click(i % 2 ? '[data-program="squeeze"]' : '[data-program="letgo"]', { delay: 0 });
  await page.waitForTimeout(400); const r = await snap();
  check('switch: twelve rapid switches leave a sane state', r.title === 'Pelvic floor with breath' && r.rep === '1' && ['in', 'hold', 'out'].includes(r.phase), JSON.stringify(r));

  // hub tabs
  await page.locator('[data-hub]').scrollIntoViewIfNeeded(); await page.waitForTimeout(600);
  await page.click('[data-hub-tab="videos"]');
  check('hub: Videos tab shows the video list and hides programs', await page.locator('#hub-videos').isVisible() && await page.locator('#hub-programs').isHidden());
  await page.keyboard.press('ArrowRight');
  check('hub: arrow key moves to Learn and focus follows', await page.locator('#hub-learn').isVisible() && await page.evaluate(() => document.activeElement?.dataset.hubTab === 'learn'));
  await page.click('[data-hub-go="programs"]');
  check('hub: the list beside the screen drives the tabs', await page.locator('#hub-programs').isVisible() && await page.evaluate(() => document.querySelector('[data-hub-tab="programs"]').getAttribute('aria-selected') === 'true'));

  // quotes row scrolls sideways by keyboard
  await page.focus('.said__row'); const q0 = await page.evaluate(() => document.querySelector('.said__row').scrollLeft); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(500);
  check('quotes: the row scrolls with the arrow keys', (await page.evaluate(() => document.querySelector('.said__row').scrollLeft)) > q0);
  await page.close();
}
{ // keyboard: Tab walks from the opening into the exercise screen and back
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } }); watch(page);
  await page.goto(base + '/'); await page.waitForTimeout(1500);
  const where = () => page.evaluate(() => { const el = document.activeElement; const r = el.getBoundingClientRect(); let o = 1; for (let n = el; n && n !== document.body; n = n.parentElement) o *= Number(getComputedStyle(n).opacity); return { name: el.getAttribute('data-program') || (el.hasAttribute('data-player-toggle') ? 'pause' : el.hasAttribute('data-motion-toggle') ? 'motion' : el.className || el.tagName), inTry: !!el.closest('[data-hero-try]'), opacity: Math.round(o * 100) / 100, inView: r.top >= 0 && r.bottom <= innerHeight && r.width > 0, y: Math.round(scrollY) }; });
  check('keyboard: the exercise controls cannot be focused or pressed before they show', await page.evaluate(() => document.querySelector('[data-hero-try]').inert === true));
  await page.focus('[data-motion-toggle]');
  const order = [];
  for (let i = 0; i < 3; i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(250); order.push(await where()); }
  check('keyboard: Tab goes Pause, Let go, Squeeze, each fully shown and in view', order.map((o) => o.name).join(',') === 'pause,letgo,squeeze' && order.every((o) => o.inTry && o.opacity === 1 && o.inView), JSON.stringify(order));
  await page.keyboard.press('Enter'); await page.waitForTimeout(300);
  check('keyboard: Enter on Squeeze switches the program', (await page.locator('[data-hero-target] [data-player-title]').innerText()) === 'Pelvic floor with breath');
  check('keyboard: the change is announced in a live region', /Pelvic floor with breath, started/.test(await page.locator('[data-hero-target] [role="status"]').innerText()));
  await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Shift+Tab'); await page.waitForTimeout(200);
  await page.keyboard.press('Shift+Tab'); await page.waitForTimeout(400);
  const back = await where();
  check('keyboard: Shift+Tab from Pause returns to the opening, back at the top', back.name === 'motion' && back.opacity === 1 && back.inView && back.y === 0, JSON.stringify(back));
  await page.close();
}
{ // reduced motion
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const page = await ctx.newPage(); watch(page);
  await page.goto(base + '/'); await page.waitForTimeout(1500);
  const big = '[data-hero-target] [data-player]';
  const c1 = await page.locator(big + ' [data-player-count]').innerText(); await page.waitForTimeout(3300); const c2 = await page.locator(big + ' [data-player-count]').innerText();
  check('reduced motion: nothing counts or plays by itself', c1 === c2 && await page.evaluate(() => !document.querySelector('[data-hero]').classList.contains('hero--live') && !document.querySelector('[data-hero-video]').getAttribute('src')), `${c1} -> ${c2}`);
  await page.locator(big + ' [data-player-toggle]').scrollIntoViewIfNeeded(); await page.click(big + ' [data-player-toggle]'); await page.waitForTimeout(3400);
  const c3 = await page.evaluate((sel) => { const r = document.querySelector(sel); return r.dataset.phase + r.querySelector('[data-player-count]').textContent + '|' + getComputedStyle(r.querySelector('.app__disc')).transform; }, big);
  check('reduced motion: Start still counts, without the disc scaling', !c3.startsWith('in3') && c3.endsWith('none'), c3);
  check('reduced motion: nothing is left hidden', await page.evaluate(() => [...document.querySelectorAll('[data-rise]')].every((e) => getComputedStyle(e).opacity === '1')));
  await ctx.close();
}
{ // phone: menu and directory filter
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }); const page = await ctx.newPage(); watch(page);
  await page.goto(base + '/clinicians-directory/'); await page.waitForTimeout(800);
  await page.tap('.menu summary'); await page.waitForTimeout(300);
  check('menu: opens on a tap and shows the links', await page.locator('.menu__sheet a[href="/general-users/"]').isVisible());
  await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  check('menu: Escape closes it', await page.evaluate(() => !document.querySelector('[data-menu]').open));
  await page.fill('[data-dir-q]', 'perth telehealth'); await page.waitForTimeout(200);
  const n1 = await page.locator('[data-dir-count]').innerText(); const shown = await page.locator('[data-clinic]:visible').count();
  check('directory: search narrows the list and the count agrees', shown > 0 && shown < 65 && n1.startsWith(String(shown)), `${n1}, ${shown} showing`);
  await page.fill('[data-dir-q]', 'zzzz no such clinic'); await page.waitForTimeout(200);
  check('directory: no match says so and offers a way on', await page.locator('[data-dir-none]').isVisible() && (await page.locator('[data-dir-count]').innerText()) === '0 clinics');
  await page.fill('[data-dir-q]', ''); await page.selectOption('[data-dir-region]', 'WA'); await page.check('[data-dir-tele]'); await page.waitForTimeout(200);
  const wa = await page.locator('[data-clinic]:visible').count();
  check('directory: state and telehealth filters combine', wa > 0 && wa < 20 && await page.evaluate(() => [...document.querySelectorAll('[data-clinic]:not([hidden])')].every((e) => e.dataset.region === 'WA' && e.dataset.tele === '1')), String(wa));
  await page.locator('.clinic:not([hidden]) details summary').first().tap(); await page.waitForTimeout(200);
  check('directory: a clinic opens to show its details', await page.locator('.clinic:not([hidden]) details[open] dl').first().isVisible());
  check('phone: no sideways scroll', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await ctx.close();
}
console.log(out.join('\n'));
console.log('console/page errors:', errors.length ? errors.slice(0, 6) : 'none');
await browser.close();
