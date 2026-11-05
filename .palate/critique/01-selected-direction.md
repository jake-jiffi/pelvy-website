# Critique 01: selected direction, home page

**Verdict: target not met.** One critical defect as captured, repaired in source minutes later (see "Late changes"). The page loses its motion and its idea after the first third. Overall 7.6 as captured, 7.75 with the repairs. Design 7.5 against a target of 9.

- Mode: selected-direction pass, home page only. Inner routes out of scope.
- Rounds: 0 of 4 builder rounds consumed when the review started. See "Late changes" before relying on that count.
- Decision ID: `4ec5fa47-4cea-4828-8513-784c0177fc5a` (option a, "Counted through").
- Source fingerprint: `e5f52921...65f4` when the review started, `ecc14fda...4a74` when the captures ended at 13:55, `6d34987d...4299` at 14:01 after the late changes. Build fingerprint `a4002dc8...2e05`. Selection fingerprint `fb94d67e...7a0f`, so `selectionCurrent` is false.
- Preview: http://127.0.0.1:4322/ (dev server, `npm run preview:live`).
- Reviewed: 12 October 2026, 13:36 to 13:55 AEDT. Quick recheck of three items at 14:00.
- References, unchanged: lovi, antara-spa, halo-dental, lava-dental. Local captures under `.palate/references/<slug>/sheet.jpg`. Frames show sequence, not smoothness.

## Late changes

The hero and player source changed at 13:58:43, after the captures and before this report was handed back. The critic did not make those edits. They match three findings.

A quick recheck at 14:00 in desktop Chromium, plus the hold at 390x844:

- **C1, repaired.** Tab from "Pause motion" moves the page to y=1710 and focuses Pause, then Let go, then Squeeze, each in view at opacity 1. Shift+Tab returns to "Pause motion" at y=0. The try layer is inert with no pointer events until it shows. Evidence: `recheck-d-focus-player.png`.
- **I3, repaired.** Hero travel is now 2,250px on desktop and 2,110px on mobile. The finished state holds for 765px and 717px, 0.85 of the viewport each.
- **I9, part repaired.** The status text now has `role="status"`. The label size and the invisible focus stop were not rechecked.
- Reduced motion still loads the static layout. No console errors.

This is not a full recheck. Everything else in this report describes the build as captured. Scroll positions below the hero are now 540px lower on desktop and 506px lower on mobile.

If those edits answered this critique, they are a builder round: 1 of 4 consumed, 3 remain, and the count needs persisting. If they were ordinary construction, the count stays at 0.

Scores as captured are in the table. With the three repairs counted, Usability moves to 7.5, Functionality to 8.5 and Accessibility to 7.5, and the overall to 7.75. The target is still not met.

## Scores

| Category | Score | Evidence |
| --- | --- | --- |
| Design | 7.5 | Hero and handover are resolved. Below them every section is two columns under a left heading, and four in a row sit on 5,470px of unbroken paper. |
| Usability | 7 | Clear paths and prices. Tab order skips the player, and 5 of 7 quotes sit behind an unmarked sideways scroll. |
| Creativity | 8 | Pushing through the phone into a working exercise screen is specific to this product. The idea stops at y=4000. |
| Content | 9 | Plain, sourced, honest about limits. No banned words, no exclamation marks, every generated scene labelled. |
| **Overall** | **7.6** | 0.40 x 7.5 + 0.30 x 7 + 0.20 x 8 + 0.10 x 9 = 3.0 + 2.1 + 1.6 + 0.9 |
| Functionality | 7.5 | Every control works by pointer and touch. Tab order skips the player. |
| Completeness | 8.5 | All sections present at both sizes, with reduced-motion and no-JS versions. Tablet handover unresolved. |
| Accessibility | 6.5 | Skip link, landmarks, focus rings and fallbacks are good. Four measured failures, listed below. |
| Motion | 7.5 | Push-in, breathing count and handout scrub all verified. The lower two thirds carry 8px rises and little else. |

## Captures

All under `.palate/critique/shots/`. Desktop is 1440x900 at 1x. Mobile is 390x844, touch, 2x.

