# Checks

Browser checks for the built site. They are plain scripts, not a test framework. Each prints `PASS` or `FAIL` lines.

## Set up

```bash
cd checks
npm install
npx playwright install chromium webkit
```

## Run everything

Start both previews from the site folder, in two terminals:

```bash
npm run dev -- --port 4322
```

```bash
npm run build && npm run preview -- --port 4330
```

Then, from the site folder:

```bash
sh checks/run-all.sh
```

It rebuilds the site, runs each check and prints one line per check. Full output lands in `checks/results/`, which git ignores.

## What each script does

| Script | What it checks |
| --- | --- |
| `behaviours.mjs` | The home page's moving parts: the push-in, the exercise screen, the switch, the tabs, the quotes, keyboard paths, reduced motion, no JavaScript. |
| `forms.mjs` | Both forms against hostile and empty input. Uses the dev server on 4322. Sends nothing. |
| `journeys.mjs` | The visitor journeys, page to page: a clinician booking a demo, a patient getting the app, finding a clinic, reading the FAQs. |
| `webkit.mjs` | The same walk in WebKit, Safari's engine, at phone and desktop sizes. |
| `r2hero.mjs` | The opening at short phone sizes: the count label fits, the app is in the first screen, nothing collides. |
| `cls.mjs`, `perf.mjs` | Layout shift and load timings on a throttled phone. |
| `shot.mjs` | Scripted scroll and screenshots from a JSON spec. Read the top of the file for the format. |
| `tools/audit_dist.py` | SEO on the built pages: titles, descriptions, canonicals, headings, alt text, links, sitemap. |
| `tools/copy_scan.py` | The brand's banned words, em dashes and exclamation marks in the built pages. Clinic names trip it; that is expected. |
| `tools/screen_quad.py` | Measures the phone screen's four corners in the room clip. Run it again if that clip is ever replaced. |
| `tools/parse_directory.py` | Rebuilds `src/data/clinics.json` from a saved copy of the live directory page. |

Set `CHROME_PATH` to use a Chrome you already have. Leave it unset and Playwright uses its own.

## State on 12 October 2026

Every script passed against the build made at 17:22 that day. The scripts were moved into this folder afterwards. `behaviours.mjs` was run again from here and passed, 34 of 34. The others have not been run from here, and `webkit.mjs` will not run until the matching WebKit build is installed.

If a check asserts something you have changed on purpose, change the assertion.
