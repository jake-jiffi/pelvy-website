# Critique 03: final-site pass, whole site

**Verdict: target not met.** No critical defect. Design is 8 against a target of 9, and Motion is 7.5 against 8. The home page is close to the bar. The phone hero has a regression from round 1, and three inner pages do not carry the idea the home page sets up.

- Mode: final-site pass, fresh critic. Also the independent recheck of builder round 1.
- Rounds: 1 of 4 consumed, 3 remain. `rounds.md` still lists round 1 as "In progress". The coordinator should close it.
- Decision ID: `4ec5fa47-4cea-4828-8513-784c0177fc5a` (option a, "Counted through").
- Source fingerprint: `df6bc0a01e8eb582f8b88ce49ed0d2500aa626a41fcefc6645d31f73eef4adc2`. Build fingerprint: `5e907a4282d0ab493a3763dcd3f57d31eaf56d496e51c121b435634bf042e0ba`. Both were the same at the start and the end of the review. `selectionCurrent` is true. `verificationCurrent` is false.
- Judged on the production build, http://127.0.0.1:4330/ (`dist/` from 15:08). Dev preview at http://127.0.0.1:4322/ was up and not used for scoring.
- Reviewed: 12 October 2026, 15:10 to 15:46 AEDT.
- References, unchanged: lovi, antara-spa, halo-dental, lava-dental. Local sheets under `.palate/references/<slug>/`. Palate MCP added halo-dental's pricing and company pages. lava-dental has no inner pages captured.

## Scores

| Category | Score | Evidence |
| --- | --- | --- |
| Design | 8 | Home is resolved from the push-in to the quotes band. Every inner page opens with the right 45% of the first screen empty at 1440. |
| Usability | 8.5 | All five journeys pass on desktop and phone, 52 of 52 steps. The 65-clinic list has no way back to its filter. |
| Creativity | 8 | Pushing through the phone into a working count is specific to Pelvy. The idea stops at the home page. |
| Content | 9 | Plain, sourced and honest about limits. 33 claims traced. One claim rests on the brand voice, not on Amelia's material. |
| **Overall** | **8.25** | 0.40 x 8 + 0.30 x 8.5 + 0.20 x 8 + 0.10 x 9 = 3.2 + 2.55 + 1.6 + 0.9 |
| Functionality | 8.5 | 34 of 34 behaviours, 19 of 19 form checks, 20 of 20 in WebKit 26.6. The count label is clipped at common phone heights. |
| Completeness | 8.5 | 14 routes and a 404, with reduced-motion and no-JS versions. Enquiry delivery waits on a hosting choice. |
| Accessibility | 8 | Keyboard path, focus rings, live region and headings all hold. Two muted text pairs sit under 4.5 to 1. Screen reader not heard. |
| Motion | 7.5 | Home would score 8.5 by itself. The clinicians page has 27 rises and one loop, and the first wheel notch of the hero collides. |

## Disposition of critique 01