- Hero push-in, desktop: `d-hero-0000.png` to `d-hero-2800.png` (scroll position in the name).
- Hero push-in, mobile: `m-hero-0000.png` to `m-hero-1900.png`.
- Player states: `d-try-1600-squeeze-out.png`, `d-try-1600-paused.png`, `m-try-squeeze.png`.
- Handout scene: `d-handout-2700.png` to `d-handout-4600.png`, `m-handout-a.png` to `m-handout-e.png`.
- Sections: `d-two-a.png`, `d-inside-videos.png`, `d-ways-a.png`, `d-clinics-a.png`, `d-said-a.png`, `d-compare.png`, `d-notyet.png`, `d-amelia.png`, `d-footer.png`, and the `m-` set.
- Reduced motion: `d-rm-top.png`, `d-rm-try-started.png`, `m-rm-try.png`. No JS: `d-nojs-top.png`, `d-nojs-full.png`, `m-nojs-full.png`.
- Other widths: `w820-`, `w1024-`, `w1280-`, `w1920-` sets.
- Focus: `d-focus-11.png`, `d-focus-after-scroll-2.png`.

## What was observed in motion

Desktop, hero travel 1,710px. At y=0 the room clip plays and the phone counts. By y=150 the sage ground opens from the photo and the copy fades. From y=300 to 900 the photo centres and pushes in. From about y=800 to 1200 the room fades to sage and the screen stands up straight. Copy and switch arrive between y=1265 and 1470. The finished state rests from y=1470 to 1710, then the stage scrolls away.

Mobile is the same sequence over 1,604px, finished at y=1380.

The handout drops between y=2962 and 3337 while the second line reads in. Words go from 0.22 to full opacity. Rises were caught mid-way at 40ms (opacity 0.018, offset 6.5px) and settled at 1,200ms.

Reduced motion: no pin, no clip, nothing autoplays, Start runs the count. No JS: every section shows, switch hidden, hub on Programs.

## Findings

### Critical

**C1. Tab order skips the exercise player.** Repaired in source after capture, see "Late changes". As captured: 1440x900, y=0. Tab stop 10 is "Pause motion". Stop 11 is the hub list at y=5915. Pause, Let go and Squeeze are skipped. Scroll to y=1600 with nothing focused and Tab lands on the skip link, which returns the page to y=0.

One path works: focus a header link, scroll to the finished state by keyboard, then Tab on. Nobody will find it.

The try layer is `visibility: hidden` until the push-in passes 80%, so the handler meant to bring it into view never fires. Its heading is out of the accessibility tree at y=0 for the same reason (reasoned from the DOM, not heard in a screen reader). The controls are also clickable while transparent between y=1176 and 1265. Evidence: `d-focus-11.png`, `d-focus-after-scroll-2.png`. No reference applies.

### Important

**I1. The lower two thirds lose the motion and the idea.** After y=4000 on desktop, 8,300px carries 8px rises, one steps rail and a tab fade. Nothing counts and nothing breathes. Paper runs unbroken from y=2610 to 8080. Every section is a left heading over two columns. See `d-two-a.png`, `d-ways-a.png`, `d-compare.png`.

- antara-spa carries each section change with a rising rounded ground and a panel that grows (frames at 1.5s to 3.4s, then every later section).
- lovi keeps product interface working in every section: the phone trio, the feature cards, the chat.
- halo-dental shows capability as a cluster of working cards, not one card and a paragraph.
- lava-dental pins one statement and alternates light and dark.

**I2. The clinician's words are not the biggest words.** Note 38.4px, section headings 58px, hero 74px. On mobile 26.2px, 38px, 42.7px. Clinic quotes are 30.4px and 22.4px. Signature move 1 says the biggest words belong to the clinician. `d-two-a.png`, `m-two-a.png`. lava-dental gives its one pinned statement the loudest moment on the page, and antara-spa sets its statement on a ground that rises to meet it.

**I3. The finished exercise screen rests for a quarter of a screen.** Repaired in source after capture. As captured: 240px on desktop, 224px on mobile, 0.27 of the viewport each. A normal flick travels further than that. `d-try-1470.png`, `d-try-1710.png`. No reference: the captured frames cannot show dwell.

