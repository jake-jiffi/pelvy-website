// Weight and first-paint numbers for the production build, desktop and a throttled phone.
import { chromium } from 'playwright';
const CHROME = process.env.CHROME_PATH || undefined; // unset: Playwright's own Chromium
const browser = await chromium.launch({ executablePath: CHROME });
for (const [name, opts, throttle] of [['desktop', { viewport: { width: 1440, height: 900 } }, false], ['phone, slow 4G, 4x CPU', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, true]]) {
  const ctx = await browser.newContext(opts); const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  if (throttle) { await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 }); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); }
  let bytes = 0; const kinds = {};
  page.on('response', async (r) => { try { const b = (await r.body()).length; bytes += b; const t = r.request().resourceType(); kinds[t] = (kinds[t] || 0) + b; } catch {} });
  await page.addInitScript(() => { window.__lcp = 0; window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
  await page.goto((process.argv[2] || 'http://127.0.0.1:4330') + '/', { waitUntil: 'load' });
  await page.waitForTimeout(4000);
  const m = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: Math.round(window.__cls * 1000) / 1000, fcp: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0), dom: document.querySelectorAll('*').length }));
  console.log(name, JSON.stringify(m), 'transferred before scrolling:', Math.round(bytes / 1024) + 'KB', JSON.stringify(Object.fromEntries(Object.entries(kinds).map(([k, v]) => [k, Math.round(v / 1024) + 'KB']))));
  await ctx.close();
}
await browser.close();