| ID | State | Measurement |
| --- | --- | --- |
| C1 | Resolved | Tab 11 is "Pause motion" at y=0. Tabs 12 to 14 are Pause, Let go, Squeeze at y=1710, in view, opacity 1, 2px ring. Shift+Tab returns to y=0. 0 clickable probes while faint. `d-focus-squeeze.png`, `measure-hero-desktop.json`. |
| I1 | Resolved on home | Longest paper run 2,400px (y=3150 to 5550, the handout scene), 2,000px on phone. Grounds change at 5550, 7430, 9170, 9610 and 10830. The gap now sits on inner pages, see N2. |
| I2 | Resolved on home | Note 96px against a 74.08px headline. Phone 45.84px against 42.68px. Signed, sample line off the card. Still 38.4px against 67.2px on two inner pages. |
| I3 | Resolved | Hold is 760px on desktop (0.84 of the screen) and 700px on phone (0.83). |
| I4 | Resolved | Desk loop: 83.3% of pixels move by more than 12 of 255. Room loop: 21.7%. My own sample, 20 frames each. `loops-sheet.jpg`. |
| I5 | Resolved | Previous and next are 60 by 48px. Enter, Space and arrow keys work. "n of 7" updates, including after a swipe. No autoplay. |
| I6 | Resolved | After a tap in the list the tab strip sits at y=195 to 239 of 844. The instruction is 119px above the tabs. |
| I7 | Resolved | Empty share: Programs 11.5%, Videos 21.8%, Learn 15%. Play marks removed. |
| I8 | Resolved | The card's three steps read beside the scene at 17px on desktop and 15.2px on phone. |
| I9 | Resolved, one regression | `role="status"` announces "Pelvic floor with breath, started. Rep 1 of 10." Label is 24px. 0 of 35 focus stops below full opacity. The 24px label no longer fits its disc on short phones, see N1. |
| I10 | Resolved | At 820x1180: heading y=154 to 331, screen 347 to 1078, switch 479 to 962. Largest empty band 102px, 8.6%. `t820-m360-sheet.jpg`. |
| I11 | Resolved | 189 samples at about 48ms on desktop and 190 on phone. Three states only, each with one colour pair. |
| O1 | Resolved | The photograph closes onto the phone's screen by clip. No tinted frame from y=1000 to 1300. `d-push-sheet.jpg`. |
| O2 | Resolved | Comparison columns are 204, 253 and 359px. The handout column was 190px. |
| O3 | Not comparable | The section was rebuilt as the note moment and the counting card. |
| O4 | Resolved | Reduced motion, desktop: the heading sets on two lines. `d-rm-home-sheet0.jpg`. |
| O5 | Resolved | With no JavaScript the line reads "This is the app's home screen." |
| O6 | Part resolved | Hub tabs are 44px. Pause is still 37px on phone, 42px on desktop. |
| O7 | Resolved | Steps turn on with the list top at 410, 230 and 40px of 900. None is on before the list shows. |
| O8 | Unresolved, promoted | The photograph starts at y=586 of 844. See N3. |

## What was observed in motion

Desktop, 1440x900, hero travel 2,250px. At y=0 the room clip plays and the phone counts. At y=120 the ground has opened to x=460 and the copy is at 49% opacity. From y=300 to 1000 the photograph centres and pushes in. From y=1000 to 1300 it closes onto the phone's screen. The finished screen holds from y=1485 to 2245.

Below the hero: the handout drops between the first and second reading lines. The soft sage ground rises as a rounded card and opens to the edges while the note reads in. The ring in the program card counts 5, 4, 3 and moves from Hold to Rest. The sage ground rises under the hub. Three steps turn on 180px apart. The deep sage quotes band rises. After y=11480 only 8px rises remain.

Phone, 390x844: the same sequence over 2,110px, finished at y=1395.

Reduced motion: no pin, no clip, nothing counts until Start. No JavaScript: every section shows, images load on scroll, the switch is hidden.

## Findings

### Critical

None.

### Important

**N1. The count label is clipped in the phone hero. Regression from round 1.**
Page `/`, finished state, 390x664 (a 390x844 phone with the browser bars showing). "Breathe out" is 133px wide in a 136px disc. Its lower corners sit 7.3px outside the circle, so the B and the t are cut. Same at 393x659 and 375x667. At 360x640, 375x620 and 375x640 it wraps to two lines and overflows. Fine at 700px tall and above.
Cause: round 1 set the label to a fixed 24px for the ink-on-sage rule. The disc scales with `svh`.
Evidence: `m390x664-try-out-crop.png`, `m-small-label-sheet.jpg`.
Reference: lovi keeps every element of its phone interface inside the screen at 390px (`refs-mobile-first-screens.jpg`).
Outcome: the label never touches the disc's edge, and ink on sage stays at 24px or more.

