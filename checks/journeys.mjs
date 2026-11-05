// Walk the five visitor journeys end to end, on desktop and on a phone, clicking real links.
// usage: node journeys.mjs <base-url> <shots-dir>
import { chromium } from 'playwright';
import fs from 'node:fs';
const CHROME = process.env.CHROME_PATH || undefined; // unset: Playwright's own Chromium
const base = process.argv[2] || 'http://127.0.0.1:4330';
const dir = process.argv[3];
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, args: ['--autoplay-policy=no-user-gesture-required'] });
const results = [];
const errors = [];

for (const device of [
  { name: 'desktop', opts: { viewport: { width: 1440, height: 900 } } },
  { name: 'phone', opts: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
]) {
  const ctx = await browser.newContext(device.opts);
  const phone = device.name === 'phone';
  const step = (journey, name, ok, detail = '') => results.push({ device: device.name, journey, step: name, ok: !!ok, detail: String(detail).slice(0, 140) });
  const open = async () => { const page = await ctx.newPage(); page.on('pageerror', (e) => errors.push(`${device.name}: ${e.message}`)); page.on('console', (m) => { if (m.type() === 'error') errors.push(`${device.name}: ${m.text()}`); }); page.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(base)) errors.push(`${device.name}: ${r.status()} ${r.url()}`); }); return page; };
  const nav = async (page, label) => { // use the visible navigation the way a visitor would
    // The header steps aside on the way down; scrolling up a little brings it back.
    if (await page.evaluate(() => scrollY > 100)) { await page.evaluate(() => scrollBy(0, -160)); await page.waitForTimeout(700); }
    if (phone) { await page.tap('.menu summary'); await page.waitForTimeout(250); await page.locator('.menu__sheet a', { hasText: label }).first().tap(); }
    else await page.locator('.site-nav a', { hasText: label }).first().click();
    await page.waitForLoadState('load'); await page.waitForTimeout(500);
  };
  const act = (page, loc) => (phone ? loc.tap() : loc.click());
  const path = (page) => new URL(page.url()).pathname + new URL(page.url()).hash;

  { // 1. A clinician reads what Pelvy does and costs, then books a demo
    const J = '1 clinician books a demo'; const page = await open();
    await page.goto(base + '/'); await page.waitForTimeout(1200);
    step(J, 'home opens with the promise and a Book a demo action', await page.locator('h1', { hasText: 'Squeeze or let go' }).isVisible() && await page.locator('.hero__copy a.btn', { hasText: 'Book a demo' }).isVisible());
    await nav(page, 'For clinicians');
    step(J, 'navigation reaches the clinicians page', path(page) === '/clinicians-and-specialists/', path(page));
    const cost = await page.locator('.costs').innerText();
    step(J, 'the price is stated: $20 a month, six months free for patients', /\$20/.test(cost) && /six months/.test(cost));
    await page.screenshot({ path: `${dir}/${device.name}-1-clinicians.png` });
    await act(page, page.locator('.page-head a.btn', { hasText: 'Book a demo' }));
    await page.waitForLoadState('load'); await page.waitForTimeout(400);
    step(J, 'Book a demo reaches the sign-up form', path(page) === '/sign-up/', path(page));
    await page.fill('#s-name', 'Dr Sam Example'); await page.fill('#s-email', 'sam@example.clinic'); await page.fill('#s-country', 'Australia'); await page.fill('#s-clinic', 'Example Pelvic Health');
    await page.locator('input[name="live-demo"]').check();
    await act(page, page.locator('[data-form-submit]')); await page.waitForTimeout(400);
    const href = await page.locator('[data-form-again]').getAttribute('href');
    const body = decodeURIComponent((href || '').split('&body=')[1] || '');
    step(J, 'the form writes an email to Amelia with the clinic and the live demo request', href?.startsWith('mailto:amelia@pelvy.app?subject=Pelvy%20sign%20up') && /Clinic name: Example Pelvic Health/.test(body) && /Live demo with Amelia: Yes/.test(body), body.replace(/\n/g, ' | '));
    step(J, 'it says plainly that nothing has been sent from the page', /nothing has been sent/i.test(await page.locator('[data-form-status]').innerText()));
    await page.screenshot({ path: `${dir}/${device.name}-1-signup-done.png` });
    await page.close();
  }
  { // 2. A patient understands the app and goes to a store
    const J = '2 patient gets the app'; const page = await open();
    await page.goto(base + '/'); await page.waitForTimeout(1200);
    await act(page, page.locator('.hero__copy a', { hasText: 'get the app' }));
    await page.waitForTimeout(1400);
    const box = await page.locator('#get-the-app').boundingBox();
    step(J, '"I\'m a patient: get the app" lands on the store links', path(page) === '/#get-the-app' && box && box.y > -50 && box.y < (phone ? 700 : 760), `${path(page)} y=${Math.round(box?.y ?? -1)}`);
    const links = await page.locator('#get-the-app a').evaluateAll((as) => as.map((a) => a.href));
    step(J, 'both store links are the real listings', links.includes('https://apps.apple.com/us/app/pelvy-patient/id6752825827') && links.includes('https://play.google.com/store/apps/details?id=app.pelvy.patient_app'), links.join(' '));
    await page.screenshot({ path: `${dir}/${device.name}-2-get-the-app.png` });
    await nav(page, 'For you');
    step(J, 'navigation reaches the page for patients', path(page) === '/general-users/', path(page));
    const text = await page.locator('main').innerText();
    step(J, 'both prices are stated: free for six months with a clinic, $4.99 or $19.99 alone', /\$4\.99/.test(text) && /\$19\.99/.test(text) && /first six months/.test(text));
    step(J, 'it says when to see a physio', /see a pelvic health physio/.test(text));
    await page.locator('[data-program="squeeze"]').scrollIntoViewIfNeeded(); await act(page, page.locator('[data-program="squeeze"]')); await page.waitForTimeout(500);
    step(J, 'the exercise screen can be tried: Squeeze switches the program', (await page.locator('[data-player-title]').first().innerText()) === 'Pelvic floor with breath');
    await page.screenshot({ path: `${dir}/${device.name}-2-for-you-player.png` });
    await page.close();
  }
  { // 3. A GP or specialist finds the QR code route
    const J = '3 GP finds the QR route'; const page = await open();
    await page.goto(base + '/'); await page.waitForTimeout(800);
    const link = page.locator('a', { hasText: 'How recommending works' });
    await link.scrollIntoViewIfNeeded(); await page.waitForTimeout(700); await act(page, link);
    await page.waitForLoadState('load'); await page.waitForTimeout(900);
    const y = (await page.locator('#recommend').boundingBox())?.y;
    step(J, 'the link lands on the recommend section', path(page) === '/clinicians-and-specialists/#recommend' && y > -60 && y < 500, `${path(page)} y=${Math.round(y)}`);
    const mail = await page.locator('#recommend a[href^="mailto:"]').getAttribute('href');
    step(J, 'it offers the printable QR sheet by email to Amelia', mail?.startsWith('mailto:amelia@pelvy.app?subject=QR'), mail);
    step(J, 'it states the price the patient pays', /\$4\.99 a month or \$19\.99 a year/.test(await page.locator('#recommend').innerText()));
    await page.screenshot({ path: `${dir}/${device.name}-3-recommend.png` });
    await page.close();
  }
  { // 4. Someone looks for a clinic that uses Pelvy
    const J = '4 find a clinic'; const page = await open();
    await page.goto(base + '/'); await page.waitForTimeout(800);
    await nav(page, 'Find a clinic');
    step(J, 'navigation reaches the directory', path(page) === '/clinicians-directory/', path(page));
    step(J, 'all 65 clinics are listed', (await page.locator('[data-clinic]').count()) === 65);
    await page.fill('[data-dir-q]', 'adelaide'); await page.waitForTimeout(250);
    const n = await page.locator('[data-clinic]:visible').count();
    step(J, 'searching "adelaide" narrows the list', n >= 1 && n <= 6 && (await page.locator('[data-clinic]:visible h2').first().innerText()).length > 0, `${n} showing`);
    const first = page.locator('[data-clinic]:visible').first();
    await act(page, first.locator('details summary')); await page.waitForTimeout(250);
    step(J, 'a clinic opens to show credentials and telehealth', /Credentials/.test(await first.locator('details').innerText()) && /Telehealth/.test(await first.locator('details').innerText()));
    const site = await first.locator('a.link-strong').getAttribute('href');
    step(J, 'the clinic\'s own website link is a real address', /^https:\/\/[a-z0-9.-]+\//.test(site || ''), site);
    await page.screenshot({ path: `${dir}/${device.name}-4-directory.png` });
    await page.close();
  }
  { // 5. Anyone sends Amelia an enquiry
    const J = '5 enquiry'; const page = await open();
    await page.goto(base + '/about/'); await page.waitForTimeout(600);
    const foot = page.locator('.site-footer a', { hasText: 'Contact Amelia' });
    await foot.scrollIntoViewIfNeeded(); await page.waitForTimeout(600); await act(page, foot);
    await page.waitForLoadState('load'); await page.waitForTimeout(400);
    step(J, 'the footer reaches the contact page', path(page) === '/contact-us/', path(page));
    await act(page, page.locator('[data-form-submit]')); await page.waitForTimeout(200);
    step(J, 'sending it empty says what is needed, in one place', /4 things need fixing/.test(await page.locator('[data-form-errors]').innerText()));
    await page.fill('#c-name', 'Jo Example'); await page.fill('#c-email', 'jo@example.com'); await page.fill('#c-country', 'Australia'); await page.fill('#c-message', 'Does Pelvy work on older phones?');
    await page.locator('input[name="about"][value="Help with the app"]').check();
    await act(page, page.locator('[data-form-submit]')); await page.waitForTimeout(400);
    const href = await page.locator('[data-form-again]').getAttribute('href');
    const body = decodeURIComponent((href || '').split('&body=')[1] || '');
    step(J, 'the form writes the email to Amelia with the message', href?.startsWith('mailto:amelia@pelvy.app?subject=Pelvy%20website%20enquiry') && /About: Help with the app/.test(body) && /older phones/.test(body), body.replace(/\n/g, ' | '));
    step(J, 'direct contact details are on the page', /amelia@pelvy\.app/.test(await page.locator('.contact__aside').innerText()) && /\+61 456 585 447/.test(await page.locator('.contact__aside').innerText()));
    await page.screenshot({ path: `${dir}/${device.name}-5-contact-done.png` });
    await page.close();
  }
  { // every page answers, has one h1, and does not scroll sideways
    const J = '0 every route'; const page = await open();
    const routes = ['/', '/about/', '/blog/', '/clinician-faqs/', '/clinicians-and-specialists/', '/clinicians-directory/', '/contact-us/', '/features/', '/general-user-faqs/', '/general-users/', '/privacy-policy/', '/sign-up/', '/pelvy-launch-party-perth-wa/', '/queensland-health-pilot-opportunity-could-pelvy-support-your-patients/'];
    const bad = [];
    for (const r of routes) {
      const res = await page.goto(base + r); await page.waitForTimeout(250);
      const info = await page.evaluate(() => ({ h1: document.querySelectorAll('h1').length, ox: document.documentElement.scrollWidth - innerWidth, hidden: [...document.querySelectorAll('main [data-rise]')].length }));
      if (res.status() !== 200 || info.h1 !== 1 || info.ox > 0) bad.push(`${r} ${res.status()} h1=${info.h1} overflow=${info.ox}`);
    }
    step(J, 'all 14 live addresses answer with one h1 and no sideways scroll', bad.length === 0, bad.join('; '));
    const before = errors.length;
    const res = await page.goto(base + '/no-such-page/');
    step(J, 'an unknown address gives a 404 page with ways on', res.status() === 404 && await page.locator('h1', { hasText: 'isn’t here' }).isVisible());
    errors.length = before; // that 404 was asked for
    await page.close();
  }
  await ctx.close();
}
await browser.close();
const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  [${r.device}] ${r.journey}: ${r.step}${r.ok ? '' : '  [' + r.detail + ']'}`);
console.log(`\n${results.length - failed.length} of ${results.length} steps passed. Console, page and request errors: ${errors.length ? errors.slice(0, 8).join(' | ') : 'none'}`);
fs.writeFileSync(`${dir}/journeys.json`, JSON.stringify({ base, when: new Date().toISOString(), passed: results.length - failed.length, total: results.length, errors, results }, null, 1));
process.exit(failed.length || errors.length ? 1 : 0);
