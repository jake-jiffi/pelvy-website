# Builder brief: round 3 of 4, the clinicians page below the note

You are the builder for round 3. Read the critic's recheck first: `.palate/critique/05-recheck-round-2.md` (findings 2 and 3, and its "Brief, round 3"). Then this. Critique 05 scored Design 8.5 against a target of 9. This round is the route to 9, so the work has to be good, not merely compliant.

## What changed since that report (do not undo any of it)

The site owner, Jake, asked for the small labels on the pictures to come off. The coordinator has already done this:

- The captions "A generated room…", "A generated kitchen…", "A generated desk…" and the "The card reads…" block are gone. **Do not add them back, and do not add any new caption, label or small explanatory note to a picture or an app screen.** That is the owner's decision. The existing "A working sample…" lines stay where they are.
- The "Pause motion" text button is now a 44px icon in the picture's corner (`.motion-btn` in `global.css`). The desk loop has one too (`[data-loop-toggle]`, wired in `src/scripts/steps.ts`).
- On phones the home page now shows the sample line under the pinned stage (critic finding 1, done).
- The favicon is the colour mark on white.

**Do not edit:** `src/components/home/Hero.astro`, `src/scripts/hero.ts`, `src/scripts/player.ts`, `src/components/AppPlayer.astro`, `src/components/DeskScene.astro`, `src/components/SetupCard.astro`, `src/layouts/Base.astro`, anything in `public/`, `src/styles/tokens.css`. In `src/scripts/steps.ts` leave the loop block alone (the steps rail below it is yours to reuse). You are the only one editing the site while you work.

## Project

- Path `/Users/jakeshelley/dev/pelvy/website` (Astro 7, static, TypeScript, GSAP + ScrollTrigger). `README.md` has the file map.
- Dev preview: http://127.0.0.1:4322/ . **It serves stale scoped styles after you edit a component's `<style>` block.** If a style change does not show, restart it with `sh /private/tmp/claude-501/-Users-jakeshelley-dev-pelvy/c43f8c3a-5f61-4b57-bef2-790340e507cc/scratchpad/tools/redev.sh` and measure again. Do not start a second dev server.
- Production preview on :4330 serves `dist/`. Run `npm run build` to refresh it. Judge the finished work there.
- The page: `src/pages/clinicians-and-specialists.astro`. Parts you can reuse: `src/components/NoteCard.astro`, `AppHub.astro`, `AppPlayer.astro` (use, do not edit), the program card with its counting ring in `src/components/home/TwoThings.astro` + `src/scripts/count.ts`, and the working parts `src/pages/features.astro` already shows. Home devices: `reading.ts` (lines read in), `ground.ts` (rising ground), `steps.ts` (steps rail), `count.ts` (counting ring), `quotes.ts`. `src/scripts/site.ts` initialises them on every page.

## The brand is locked (`/Users/jakeshelley/dev/pelvy/brand/brand.json`, short version `/Users/jakeshelley/.claude/skills/pelvy-brand/SKILL.md`)

- Colour through the custom properties in `src/styles/global.css` only: `--deep` #41684A (brand, the one main action, white text allowed), `--sage` #78A080 (ground behind app screens and photographs; ink at 24px and up only; never white text), `--sage-soft` #ABC8B1 (ground for the note and reading-size text; never white text), `--slate` #5E6687 (work only; never a button), `--mint`, `--paper`, `--white`, `--ink`, `--muted`, `--line`. No new colours, no gradients.
- Type: Literata (headings and words a person says), DM Sans (everything else), DM Mono (counts, prices, timers). Radii: 22px panels, pills, 10px fields, circles for the count ring. No fourth.
- Motion is "the breath": things rise 8px and settle once; scroll-linked motion that settles. Nothing bounces, nothing loops for decoration.
- The count ring holds only a numeral that is really counting something. Never an icon or a tick. A price is not a count: set "$20" in DM Mono, not in a ring.
- Status never by colour alone. No illustration, no generated people, no stock, no icons used as decoration.
- Voice for any words you touch: plain, steady, specific, sentence case, no exclamation marks, no em dashes, Australian spelling. Never: journey, empower, treats, cure, diagnose, fix, optimise, elevate, simply, wellness.
- **Do not add or change any factual claim.** Facts are in `src/data/site.ts` (`prices.clinicMonthly` is "$20", `prices.patientFreeMonths` is "six"), `src/data/faqs.ts` and `.palate/evidence/claims.md`. Rearranging and re-setting existing copy is fine. If you need words that are not on the page already, take them from those files or leave them out.
- Photograph caps: `src/assets/people/amelia-clinic.jpg` never wider than 600 CSS px; `amelia-portrait.png` never wider than 293 CSS px.