**N2. Three inner pages drop the idea and the motion.**
`/clinicians-and-specialists/`, `/features/`, `/about/` at 1440x900, y=0. Each opens with a 67px heading 706px or 582px wide in a 1,280px column. From x=786 to 1360 the first screen is empty (from x=662 on `/about/`).
- `/features/` is the page about the app. No app screen appears until y=2466.
- `/about/` shows Amelia at 203px. Her clinic photograph, one of three real photographs in the build, starts at y=1361.
- `/clinicians-and-specialists/` is where a clinician reads the price. It has 27 rises and one desk loop. Nothing counts and nothing reads in. The note is 38.4px under a 67.2px heading.
Evidence: `desktop-features-top.png`, `desktop-about-top.png`, `desktop-clinicians-and-specialists-top.png`, `d-features-sheet0.jpg`.
Reference: halo-dental's pricing page puts a title about 100px tall and a three-step row across the whole column inside the first screen. Its company page fills the right half with a photograph. lovi keeps product interface working in every section.
Outcome: each page shows its subject in the first screen and reuses devices the home page already has. FAQs, forms, news, the policy and the directory stay as they are.

**N3. The first phone screen has no app in it.**
Page `/`, y=0. The photograph starts at y=586. At 390x844, 258px of it shows. At 390x664, 78px shows and the counting screen is below the fold. The brand says the app is the lead image.
Evidence: `m390x664-rest.png`, `m-home-sheet0.jpg`.
Reference: lovi's phone starts at about y=330 of 844.
Outcome: at 390x664 the counting screen is visible without scrolling, with the headline and "Book a demo" still above the fold.

**N4. The first wheel notch cuts the headline in half.**
Page `/`, 1440x900, y=120. The sage ground's left edge is at x=460. The headline runs to x=630 at 49% opacity. The edge slices the headline, the lead, the price line and "I'm a patient: get the app". One notch of a mouse wheel rests here.
Evidence: `d-hero-nudge-120.png`.
Reference: antara-spa's ground rises from below as one shape and the words ride on it (frames 1 to 3). lovi's headline is gone before the phone grows (frames 1 and 2).
Outcome: no settled frame shows the ground's edge crossing readable copy.

**N5. The directory has no way back to its filter.**
`/clinicians-directory/` is 22,861px on desktop and 35,065px on phone. The filter is static. At y=6000 it is 5,383px above the screen. With JavaScript off the three filter controls show and do nothing, because `.dir__tools { display: grid }` beats the `hidden` attribute.
Evidence: `d-dir-sheet.jpg`, `desktop-nojs-clinicians-directory-top.png`.
Reference: none of the four has a directory. Not comparable.
Outcome: the filter can be reached from any depth, and dead controls do not show.

**N6. On a phone the header covers the hero's only words.**
Page `/`, 390x844, y=1900 after scrolling up from 2095. The header returns at y=0 to 88. The heading sits at y=16 to 80. The lead is hidden on phones, so the pinned stage then has no words.
Evidence: `m-push-sheet.jpg`, last frame.
Outcome: the heading shows whenever the exercise screen is pinned.

### Optional

