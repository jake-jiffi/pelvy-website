# Critique 05: recheck of round 2, whole site

**Verdict: target not met, by one category.** All eight round 2 criteria are met. No regression found. Design is 8.5 against 9. Every other category is 8 or higher, and overall is 8.7.

- Mode: independent recheck of builder round 2, whole site. Same critic as critique 03.
- Rounds: 2 of 4 consumed, 2 remain.
- Decision ID: `4ec5fa47-4cea-4828-8513-784c0177fc5a` (option a, "Counted through").
- Build judged: `c69396e6f2300ffa239effcd943436dc4694978a70f3a457c479d3871b8d109e`, `dist/` written at 16:43:59, served at http://127.0.0.1:4330/.
- Source fingerprint at the start, 16:49: `5b994efc1ca9d2be7c86b88e3de1a1df52029ed32fa071c198a0abb106e20f30`. At 17:11 it was `a3a9d4b7a4e1eb123d486e6d21caf1a649b405f37c9588518b337e82db4f877c` and `selectionCurrent` was false. See "Source moved during the recheck".
- Reviewed: 12 October 2026, 16:49 to 17:15 AEDT.
- References, unchanged: lovi, antara-spa, halo-dental, lava-dental.

## Round 2 criteria

| # | Criterion | State | My measurement | Capture |
| --- | --- | --- | --- | --- |
| 1 | Count label fits its disc | Met | One line at 11 phone sizes, 320x568 to 430x932. Disc 166 to 189px, label 134px, 24px type. Smallest corner margin across a whole out-breath: 5.5px. Pause is 44px. | `m-short-phones-sheet.jpg`, `m390x664-try-out.png` |
| 2 | App in the first phone screen | Met | 390x664, y=0: numeral at y=622 to 641, headline 88 to 221, "Book a demo" 322 to 374. Photograph starts at y=440. Sideways scroll 0. | `m390x664-rest.png` |
| 3 | Heading clear of the header | Met | 390x844, hold then up 200px: header 0 to 72, heading 88 to 152. At 390x664 the heading is visually hidden and the screen starts at y=100. | `m-390x844-sheet.jpg` |
| 4 | No collision at the first notch | Met | 1440x900: at y=60 and 120 the ground's edge is at x=781, 64px clear of the copy. At y=180 and 240 the copy is at 0% opacity. Also clean at 1280x720, 1024x768, 820x1180, 1920x1080 and 390x844. | `d-notch-sheet.jpg`, `m-notch-sheet.jpg` |
| 5 | Three inner pages open on their subject | Met | 1440x900, y=0: no empty area over 384 by 300px on any of the three. `/features/`: hub 290 by 628px at y=154, three working tabs. `/about/`: clinic photograph 579px wide at y=218. `/clinicians-and-specialists/`: note 96px over a 67.2px heading, no "From your clinician", one reading line and one rising ground. All three read in full with reduced motion and with no JavaScript. | `top-desktop-*.png`, `d-inner-tops-1280.jpg`, `m-inner-tops.jpg`, `d-inner-rm-nojs-tops.jpg` |
| 6 | Directory filter reachable | Met | At y=6000 "Back to search" is 193 by 48px at y=832 of 900, and 180 by 48px at y=776 of 844 on phone. It returns to the filter and focuses the search field. Hidden at the top and at the page end. With no JavaScript, 0 filter controls show. | `dir-and-form-sheet.jpg` |
| 7 | Small repairs | Met | No text under AA on 11 pages at both sizes. Error summary carries a 24px icon. `/sign-up/` reads "Write to Amelia." for the patient choice and changes back. | `dir-and-form-sheet.jpg` |
| 8 | No regressions | Met | 34 of 34 behaviours, 52 of 52 journey steps, 20 of 20 in WebKit, 19 of 19 form checks. 15 routes respond, sideways scroll 0 at 1440 and 390, no console errors. Desktop hold still 760px. Keyboard path intact. | `run-*.txt`, `measure-hero-desktop.json` |

Two notes on those rows. `forms.mjs` targets the dev server, so I checked the production form states separately. The rebuilt pages and the directory control also hold in WebKit 26.6 (`wk-d-inner.jpg`).

## Facts

All three notes from critique 03 are closed.

- The sentence that began "If your clinic joins later" is gone from every built page.
- "Pelvy is ad-free" is the client's own sentence, in the captured patient FAQ.
- "Yearly $19.99" and "Monthly $4.99" are legible in the demo frames (`source-demo-prices.jpg`).

## Scores, whole site

| Category | Was | Now | Evidence |
| --- | --- | --- | --- |
| Design | 8 | 8.5 | The three selling pages now open on the note, the app and the photograph. Below the note the clinicians page is 4,009px of text rows. |
| Usability | 8.5 | 9 | The directory has a way back. The first phone screen leads with the counting app. |
| Creativity | 8 | 8.5 | The note moment and the working hub now travel to inner pages. They repeat the home page's devices and add none. |
| Content | 9 | 9 | The untraced sentence is removed and both soft claims check out. One label is missing on phones. |
| **Overall** | 8.25 | **8.7** | 0.40 x 8.5 + 0.30 x 9 + 0.20 x 8.5 + 0.10 x 9 = 3.4 + 2.7 + 1.7 + 0.9 |
| Functionality | 8.5 | 9 | Every script passes, and the label fits at all 11 sizes I tried. |
| Completeness | 8.5 | 8.5 | Unchanged. Enquiry delivery still waits on hosting. |
| Accessibility | 8 | 8.5 | Both contrast failures are gone, Pause is 44px, errors carry an icon. Screen reader still not heard. |
| Motion | 7.5 | 8 | The first notch is clean. The clinicians note reads in on scroll. The rest of that page has one loop. |

