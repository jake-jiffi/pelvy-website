import { chromium } from 'playwright';
const CHROME = process.env.CHROME_PATH || undefined; // unset: Playwright's own Chromium
const browser = await chromium.launch({ executablePath: CHROME });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }); const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 }); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await page.addInitScript(() => { window.__shifts = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__shifts.push({ t: Math.round(e.startTime), v: Math.round(e.value * 1000) / 1000, src: e.sources.slice(0, 4).map((s) => (s.node?.className || s.node?.nodeName || '?') + ' ' + Math.round(s.previousRect.y) + '>' + Math.round(s.currentRect.y) + ' h' + Math.round(s.previousRect.height) + '>' + Math.round(s.currentRect.height)) }); }).observe({ type: 'layout-shift', buffered: true }); });
await page.goto((process.argv[2] || 'http://127.0.0.1:4330') + (process.argv[3] || '/'), { waitUntil: 'load' });
await page.waitForTimeout(4000);
console.log(JSON.stringify(await page.evaluate(() => ({ shifts: window.__shifts, fonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family + ' ' + f.weight).slice(0, 8) })), null, 1));
await browser.close();
