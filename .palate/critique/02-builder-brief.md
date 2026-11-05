# Builder brief: round 1 of 4, section craft on the home page

You are the builder for round 1. The critic's full report is `.palate/critique/01-selected-direction.md`. Read it first, then this. The coordinator has already repaired the hero and the player (keyboard path, longer hold, tablet layout, single-frame phase changes, live region, label size on sage, the photograph closing instead of fading). **Do not edit** `src/scripts/hero.ts`, `src/scripts/player.ts`, `src/components/home/Hero.astro` or `src/components/AppPlayer.astro` unless a criterion below cannot be met without it, and say so if you do.

## Project

- Path: `/Users/jakeshelley/dev/pelvy/website` (Astro 7, static, TypeScript, GSAP + ScrollTrigger already installed). Read `README.md` for the file map.
- Preview, already running: http://127.0.0.1:4322/ (hot reloads). If it is dead: `npm run preview:live`. Do not start a second dev server on that port.
- Checks you must run and report: `npx astro check` (0 errors), `npm run build` (15 pages).
- Home sections, in order: `src/components/home/Hero.astro`, `Handout.astro`, `TwoThings.astro`, `InsideApp.astro`, `Ways.astro`, `Clinics.astro`, `Compare.astro`, `Amelia.astro`, assembled in `Home.astro`. Shared: `src/components/NoteCard.astro`, `AppHub.astro`, `SetupCard.astro`, `DeskScene.astro`. Scripts: `src/scripts/site.ts` (entry), `reading.ts` (words read in on scroll), `steps.ts`, `hub.ts`, `handout.ts`. Styles: `src/styles/global.css` (roles on top of `tokens.css`; never edit `tokens.css`).
- `NoteCard`, `AppHub`, `SetupCard`, `DeskScene` are also used on inner pages (`src/pages/*.astro`). If you change their markup or props, keep those pages working and looking right.

## The brand is locked (source: `/Users/jakeshelley/dev/pelvy/brand/brand.json`, short version `/Users/jakeshelley/.claude/skills/pelvy-brand/SKILL.md`)

- Colour roles, via the custom properties in `global.css` only: `--deep` #41684A (the mark, brand text, the one main action; white text allowed), `--sage` #78A080 (let go; ground behind app screens and photographs; ink type at **24px and up only**; never white text), `--sage-soft` #ABC8B1 (ground for reading-size text, the note first; never white text), `--slate` #5E6687 (work: out-breath, squeeze, strength content; **never a button**), `--mint`, `--paper`, `--white`, `--ink`, `--muted`, `--line`. No new colours, no gradients, no tinting photographs.
- Type: Literata (`.serif`, headings, and words a person says), DM Sans (everything the app or Pelvy says), DM Mono (`.mono`, counts and timers). No fourth family.
- Radii: 22px on panels and photographs (`--r-panel`), pills (`--r-pill`), 10px on fields (`--r-field`). Circles for the count ring. No fourth radius.
- Motion: "the breath". Things rise 8px and settle once (`[data-rise]`, `--breath-ease`). Scroll-linked motion is welcome and should be calm: slow, settling, nothing bounces for attention, nothing loops for decoration. Use GSAP ScrollTrigger with `scrub` the way `reading.ts` and `steps.ts` do.
- Signature moves: (1) **the clinician's note**: soft sage card, the clinician's words in Literata ink, underneath in DM Sans the clinician's name and role, nothing else on the card. The biggest words on a Pelvy surface belong to the clinician. (2) **The count ring** (`.ring`): a circle with a stroke one twelfth of its diameter holding one DM Mono numeral that is really counting something. Never an icon or a tick. (3) Sage behind, ink in front.
- No illustration of any kind. No generated people. No stock. Generated scenes stay labelled as generated.
- Voice, for any copy you touch: plain, steady, specific. Sentence case. No exclamation marks, no em dashes, no capitals for emphasis. Never: journey, empower, treats, cure, diagnose, fix, optimise, elevate, simply, wellness, "the only app". Australian spelling. Clinic quotes are verbatim from the client's directory and keep their own punctuation.
- **Do not add or change any factual claim.** Every fact on the site is sourced (`.palate/evidence/claims.md`, `src/data/site.ts`). You may rearrange and re-set existing copy. If you need words that are not already on the page, take them from `src/data/site.ts` or the claims ledger, or leave them out.

## What to keep

The hero rest composition, the push-in, the working player and its switch, the handout scroll scene and its three read-in lines, all facts and labels, the reduced-motion and no-JavaScript behaviour (nothing hidden without a script; nothing autoplays or counts by itself under `prefers-reduced-motion: reduce`), zero horizontal overflow at 390px, zero console errors.

## Ranked work, with acceptance criteria (check each at 1440x900 and 390x844)

