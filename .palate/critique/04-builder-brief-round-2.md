# Builder brief: round 2 of 4, inner pages, directory, small repairs

You are the builder for round 2. Read the fresh critic's report first: `.palate/critique/03-final-site.md` (its findings N2 and N5, the "Brand and facts" section and its "Builder brief, round 2"). Then this.

The coordinator has already done that brief's items 1 to 4 (count label fit on short phones, the app in the first phone screen, the header clear of the heading, no collision at the first scroll notch) and the Pause button's 44px height. **Do not edit** `src/scripts/hero.ts`, `src/scripts/player.ts`, `src/components/home/Hero.astro` or `src/components/AppPlayer.astro`.

Your items are 5, 6 and the rest of 7.

## Project

- Path: `/Users/jakeshelley/dev/pelvy/website` (Astro 7, static, TypeScript, GSAP + ScrollTrigger). `README.md` has the file map.
- Dev preview, running and hot reloading: http://127.0.0.1:4322/ . Restart only if dead: `npm run preview:live`. Production preview on :4330 serves `dist/` (run `npm run build` to refresh it; do not start another server).
- Inner pages: `src/pages/features.astro`, `about.astro`, `clinicians-and-specialists.astro`, `clinicians-directory.astro`, `sign-up.astro`, `contact-us.astro`. Shared: `src/components/page/PageHead.astro`, `Cta.astro`, `Form.astro`, `Faqs.astro`; `src/components/NoteCard.astro`, `AppHub.astro`, `AppPlayer.astro` (use, do not edit), `DeskScene.astro`, `SetupCard.astro`. Home devices you can reuse live in `src/components/home/` and `src/scripts/` (`reading.ts` for lines that read in, `ground.ts` for the rising ground, `steps.ts` for the steps rail, `count.ts` for the counting ring, `hub.ts`, `quotes.ts`). `src/scripts/site.ts` is the entry that initialises them on every page.

## The brand is locked (source `/Users/jakeshelley/dev/pelvy/brand/brand.json`, short version `/Users/jakeshelley/.claude/skills/pelvy-brand/SKILL.md`)

- Colour roles through the custom properties in `src/styles/global.css` only: `--deep` #41684A (brand, the one main action; white text allowed), `--sage` #78A080 (ground behind app screens and photographs; ink at 24px and up only; never white text), `--sage-soft` #ABC8B1 (ground for the note and reading-size text; never white text), `--slate` #5E6687 (work only; never a button), `--mint`, `--paper`, `--white`, `--ink`, `--muted`, `--line`. No new colours. Never edit `tokens.css`.
- Type: Literata (headings and words a person says), DM Sans (everything else), DM Mono (counts). Radii: 22px, pills, 10px, circles for the count ring. No fourth.
- Motion: calm, "the breath": rise 8px and settle once, scroll-linked motion that settles. Nothing bounces or loops for decoration.
- Signature moves: the clinician's note (soft sage, the clinician's words in Literata, then name and role, nothing else; the biggest words belong to the clinician). The count ring holds only a numeral that is really counting something. Sage behind, ink in front.
- Status is never carried by colour alone: every error state needs an icon and a word.
- No illustration, no generated people, no stock. Generated scenes stay labelled.
- Voice for any copy you touch: plain, steady, specific, sentence case, no exclamation marks, no em dashes, Australian spelling. Never: journey, empower, treats, cure, diagnose, fix, optimise, elevate, simply, wellness.
- **Do not add or change any factual claim.** Facts are in `src/data/site.ts`, `src/data/faqs.ts` and `.palate/evidence/claims.md`. Rearranging and re-setting existing copy is fine.
- Photographs have true sizes that cap how large they may be shown: `src/assets/people/amelia-clinic.jpg` is 1170x755, so never wider than 600 CSS px; `amelia-portrait.png` is 586x946, never wider than 293 CSS px.

## Work, with acceptance criteria (check at 1440x900 and 390x844)

5. **Three inner pages open with their subject.** At 1440x900 and scroll 0, no empty area wider than 30% of the content column and taller than 300px.
   - `/features/`: a working app screen (the hub with its tabs, or the exercise player) is inside the first screen.
   - `/about/`: the clinic photograph is inside the first screen.
   - `/clinicians-and-specialists/`: the note is at least as large as that page's heading and drops the "From your clinician" line (`NoteCard` already has optional props for this from round 1; check it). At least one scroll-linked device from the home page is reused there: the reading line, the rising ground, the steps rail or the counting ring. Use it where it means something, for example the steps rail on a real sequence.
   - Each page still reads in full with reduced motion and with JavaScript off, and nothing autoplays or counts by itself under reduced motion.
   - Make these openings good, not merely compliant. They should feel like the same site as the home page: the same grounds, the same scale of type, the app or the real photograph doing the work. Look at your screenshots and iterate.
6. **Directory** (`/clinicians-directory/`). At scroll 6000 on desktop and on phone, the filter, or a control that returns to it, is inside the viewport. With JavaScript off no filter control shows (at the moment `display: grid` beats the `hidden` attribute).
7. **Small repairs.** Muted text reaches 4.5 to 1 wherever it sits on mint and on the count card's tint (measure it; switching that text to ink is fine). The form error summary carries an icon as well as its words (`Form.astro`). `/sign-up/` changes its heading when the patient choice is made, and changes back.
8. **No regressions.** Zero horizontal overflow at 390. No console errors. `npx astro check` 0 errors. `npm run build` gives 15 pages. The scripts below still pass.

Out of scope: the home page hero and player, the room and desk clips, deployment, commits.

## How to test

The shared Playwright MCP browser is locked by another session. Use the isolated browser scripts in
`/private/tmp/claude-501/-Users-jakeshelley-dev-pelvy/c43f8c3a-5f61-4b57-bef2-790340e507cc/scratchpad/pw/`:

- `node shot.mjs <spec.json>` for scripted scroll and screenshots (read it for the spec format: viewport, dpr, touch, mobile, reducedMotion, `js: false`, `warm: true`, steps with `scroll`, `jump`, `click`, `tap`, `press`, `wait`, `eval`, `shot`, `full`).
- After `npm run build`: `node behaviours.mjs http://127.0.0.1:4330`, `node forms.mjs` (dev), `node journeys.mjs http://127.0.0.1:4330 <dir>`, `node webkit.mjs http://127.0.0.1:4330 <dir>`. All must pass with no `FAIL` and no errors. If you change something a script asserts (for example the sign-up heading or the directory filter), update the assertion to the new behaviour and say so. `journeys.mjs` uses selectors such as `.page-head a.btn`, `.costs`, `#recommend`, `[data-dir-q]`, `[data-clinic]`: keep them working or update the script.
- Save screenshots under `/Users/jakeshelley/dev/pelvy/website/.palate/critique/round-2/` and look at them with the Read tool before reporting, at both sizes, with normal motion, reduced motion and JavaScript off.

## Report back (under 600 words)

Changed files and what changed in behaviour. For items 5, 6 and 7: met or not, with the measurement (largest empty area in px at 1440x900, note size against heading size in px, contrast ratios, where the filter control sits at scroll 6000) and the screenshot path that shows it. Results of `npx astro check`, `npm run build` and the four scripts. Anything you could not do and why. Do not deploy and do not commit.