- Muted text (#6B726D) is 4.44 to 1 on mint (contact page, 17px) and 4.42 to 1 on the count card's tint (15.2px). AA needs 4.5.
- "Pause" and "Pause motion" are 37px tall on phone. Footer links are 28px.
- The error summary has words and no icon. The brand asks for both.
- `/sign-up/` still reads "Tell Amelia about your clinic." after "A patient, or on my own" is chosen.
- `/features/` rows 4 and 5 have nothing beside them. Rows 1 to 3 do.
- The home page ends on a 31px line and a button. Every inner page ends on the sage panel. antara-spa and lava-dental close on a full-bleed dark ground.
- Each inner page repeats its navigation label above the heading.

## Brand fidelity and facts

Holds across all 15 pages: colour roles, three type families, radii, and no white on either sage. Ink on sage is 24px or more everywhere, and the four smallest are exactly 24px. Every generated scene is labelled. There is no illustration, no generated person and no stock. Pelvy's own copy has no banned word, exclamation mark or em dash. Those appear only in clinic quotes and Amelia's posts, carried over verbatim.

Breaks and strains:

1. The clinician's note is not the biggest type on `/clinicians-and-specialists/` or `/features/` (38.4px against 67.2px). Both keep the "From your clinician" line.
2. Hub cards compute to 18.4, 17.5 and 16.8px radius. Unchanged from critique 01.
3. Error states carry no icon.
4. Rings hold list numbers 1 to 5 on `/features/`. That is ordinal, not a count in progress. Ask the brand owner.
5. Two muted text pairs fall under AA.
6. The Perth photograph shows the old line "Track Treat Thrive" on the cards. Already listed in `media.md`.

Facts. 33 claims traced: 24 to the captured pages, 7 to the demo transcript, 2 to the live policy and the live Queensland post. All 46 clinic quotes match the captured directory word for word, and all 65 names are present.

Not traced to the client's material:

- `/general-users/`: "If your clinic joins later, your clinician's own programs and notes appear in the same app." The ledger marks it "not confirmed against the app". Confirm with Amelia or soften.
- `/general-users/`: "there are no ads". The source says "No third-party advertising: we never sell or share your information with advertisers." Close, not the same.
- $4.99 and $19.99 trace to brand evidence e37 (demo frames). They are not in the transcript text. I did not open the frame.

The privacy policy and both posts have no local capture. I checked the policy and the Queensland post against pelvy.app. The Perth post was not compared line by line.

## The strongest case against this verdict

Inner pages should be quiet. A clinician wants the price, the limits and a form. That holds for 10 of the 13 inner routes, and I have asked for nothing on them. It does not hold for the page about the app showing no app, or the founder's page showing her at 203px.

The phone heights are reasoned. I emulated 390x664 in Chromium. I did not hold an iPhone. If Safari reports a taller small viewport the clipping eases at 700px. It still fails at 375x667, which needs no browser bar to reach.

Home alone would score Design 8.5 to 9. Whole-site Design is 8 because the first click from the home page lands on a plainer site.

## Builder brief, round 2

Project: `/Users/jakeshelley/dev/pelvy/website` (Astro, static). Production preview http://127.0.0.1:4330/. Rebuild with `npm run build && npx astro preview --host 127.0.0.1 --port 4330`. Dev preview http://127.0.0.1:4322/, restart with `npm run preview:live`. Brand: `/Users/jakeshelley/dev/pelvy/brand/brand.json`. Read this report and `01-selected-direction.md` first.

Keep the hero as it works now: the push-in and its four-corner fit, the 0.85-screen hold, the keyboard path and the live region. Keep the note at 96px, the counting card, the rising grounds, the quotes band and the hub. Keep the forms and their wording, all copy and facts, the scene labels, the reduced-motion and no-JS behaviour, and the tokens.

Do not add claims, quotes, statistics, stock or generated people. Do not enlarge `amelia-clinic.jpg` past 600px wide or `amelia-portrait.png` past 293px. Test on local previews only. No deploy. Never send an enquiry.

Ranked, with acceptance criteria:

1. **Count label fits its disc.** At 320x568, 360x640, 375x620, 375x667, 390x664, 393x659 and 390x844, "Breathe out" is one line. All four corners of its text box are at least 4px inside the disc. Ink on sage is 24px or more.
2. **The app is in the first phone screen.** At 390x664 and y=0, the counting numeral in the photograph is inside the viewport. So are the whole headline and "Book a demo". No sideways scroll.
3. **Heading stays visible on phone.** At 390x844, scroll to the hold, then up 200px. No part of the header overlaps "It counts, so you can finish."
4. **No collision at the first notch.** At 1440x900, settle at y=60, 120, 180 and 240. In each, either the copy is at 5% opacity or less, or the ground's edge is clear of the copy's box.
5. **Three inner pages open with their subject.** At 1440x900 and y=0, no empty area wider than 30% of the column and taller than 300px.
   - `/features/`: a working app screen is inside the first screen.
   - `/about/`: the clinic photograph is inside the first screen.
   - `/clinicians-and-specialists/`: the note is at least as large as the page's heading and drops the "From your clinician" line. At least one scroll-linked device from the home page is reused: the reading line, the rising ground, the steps rail or the counting ring.
   - Each still reads in full under reduced motion and with no JavaScript.
6. **Directory.** At y=6000 on desktop and phone the filter, or a control that returns to it, is inside the viewport. With no JavaScript no filter control shows.
7. **Small repairs.** Muted text reaches 4.5 to 1 on mint and on the count card's tint. Pause is 44px tall on phone. The error summary carries an icon. `/sign-up/` changes its heading when the patient choice is made.
8. **No regressions.** `behaviours.mjs`, `forms.mjs`, `journeys.mjs` and `webkit.mjs` pass against the production build. No console errors. Three type families. No white on either sage.

Scripts: `/private/tmp/claude-501/-Users-jakeshelley-dev-pelvy/c43f8c3a-5f61-4b57-bef2-790340e507cc/scratchpad/pw/`. Mine are in `fin/`: `label.mjs` and `label3.mjs` test item 1, `measure.mjs` tests the hold and the keyboard path.

## Recommendation

Spend round 2. Items 1 to 4 are small and sit in the first ten seconds on the commonest devices. Item 5 is the only route to Design 9 and Motion 8. Hold round 3 for recheck corrections. I would not expect to need round 4.

If the choice is to stop, item 1 still has to be fixed. It is a regression.

Named external blocker for launch, not a design failure: `PUBLIC_FORM_ENDPOINT` is unset because hosting is not chosen. Both forms open the visitor's email app, addressed to amelia@pelvy.app, and say "If nothing opened, nothing has been sent." That is honest and usable. Delivery itself is unverified.

## Captures

All under `.palate/critique/final/`. Desktop is 1440x900 at 1x. Phone is 390x844, touch, 2x, unless the name says otherwise. Sheets are contact sheets of consecutive viewport captures.

- Home, normal motion: `d-home-sheet0.jpg` to `8` (405px steps), `m-home-sheet0.jpg` to `6` (422px steps), `d-push-sheet.jpg`, `m-push-sheet.jpg`, `d-hero-nudge-120.png`, `d-try-hold.png`.
- Phone hero at real heights: `m390x664-rest.png`, `m390x664-try-out-crop.png` (3x), `m-small-label-sheet.jpg` (320x568, 360x640, 375x667).
- Other widths: `t820-m360-sheet.jpg` (820x1180, 360x640), `short-sheet.jpg` (1280x600, 1024x768).
- Reduced motion: `d-rm-home-sheet0.jpg` to `3`, `m-rm-home-sheet0.jpg` to `3`. No JavaScript: `d-nojs-home-sheet.jpg`, `d-nojs-bottom.png`, `desktop-nojs-clinicians-directory-top.png`.
- Inner pages, desktop: `d-clinicians-and-sheet0.jpg`, `d-general-users-sheet0.jpg`, `d-features-sheet0.jpg`, `d-about-sheet0.jpg`, `d-clinician-faqs-sheet0.jpg`, `d-blog-sheet0.jpg`, `d-pelvy-launch-p-sheet0.jpg`, `d-qld-top.jpg`, `d-contact-us-sheet0.jpg`, `d-sign-up-sheet0.jpg`, `d-privacy-policy-sheet0.jpg`, `d-nope-sheet0.jpg`, `d-dir-sheet.jpg`, and the `desktop-*-top.png` first screens.
- Inner pages, phone: `m-clinicians-sheet0.jpg`, `m-general-us-sheet0.jpg`, `m-features-sheet0.jpg`, `m-about-sheet0.jpg`, `phone-clinicians-directory-top.png`.
- States and journeys: `forms-sheet.jpg`, `m-journeys-sheet.jpg`, `d-journeys-sheet.jpg`, `journeys/`.
- Loops and references: `loops-sheet.jpg`, `webkit-sheet.jpg`, `refs-mobile-first-screens.jpg`.
- Data: `audit-desktop.json`, `audit-phone.json`, `measure-hero-desktop.json`, `measure-hero-phone.json`, `r1-audit-on-prod.txt`, `run-*.txt`.

## Limits

- Headless Chromium in an isolated Playwright. WebKit 26.6 ran the hero script only, 20 of 20. Inner pages were not walked in WebKit. No real device.
- Phone browser bar heights are reasoned, not measured on a device.
- Screen reader output was not heard. The live region is read from the DOM.
- Smoothness is not judged from stills.
- Forms were tested on the mailto path with the navigation observed, not followed. Nothing was sent.
- Reference inner pages were seen as stills. I make no claim about how they move.
- I ran the builder's `r1/audit.mjs` against the production build after reading it. I cross-checked the hold, keyboard path, phase frames, loops and label fit with my own scripts.
- Round 1 screenshots were not used as evidence.
