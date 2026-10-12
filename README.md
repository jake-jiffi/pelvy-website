# Pelvy website

The marketing site for Pelvy, built with Astro. Static output, no server.

## Run it

```bash
npm ci
npm run dev            # http://127.0.0.1:4321
npm run check          # type check
npm run build          # writes dist/
npm run preview        # serves dist/
```

Node 22.12 or newer.

## Where things live

| What | Where |
| --- | --- |
| Every fact the site states (prices, links, contact, reach), with its source | `src/data/site.ts` |
| FAQ answers | `src/data/faqs.ts` |
| The clinic directory, parsed from pelvy.app on 12 October 2026 | `src/data/clinics.json` |
| Amelia's posts, word for word | `src/content/posts/*.md` |
| Brand tokens, copied from `brand/tokens/tokens.css`. Do not edit: change the brand file and copy again. | `src/styles/tokens.css` |
| The site's own roles on top of the tokens | `src/styles/global.css` |
| The working exercise screen and its clock | `src/components/AppPlayer.astro`, `src/scripts/player.ts` |
| The opening push-in | `src/components/home/Hero.astro`, `src/scripts/hero.ts` |

Page addresses match the live WordPress site, so nothing indexed or linked breaks.

Paths that start with `brand/` point at the Pelvy brand folder. It is not in this repository. Ask Jake for it.

## Before it goes live

1. **Enquiries.** The two forms (`/contact-us/`, `/sign-up/`) have nowhere to post yet. Until `PUBLIC_FORM_ENDPOINT` is set at build time they open the visitor's email app with the message written to amelia@pelvy.app, and say so. Set the variable to a URL that accepts a JSON `POST` and answers 2xx, and they send there instead.
2. **Amelia to confirm:** the clinic price and the six free months, a current clinic count, the refund policy for store subscriptions, and that a clinic patient still sees their clinician's note first.
3. **Rights:** who owns the three photographs of Amelia, and releases for the people in them.
4. **The logo** is the brand's candidate. Nobody has approved it yet.
5. **Generated scenes** (the room, the fridge, the desk) carry no label on the page. Jake had the labels taken off on 12 October 2026. The brand file still says generated photography "is labelled" (`brand/brand.json`, imagery rules), so either record that decision there or put the labels back. Approve the scenes by name or replace them with photographs.

Every fact the site states carries its source as a comment in `src/data/site.ts`. The full claims ledger and the media provenance record are kept out of this repository. Ask Jake for them.

## Motion

Higgsfield (Kling 3.0) made three clips from the brand's generated stills: a 10 second loop of the room, a loop of the clinic desk, and the handout falling from the fridge. The phone screen in the room is live HTML fitted to the screen's four corners, which were measured from the clip's frames (`QUAD` in `src/scripts/hero.ts`). If the room clip is ever replaced, measure its corners again.

Everything honours `prefers-reduced-motion`: nothing plays or counts by itself, and the exercise screen still works when Start is pressed. With JavaScript off, every page reads in full.
