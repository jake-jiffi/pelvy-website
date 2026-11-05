# Media in this build

Every image and clip the site shows, where it came from and what it is.

## Real photographs (from pelvy.app, measured before use)

| File | True size | Shown at most | Used on | Open item |
| --- | --- | --- | --- | --- |
| `src/assets/people/amelia-clinic.jpg` | 1170 x 755 | 1170px wide | Home (Amelia), About | Who owns it, and whether the man on the bed has signed a release (brand `imagery.rights`). |
| `src/assets/people/amelia-portrait.png` | 586 x 946, cut-out on white | 293px wide (2x) | About | Ownership to confirm. |
| `src/assets/people/launch-party-perth.webp` | 1200 x 675 | 1200px wide | Perth launch post, news index | Five identifiable people. Releases to confirm. The cards they hold carry the old line "Track Treat Thrive". |

Not used: the stock banner on the live inner pages (a hand with a pen, 1700 x 835), the stock people illustrations, the template testimonials and client logos, the Queensland Government graphic in the July post (theirs, not Pelvy's), and Amelia's "When Clinicians Subscribe" video (it carries "Track. Treat. Thrive." and the unsourced overlays "Save 30+ minutes every day" and "onboard in less than 20 minutes").

## Generated scenes (rooms and objects only, not labelled on the page)

The site labelled each scene as generated until 12 October 2026, when Jake asked for the labels to come off. The alt text still describes what each picture shows and does not say it is a photograph of a real place. `brand/brand.json` still carries the rule "Generated photography is limited to rooms and objects, and is labelled", so the site now departs from the brand file on that one point.

Stills were generated during the brand build (Higgsfield, GPT Image 2.5). The motion was generated for this site on 12 October 2026 with Higgsfield Kling 3.0. No people appear in any of them. Each is a candidate until Jake approves it by name.

| Site file | Source still | Motion job | Credits | What moves | Checked |
| --- | --- | --- | --- | --- | --- |
| `public/media/room-1080.mp4`, `room-720.mp4`, `src/assets/scenes/room.jpg` | `brand/media/photo/photo-a-phone-propped-up-at-home-showing-the-t-2.png`, cropped 1894 x 1894 at +333+717 | 1148e2b5-9e31-4948-9c9c-c9d6d26c2cb8 (1:1, pro, 10s, start and end frame the same). Replaces 81264e35, whose movement stayed in one corner. | 17.5 + 17.5 | The curtain billows in and settles; light and leaf shadow sweep the floor and the mat; the plant sways. 21% of pixels change by more than 12 of 255. | Phone screen corners fitted in five frames: steady to within 0.02% of the frame, and the same as the first clip's. First and last frame differ by RMSE 0.006, so it loops. |
| `public/media/desk-720.mp4`, `src/assets/scenes/desk.jpg` | `brand/media/scene/scene-patient-set-up-card-1.png`, cropped 5056 x 2844 at +0+274 | 9238d193-5ebf-445d-9f63-17e6174291aa (16:9, pro, 10s, loop). Replaces adb9a8a0, which did not visibly move (0% of pixels over the same threshold). | 17.5 + 17.5 | A band of warm light and leaf shadow crosses the desk and the card, then returns. 82% of pixels change by more than 12 of 255. | Dish, notebooks, pen and card stay still. Loops (RMSE 0.006). |
| `public/media/handout/01.webp` to `32.webp`, `src/assets/scenes/fridge.jpg` | `brand/media/photo/photo-the-old-way-1.png`, cropped 1971 x 3504 at +150+0 | 54d26dda-684c-44c7-a819-3136132d8092 (9:16, pro, 5s, one way) | 8.75 | The handout slips from the magnet and falls. Frames 1.625s to 2.925s. | Menu, drawing and magnet stay still. |

Total spent on this site: 78.75 credits (five clips, two of them superseded).

## Composited by the site, not generated

- The phone screen in the room is live HTML (`AppPlayer`), fitted to the screen's four measured corners and multiplied over the blank white screen.
- The card on the desk is live HTML (`SetupCard`), set from the brand's own card artwork.
- App screens (exercise player, treatment hub, program card) are HTML drawn from the brand's app artboards. They show Pelvy's new look. The app in the stores still uses its older colours.