Target: 8 in every category and overall, Design 9. **Not met.** Design is the only category short.

## Remaining findings

**1. Important, small. On a phone the home page never says the exercise screen is a sample.**
The line "A working sample in Pelvy's new look. The timings are examples: in the app you set your own, or your clinician does." is `display: none` under 640px wide. Desktop shows it at y=639. The claims ledger rests the example timings on that line. This is not a round 2 regression. It was there in round 1 and I missed it in critique 03. `/features/` and `/general-users/` show their sample captions on phones.
Capture: `m390x664-try-out.png`.

**2. The gap to Design 9. The clinicians page stops being designed after the note.**
From y=932 to 4941 there is no scroll-linked device, one desk loop and rises. "What your patients get in the pilot" is four text rows over 892px. "$20" is set at 22.8px. This is the page a clinician reads before paying.
Reference: halo-dental's pricing page gives the price a title about 100px tall and a full-width row inside the first screen. `/features/` on this site already shows the same four things as working parts.
Captures: `d-clinicians-sheet0.jpg`, `d-clinicians-sheet1.jpg`.

**3. Optional.**
- The clinicians note is caught mid-read before any scroll: 7 of 11 words in ink at 1440x900, 5 at 1280x720, 3 at 390x844.
- The home page still ends on a 31px line and a button. Inner pages end on the sage panel.
- "Back to search" floats over list text, centred on desktop.
- `/features/` sets its note at 38.4px under a 67.2px heading. A brand call, not a defect.
- Under 700px tall the pinned phone stage shows no words. The heading stays for screen readers. I accept it.

## Would a third round help?

Yes, narrowly. Finding 2 is real design work on one page and is the only route left to Design 9. Finding 1 is a one-line honesty repair that should not ship as it is. Everything else is polish.

If you stop here the site is sound in every category but one. Finding 1 still needs doing.

### Brief, round 3

Project `/Users/jakeshelley/dev/pelvy/website`. Judge on the production build. Keep everything this report marks as met. No new claims, no deploy.

1. **Sample line on phones.** At 390x844 and 390x664 on `/`, the two facts (a sample in the new look, example timings) are visible within one screen of the exercise screen. Not on sage unless 24px or more.
2. **Clinicians page below the note.** Between y=932 and the closing panel at 1440x900:
   - "$20" is in DM Mono at 58px or more, with "a month during the pilot" and the six free months in the same screen.
   - At least two of the four pilot items are shown as app parts already on file, not text rows.
   - At least one more scroll-linked device from the home page is used where it means something.
   - It reads in full with reduced motion and with no JavaScript.
3. **Optional, same round.** The note is fully in ink within 2 seconds of load wherever it sits in the first screen. `/` ends on a ground carrying "See it with your own patients in mind." at 44px or more. "Back to search" overlaps no list text at 1440x900.
4. **No regressions.** The four scripts pass. The eight criteria above still hold.

## Source moved during the recheck

Six source files and the icon set changed at 17:10 to 17:11: `Hero.astro`, `hero.ts`, `Handout.astro`, `DeskScene.astro`, `Base.astro`, `global.css`. `dist/` did not change. This report covers build `c69396e6` only. Those edits are unverified, and the protocol asks for one worker on the site at a time.

## Captures

All under `.palate/critique/recheck-2/`. Desktop is 1440x900 at 1x. Phone is 390x844, touch, 2x, unless the name says otherwise.

- Hero: `d-home-sheet0.jpg` to `4`, `m-home-sheet0.jpg` to `3`, `d-notch-sheet.jpg`, `m-notch-sheet.jpg`, `t-notch-sheet.jpg` (820x1180), `m-short-phones-sheet.jpg` (390x664, 360x640, 375x667), `m-390x844-sheet.jpg`, `m390x664-rest.png`, `m390x664-try-out.png`.
- Inner pages: `d-clinicians-sheet0.jpg` to `3`, `d-features-sheet0.jpg` to `2`, `d-about-sheet0.jpg`, `d-about-sheet1.jpg`, the `m-` sets, `top-desktop-*.png`, `d-inner-tops-1280.jpg`, `m-inner-tops.jpg`.
- Reduced motion and no JavaScript: `d-inner-rm-nojs-tops.jpg`, `m-inner-rm-nojs.jpg`.
- Directory and forms: `dir-and-form-sheet.jpg`. WebKit: `wk-d-inner.jpg`, `wk-m-inner.jpg`.
- Data: `audit-desktop.json`, `audit-phone.json`, `measure-hero-desktop.json`, `run-*.txt`, `journeys/`.

## Limits

- Headless Chromium, plus WebKit 26.6 for the hero script and a look at four inner pages. No real device.
- Phone browser bar heights are reasoned, not measured on a phone.
- Screen reader output not heard. Smoothness not judged from stills.
- Forms tested on the mailto path. Nothing was sent. Delivery is still an external blocker.
- The builder's round 2 screenshots and the coordinator's criteria file were read and not used as evidence.
