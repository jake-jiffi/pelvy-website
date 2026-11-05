// Attack the enquiry forms: empty, wrong, hostile and long input, both audiences.
import { chromium } from 'playwright';
const CHROME = process.env.CHROME_PATH || undefined; // unset: Playwright's own Chromium
const browser = await chromium.launch({ executablePath: CHROME });
const base = 'http://127.0.0.1:4322';
const out = [];
const check = (name, ok, detail = '') => out.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  [' + detail + ']' : ''}`);

{ // contact: empty submit
  const page = await browser.newPage();
  await page.goto(base + '/contact-us/');
  await page.waitForTimeout(500);
  await page.click('[data-form-submit]');
  const errs = await page.locator('[data-form-errors]').innerText();
  check('contact: empty submit lists the four needed fields', /4 things/.test(errs) && /Your name/.test(errs) && /Email/.test(errs) && /Country/.test(errs) && /Your message/.test(errs), errs.replace(/\n/g, ' | '));
  check('contact: focus moves to the error summary', await page.evaluate(() => document.activeElement?.hasAttribute('data-form-errors')));
  check('contact: nothing claims to have been sent', await page.locator('[data-form-status]').isHidden());
  // wrong email
  await page.fill('#c-name', 'Test Person'); await page.fill('#c-email', 'not-an-email'); await page.fill('#c-country', 'Australia'); await page.fill('#c-message', 'hello');
  await page.click('[data-form-submit]');
  const e2 = await page.locator('[data-form-errors]').innerText();
  check('contact: a malformed email is caught', /One thing/.test(e2) && /Email: check this/.test(e2), e2.replace(/\n/g, ' | '));
  // hostile and unicode input
  let nav = null;
  await page.exposeFunction('__nav', (u) => { nav = u; });
  await page.evaluate(() => { const d = Object.getOwnPropertyDescriptor(window.Location.prototype, 'href'); Object.defineProperty(window.location, 'href', { configurable: true, get: () => d.get.call(window.location), set: (v) => window.__nav(v) }); }).catch(() => {});
  await page.fill('#c-email', 'someone@example.com');
  await page.fill('#c-message', 'Line one\nLine two & more <script>alert(1)</script> "quoted" naïve ☺ 100% ?subject=hijack&bcc=x@y.z');
  await page.click('[data-form-submit]');
  await page.waitForTimeout(400);
  const status = await page.locator('[data-form-status]').innerText();
  check('contact: says the email app should have opened and that nothing was sent', /email app should have opened/.test(status) && /nothing has been sent/i.test(status), status.replace(/\n/g, ' | ').slice(0, 160));
  check('contact: no script from the message runs or is injected', await page.evaluate(() => !document.querySelector('[data-form-status] script') && !document.querySelector('[data-form-errors] script')));
  const href = await page.evaluate(() => document.querySelector('[data-form-status] a[href^="mailto:"]')?.getAttribute('href'));
  check('contact: retry link goes only to amelia@pelvy.app', href?.startsWith('mailto:amelia@pelvy.app?subject=') && new URLSearchParams(href.split('?')[1]).has('body') && !new URLSearchParams(href.split('?')[1]).has('bcc'), href?.slice(0, 60));
  await page.close();
}
{ // the composed mailto itself
  const page = await browser.newPage();
  await page.goto(base + '/contact-us/');
  await page.waitForTimeout(400);
  await page.fill('#c-name', 'A & B'); await page.fill('#c-email', 'a@b.co'); await page.fill('#c-country', 'Australia');
  await page.fill('#c-message', 'x'.repeat(1500) + '\nend ?&bcc=evil@x.y');
  check('contact: the message box stops at 1500 characters', (await page.inputValue('#c-message')).length === 1500);
  await page.evaluate(() => { const m = document.querySelector('#c-message'); m.removeAttribute('maxlength'); m.value = 'x'.repeat(1480) + '\n?&bcc=evil@x.y'; });
  await page.click('[data-form-submit]');
  await page.waitForTimeout(300);
  const url = await page.evaluate(() => document.querySelector('[data-form-again]')?.getAttribute('href'));
  const ok = typeof url === 'string' && url.startsWith('mailto:amelia@pelvy.app?subject=Pelvy%20website%20enquiry&body=');
  check('contact: mailto is addressed to Amelia with the subject set', ok, String(url).slice(0, 90));
  if (ok) {
    const q = url.split('?')[1];
    const params = new URLSearchParams(q);
    check('contact: hostile "&bcc=" in the message stays inside the body', [...params.keys()].join(',') === 'subject,body', [...params.keys()].join(','));
    const body = decodeURIComponent(q.split('&body=')[1]);
    check('contact: body carries every field, labelled', /^Your name: A & B\nEmail: a@b\.co\nCountry: Australia\nAbout: A question about Pelvy\nYour message: x{1480}\n\?&bcc=evil@x\.y$/.test(body), body.slice(0, 90).replace(/\n/g, ' | '));
    check('contact: whole link stays a sane length', url.length < 5200, String(url.length));
  }
  await page.close();
}
{ // sign-up: clinician and patient paths
  const page = await browser.newPage();
  await page.goto(base + '/sign-up/');
  await page.waitForTimeout(400);
  await page.click('[data-form-submit]');
  const e1 = await page.locator('[data-form-errors]').innerText();
  check('sign-up: a clinician must give a clinic name', /Clinic name/.test(e1) && /4 things/.test(e1), e1.replace(/\n/g, ' | '));
  await page.check('input[name="who"][value="patient"]');
  check('sign-up: choosing patient hides the clinic fields', await page.locator('#s-clinic').isHidden() && await page.locator('input[name="live-demo"]').isHidden());
  check('sign-up: choosing patient shows the store links', await page.locator('.signup__patient').isVisible());
  await page.click('[data-form-submit]');
  const e2 = await page.locator('[data-form-errors]').innerText();
  check('sign-up: a patient is not asked for a clinic name', !/Clinic name/.test(e2) && /3 things/.test(e2), e2.replace(/\n/g, ' | '));
  await page.check('input[name="who"][value="clinician"]');
  check('sign-up: switching back restores the clinic fields', await page.locator('#s-clinic').isVisible() && await page.locator('#s-clinic').isEnabled());
  // keyboard only
  await page.fill('#s-name', 'Dr Test'); await page.fill('#s-email', 't@clinic.com.au'); await page.fill('#s-country', 'Australia'); await page.fill('#s-clinic', 'Test Clinic');
  await page.focus('input[name="live-demo"]'); await page.keyboard.press('Space');
  await page.focus('[data-form-submit]'); await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  check('sign-up: keyboard-only submit reaches the status message', await page.locator('[data-form-status]').isVisible());
  await page.close();
}
{ // no JavaScript: native validation still guards the form
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(base + '/contact-us/');
  const info = await page.evaluate(() => 0).catch(() => null);
  const html = await page.content();
  check('no-JS: form posts to mailto and keeps native validation', /action="mailto:amelia@pelvy\.app\?subject=/.test(html) && !/<form[^>]*novalidate/.test(html) && /id="c-name"[^>]*required/.test(html));
  await ctx.close();
}
console.log(out.join('\n'));
await browser.close();