1. **Give the clinician the biggest words.** The note becomes its own scroll moment directly after the handout scene: a full-bleed soft sage ground that arrives with a scroll-linked rise (think of the rounded ground that rises over the previous section), with the note's words reading in as you scroll (reuse `data-reading`). At its largest the note's words are **at least 74px on desktop (1440 wide) and 42.7px on mobile (390 wide)**. Signed "Amelia Godfrey, pelvic health physiotherapist". Still marked, off the card, as a sample from Pelvy's store listing. On this large note leave off the "From your clinician" line (the primitive says words, then name and role, nothing else); the app's own hub screen keeps it. The explanation "It keeps what they said." and its paragraph stay with it.
2. **Show the count happening.** In the program card (Pelvic floor strength, now in `TwoThings.astro`) a count ring counts a real listed value while the card is in view, for example the hold and rest seconds of Quick squeezes (hold 2s, rest 3s, 10 reps) with "Rep n of 10" in mono beside it. The numeral must differ between two captures taken 2 seconds apart. Under reduced motion and with no JavaScript the card shows its full static values and nothing moves. It must pause when out of view. Honour the page's "Pause motion" control: listen for the `pelvy:motion` document event (`detail` is `true` for on, `false` for off), as `steps.ts` does.
3. **Break the paper.** Between the end of the hero and the deep sage quotes band, no run of the paper ground longer than 2,700px at 1440 wide. Use the brand's own grounds (soft sage, sage with large type only, mint, white, deep sage with white) and vary the composition: at the moment every section is a left heading over two columns.
4. **Steps count one at a time** (`Clinics.astro`, `steps.ts`). The three steps turn on at scroll positions at least 150px apart, and none is on before the list is in view.
5. **Quotes can be reached** (`Clinics.astro`, the `.said` band). Visible previous and next controls of at least 44px, keyboard operable, with a position such as "2 of 7". Quotes stay verbatim. No autoplay. Keep the row scrollable by touch and arrow keys.
6. **Mobile hub** (`InsideApp.astro`). At 390px, after tapping Videos (or any item) in the list, the hub's tab strip is inside the viewport. The instruction to tap sits with the screen, not 800px above it.
7. **Hub panes** (`AppHub.astro`). No pane leaves more than 30% of the screen empty. Use only app content already on file: `src/data/site.ts` (`programs`, `learn`) and the facts in `.palate/evidence/claims.md` (the video library covers mobility for hips, lower back and upper back, stretches, and education videos; three exact titles are known and already listed). Do not invent video titles or durations. The play marks either work or stop looking like controls.
8. **Set-up card** (`DeskScene.astro`, `SetupCard.astro`). Its three steps can be read at 14px or more, on the card or as text beside the scene. They are: Download Pelvy Patient. Sign in with your mobile number. Your notes and your program are there.
9. **Text on sage.** Any ink text on `--sage` is 24px or more everywhere on the home page. No element can hold keyboard focus while it or an ancestor is below opacity 1 (there is a `focusin` handler in `site.ts` for `[data-rise]`; make sure anything new follows it).
10. Optional, if time allows: the comparison table's handout column is cramped at 1440 (190px against 415px); the two columns in "Two things" end 225px apart; with reduced motion on desktop "It counts, so you can finish." breaks over three lines in the static sage panel; with no JavaScript the copy still says "Tap the tabs"; hub tabs are 30px tall on mobile.

Out of scope for you: the desk and room video clips (the coordinator is regenerating them), inner pages except where a shared component changes, deployment of any kind.

## How to test

The shared Playwright MCP browser is locked by another session. Use the isolated browser scripts in
`/private/tmp/claude-501/-Users-jakeshelley-dev-pelvy/c43f8c3a-5f61-4b57-bef2-790340e507cc/scratchpad/pw/`:

- `node shot.mjs <spec.json>`: scripted scroll and screenshots. Read `shot.mjs` for the spec format (viewport, dpr, touch, mobile, reducedMotion, `js: false`, `warm: true` to load lazy images, steps with `scroll` as a number or a JS expression string, `jump`, `click`, `tap`, `press`, `wait`, `eval`, `shot`, `full`). Examples: `spec-desk.json`, `spec-m-home.json`.
- `node behaviours.mjs` walks the existing interactions and must still print no `FAIL` lines and "console/page errors: none". If you change something it asserts (for example the quotes row), update the assertion to match the new behaviour and say so.
- Save your screenshots under `/Users/jakeshelley/dev/pelvy/website/.palate/critique/round-1/` and look at them with the Read tool before you report. Judge the result as a designer would, at both sizes, with normal motion, then reduced motion, then JavaScript off.

## Report back (under 700 words)

Changed files and what changed in behaviour. For each numbered item: met or not, with the measurement (font sizes in px, scroll positions, the two differing numerals, the longest paper run in px) and the screenshot path that shows it. Results of `npx astro check`, `npm run build` and `behaviours.mjs`. Anything you could not do and why. Do not deploy and do not commit.