## Work, with acceptance criteria (check at 1440x900 and 390x844)

1. **The clinicians page below the note** (`/clinicians-and-specialists/`, from about y=932 to the closing panel at 1440x900).
   - "$20" is set in DM Mono at 58px or more, with "a month during the pilot" and the six free months inside the same screen. This is the page a clinician reads before paying: the price should be the plainest, largest fact on it. Reference: halo-dental's pricing page gives the price a title about 100px tall and a full-width row.
   - At least two of the four items under "What your patients get in the pilot" are shown as app parts already on file (the note, the program card with its count, the hub, the player), not as text rows.
   - At least one more scroll-linked device from the home page is used where it means something (the steps rail on a real sequence, the rising ground, the counting ring, a reading line). The page already has one reading line and one rising ground at the top.
   - No run of plain text rows longer than about 1,200px without a change of ground, scale or subject.
   - Reads in full with reduced motion and with JavaScript off. Nothing autoplays or counts by itself under reduced motion. Anything that counts or loops stops when it leaves the screen and honours the `pelvy:motion` document event (`detail` true or false), as `count.ts` does.
   - Keep these selectors working, or update `journeys.mjs` and say so: `.page-head a.btn`, `.costs`, `#recommend`.
2. **Optional, same round, only if item 1 is done well.**
   - The clinicians note is fully in ink within 2 seconds of load wherever it sits in the first screen (at 1440x900, 1280x720 and 390x844). At the moment it is caught mid-read.
   - `/` ends on a ground carrying "See it with your own patients in mind." at 44px or more, the way the inner pages end on the sage panel.
   - "Back to search" on `/clinicians-directory/` overlaps no list text at 1440x900.
3. **No regressions.** Zero sideways scroll at 390. No console errors. `npx astro check` 0 errors. `npm run build` gives 15 pages. The four scripts pass. Everything critique 05 marks as met still holds.

Out of scope: the home hero and player, the clips, the favicon, deployment, commits.

## How to test

The shared Playwright MCP browser is locked by another session. Use the isolated browser scripts in
`/private/tmp/claude-501/-Users-jakeshelley-dev-pelvy/c43f8c3a-5f61-4b57-bef2-790340e507cc/scratchpad/pw/`:

- `node shot.mjs <spec.json>` for scripted scroll and screenshots (read it for the spec format: viewport, dpr, touch, mobile, reducedMotion, `js: false`, `warm: true`, steps with `scroll`, `jump`, `click`, `tap`, `press`, `wait`, `eval`, `shot`, `full`). `spec-loop.json` is a recent example.
- After `npm run build`: `node behaviours.mjs http://127.0.0.1:4330`, `node forms.mjs` (dev), `node journeys.mjs http://127.0.0.1:4330 <dir>`, `node webkit.mjs http://127.0.0.1:4330 <dir>`. No `FAIL`, no errors. If you change something a script asserts, update the assertion to the new behaviour and say so.
- Save screenshots under `/Users/jakeshelley/dev/pelvy/website/.palate/critique/round-3/` and look at them with the Read tool before you report: both sizes, normal motion, reduced motion, JavaScript off. Judge them as a designer would and iterate. Compare the page with the home page: it should feel like the same site.

## Report back (under 600 words)

Changed files and what changed in behaviour. For each item: met or not, with the measurement (the "$20" size in px and what shares its screen, which pilot items became app parts, which device was reused and where, the longest run of text rows in px) and the screenshot path that shows it. Results of `npx astro check`, `npm run build` and the four scripts. Anything you could not do and why. Do not deploy and do not commit.