**I4. The desk loop does not visibly move.** Sampled at 2 frames a second and 270px wide: no pixel changes by more than 12 of 255 across 10 seconds. The room loop changes in the right-hand sixth only (curtain light, range up to 51 of 255). The brief asked for Higgsfield motion. Frames: `loop-desk-0s-3s-6s.png`, `loop-room-0s-3s-6s-9s.png`. No reference: sampled frames cannot show a loop moving.

**I5. Five of seven quotes are hard to find.** The row is 4,112px wide in a 1,440px window. The only control is a thin scrollbar, which macOS hides. Arrow keys work once the row is focused. `d-said-a.png`, `m-said-b.png`.

**I6. On a phone, "Tap the tabs" is 820px above the tabs.** Tapping Videos in the list changes a hub whose top sits at 840 of 844. `m-inside-list-tap.png`.

**I7. The Videos pane is half blank.** Three rows, then 339px of empty screen out of 710px on desktop (48%), and the same share on mobile. Learn is 23% blank. The play icons look tappable and do nothing. `d-inside-videos.png`, `m-inside-videos.png`. halo-dental's interface cards and lovi's phone screens are full.

**I8. The set-up card cannot be read.** Step text is 8.7px on desktop and 5.6px on mobile. Its content exists only in an `aria-label`. `d-clinics-a.png`, `m-clinics-c.png`.

**I9. Player accessibility.** Live region repaired in source after capture; the other two parts stand. As captured: the page has 0 live regions, so the status text the script writes is never announced. "Breathe in" is ink on sage at 17.2px desktop and 14.9px mobile, about 4.4 to 1 (the brand's own figure is 4.36). That is under AA for text this size. "How recommending works" took focus at opacity 0 in a straight Tab pass, before its rise fired.

**I10. Tablet handover is unresolved.** At 820x1180 the heading is one 30px line top left, a 266px phone floats mid-field, and the switch is pinned to the bottom. Two empty bands of 222px. `w820-hero-try.png`.

**I11. Phase changes pass through an unreadable frame.** The numeral and label sit on a same-tone ground while the ring opens or closes. The CSS runs those changes over 320ms and 420ms. Caught twice in stills: `w1024-hero-try.png`, `d-hero-0900.png`.

### Optional

- O1. The room dissolves to sage as a flat fade and reads green-tinted for about 400px. `d-hero-1100.png`, `m-hero-1100.png`. antara-spa lets a shape do this work.
- O2. Compare table: the handout column is 190px and wraps while the Pelvy column has 415px. `d-compare.png`.
- O3. "Two things" columns end 225px apart at 1440. `d-two-b.png`.
- O4. Reduced motion, desktop: "It counts, so you can finish." breaks over three lines. `d-rm-try-started.png`.
- O5. No JS still says "Tap the tabs." beside tabs that cannot switch.
- O6. Hub tabs are 30px tall on mobile. Pause is 37px.
- O7. The steps count in at the bottom third of the screen (trigger line at 68%). Two of three are on by the time the heading reaches the top. `d-clinics-a.png`.
- O8. On mobile the app picture starts at y=590 of 844, so the lead image is under a third of the first screen. `m-hero-0000.png`.

## Brand fidelity

Holds: colour roles, with white on deep sage and slate only. Three type families and no fourth. Radii 22px, pill and 10px. Count rings hold part numbers, step numbers and live counts. No banned words in Pelvy's own copy. No exclamation marks. No em dashes outside 5 verbatim clinic quotes. All three generated scenes are labelled. The note is marked as a sample. No illustration, no generated people.

Breaks or strains:

1. Clinician's words are smaller than Pelvy's (I2).
2. Ink on sage under 24px: the "Breathe in" label (I9). The brand's own app artboard draws it at 22px at 1x, so this needs a brand call as well as a size change.
3. Hub cards compute to 18.4px on desktop and 16.8px on mobile. They are the 22px radius scaled with the app drawing, not a new token, but they sit beside 22px panels.
4. The note card carries a "From your clinician" line. The primitive says name and role only. The brand's hub screen has the same line, so ask the brand owner.
5. The photo passes through a green tint in the push-in (O1). The imagery rule says never tinted green.
6. "treatment" appears in "My treatment hub", the app's own screen name. Not a breach.

## The strongest case against this verdict

The quiet lower page may be the brand working as written. A sceptical clinician wants price, limits and proof. The motion budget is spent where it explains the product.

It does not hold. The user has already rejected "calm means no motion" and called an earlier build boring. The brand's own motion, a ring that counts and a card that rises once, can carry these sections without asking for attention.

## Builder brief

Project: `/Users/jakeshelley/dev/pelvy/website`. Preview: http://127.0.0.1:4322/, restart with `npm run preview:live`. Home components live in `src/components/home/`, shared ones in `src/components/`, scripts in `src/scripts/`. Brand: `/Users/jakeshelley/dev/pelvy/brand/brand.json`.

Keep the hero rest composition and headline, the push-in and four-corner fit, and the one-clock player with its switch. Keep the handout scrub and reading lines, all copy and facts, the scene labels, the reduced-motion and no-JS versions, and the tokens.

Do not add claims, quotes, statistics, stock images or generated people. Test on the local preview only. No deploy.

Ranked, with acceptance criteria. Check each at 1440x900 and 390x844.

1. **Keyboard reaches the player.** Done in source at 13:58, full recheck pending at both sizes. From a fresh load, Tab from "Pause motion" focuses Pause, then Let go, then Squeeze. Each is at opacity 1 and inside the viewport when focused. Shift+Tab returns. No try control is focusable or clickable below opacity 1.
2. **Give the clinician the biggest words.** The note becomes its own scroll moment on a full-bleed soft sage ground that arrives with a scroll-linked rise. Its words read in. At its largest the note is at least 74px on desktop and 42.7px on mobile. It stays signed and marked as a sample.
3. **Show the count happening below the hero.** In the program card a ring counts a real listed value while in view. The numeral differs between two captures 2 seconds apart. Full values show under reduced motion and no JS.
4. **Break the paper.** Between the hero and the quotes band, no run of paper longer than 2,700px at 1440.
5. **Quotes can be reached.** Visible previous and next controls of at least 44px, keyboard operable, with a position count. Quotes stay verbatim. No autoplay.
6. **Hold the finished state.** Done in source at 13:58 (0.85 of the viewport), full recheck pending. With all try parts at opacity 1, the stage stays pinned for at least 0.6 of the viewport height.
7. **Mobile hub.** After tapping Videos in the list, the hub's tab strip is inside the viewport. The instruction sits with the screen.
8. **Hub panes.** No pane leaves more than 30% of the screen empty, using app content already on file. Play icons work or stop looking like controls.
9. **Set-up card.** Its three steps read at 14px or more, on the card or as text beside it.
10. **Player accessibility.** Live region done in source at 13:58; label size and focus visibility still open. One polite live region announces program changes and Start or Pause. Text on sage is 24px or more. No focused element has an ancestor below opacity 1.
11. **Desk loop.** At least 5% of pixels change by more than 12 of 255 across the loop, objects and light only. Otherwise remove the video and keep the still.
12. **Tablet.** At 820x1180 no empty band taller than 10% of the viewport between heading, player and switch.
13. **Phase change.** Captures at 50ms intervals across a hold change show numeral and label readable in every frame.
14. **No regressions.** Horizontal overflow 0 at 390. No console errors. Three type families. Radii 22px, pill, 10px. No white on either sage.

Optional if time allows: O1 to O8.

## Escalation

Recommend deeper craft work now, on items 2 to 5: the note moment, the counting program card, ground changes and the quotes band. Items 7 to 14 are targeted repairs and can ride in the same round. Keep the remaining rounds for recheck corrections and the final repair.

## Limits

- Chromium only, headless, isolated Playwright. WebKit is not installed, so Safari and iOS are unverified. The audience installs an iOS app, so check this on a real iPhone.
- Smoothness is not judged from stills. A coarse frame sample in headless Chromium showed no frame over 33ms across the push-in. Indicative only.
- Screen reader output was not heard. The live-region finding comes from the DOM.
- The dev preview hot-reloaded during the review while inner routes were built. Page heights matched at the start and end: 12,339px desktop, 14,608px mobile.
- Loop measurements are on the shipped encodes at reduced size, not the source clips.
- Palate MCP tools were not called. The project's captured reference evidence was enough.
