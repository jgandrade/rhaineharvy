# Rhaine & Harvy - wedding RSVP

Astro static site + GSAP (ScrollTrigger, ScrollSmoother). Structure and motion
follow verostudio.com, re-toned to burgundy: ivory `#f4eeea`, ink `#1e1416`,
wine `#6e1a2b`. Libre Caslon Text (headings: CAPS with *italic* asides) + Lato
(body), self-hosted in `public/fonts`. The pairing follows the couple's
reference invitation (CaslonMO Pro Light Italic + Lato); Libre Caslon is the
open-licence stand-in for CaslonMO, a Morisawa TypeSquare font.

| Command                 | Does                                             |
| ----------------------- | ------------------------------------------------ |
| `npm run dev`           | Dev server on http://localhost:4321              |
| `npm run build`         | Static build into `dist/`                        |
| `npm run preview`       | Serve the build                                  |
| `npm run assets:upload` | Encode photos → WebP → S3, rewrite the manifest  |

## Copy

All of it lives in `src/lib/site.ts`. `*word*` renders as lowercase italic
inside a CAPS headline. Wedding facts still to confirm are marked `TODO`.

## Photos

Every frame is a `<Media slug="…">`. Until a photo with that slug is uploaded
it shows a toned placeholder labelled with its slot. To fill one: drop the file
in `assets-src/`, add a CATALOG line in `scripts/upload-assets.mjs` with the
slug below (category `gallery`), run `npm run assets:upload`.

| Slug                               | Where                                       |
| ---------------------------------- | ------------------------------------------- |
| `hero`                             | Full-screen opener (also last preloader frame) |
| `preloader-1` … `preloader-3`      | Small window in the preloader               |
| `promise-portrait`                 | Tall portrait under "TWO hearts"            |
| `story-1` … `story-3`              | Full-screen chapters: Hello / Yes / I do    |
| `day-portrait`                     | Pinned left half of "The day"               |
| `day-1` … `day-5`                  | Right column of "The day"                   |
| `moment-01` … `moment-20`          | Moments masonry wall (any aspect ratio)     |

A hero video can replace the hero photo: set `SITE.heroVideo` to its URL.

### Photography (live)

The couple's own photos (shared Drive folder) fill the promise portrait, the
"The day" frames and all twenty moments - each CATALOG line links its Drive
file. The landscape slots - `hero`, `preloader-1` … `3`, `story-1` … `3` -
still hold the interim Unsplash photos below.

Those interim slots hold a free-license Unsplash photo
([unsplash.com/license](https://unsplash.com/license) - commercial use allowed),
uploaded to S3 via `npm run assets:upload`. Replace any of them by dropping the
couple's own photo into `assets-src/<slug>.jpg` and re-running the upload.

<details><summary>Photo sources</summary>

| Slot | Unsplash page |
| ---- | ------------- |
| `hero` | https://unsplash.com/photos/man-and-woman-kissing-on-brown-grass-field-during-daytime-haRyBAihS_0 |
| `preloader-1` | https://unsplash.com/photos/a-black-and-white-photo-of-a-womans-dress-LAnaayWiBuw |
| `preloader-2` | https://unsplash.com/photos/woman-in-white-floral-dress-holding-green-plant-QKYxgkaTmQk |
| `preloader-3` | https://unsplash.com/photos/woman-touching-chest-of-man-BOhDR9n4u2s |
| `promise-portrait` | https://unsplash.com/photos/woman-in-white-wedding-dress-standing-near-window-during-daytime-zGtGfqQqe6U |
| `story-1` | https://unsplash.com/photos/couple-looks-at-each-other-lovingly-in-a-field-3qKpnFMcNdM |
| `story-2` | https://unsplash.com/photos/woman-touch-mans-hand-N1CZNuM_Fd8 |
| `story-3` | https://unsplash.com/photos/grayscale-shot-of-bride-and-groom-FTW8ADj5igs |
| `day-portrait` | https://unsplash.com/photos/woman-wearing-wedding-gown-white-holding-bouquet-qQ01rvKkE0w |
| `day-1` | https://unsplash.com/photos/groom-and-bridge-about-to-kiss-during-daytime-7baHM9rEYUw |
| `day-2` | https://unsplash.com/photos/grayscale-photo-of-woman-in-wedding-gown-0gVEoi52d-E |
| `day-3` | https://unsplash.com/photos/woman-in-white-tank-top-jpiiDziFagQ |
| `day-4` | https://unsplash.com/photos/newly-wedded-couple-standing-on-shore-during-daytime-H_cZqryUuok |
| `day-5` | https://unsplash.com/photos/a-close-up-of-a-purse-MS0VPle30z0 |
| `moment-01` | https://unsplash.com/photos/woman-in-white-wedding-dress-mLIurLmSRAY |
| `moment-02` | https://unsplash.com/photos/man-in-black-suit-kissing-woman-in-white-wedding-dress-jbaF5N0uO0k |
| `moment-03` | https://unsplash.com/photos/man-kissing-shoulder-of-woman-4nPVmlj8ngM |
| `moment-04` | https://unsplash.com/photos/a-woman-in-a-wedding-dress-spraying-herself-with-water-ri4X7rIavK4 |
| `moment-05` | https://unsplash.com/photos/a-person-in-a-white-dress-YfkB8R3GB4M |
| `moment-06` | https://unsplash.com/photos/a-couple-of-women-standing-next-to-each-other-twnM_uWr3Gc |
| `moment-07` | https://unsplash.com/photos/a-woman-in-a-dress-holding-a-bouquet-of-flowers-hFsZ_rWqJyo |
| `moment-08` | https://unsplash.com/photos/woman-wearing-white-floral-wedding-dress-holding-bouquet-BJfGfaCKFn0 |
| `moment-09` | https://unsplash.com/photos/a-bride-and-groom-walking-on-the-beach-Fp5v1bp_0JI |
| `moment-10` | https://unsplash.com/photos/woman-wearing-white-sheer-lace-wedding-gown-KRPCwGCzUJs |
| `moment-11` | https://unsplash.com/photos/bride-holding-bouquet-standing-on-white-stairs-BruuboWUC_U |
| `moment-12` | https://unsplash.com/photos/woman-in-white-floral-wedding-dress--shn8ecaH2w |
| `moment-13` | https://unsplash.com/photos/a-close-up-of-two-people-holding-hands-ZkgitNKeR9U |
| `moment-14` | https://unsplash.com/photos/selective-focus-photography-of-two-gold-colored-rings-on-black-stone-during-daytime-AKbE5xlIZXA |
| `moment-15` | https://unsplash.com/photos/a-group-of-women-standing-next-to-each-other-tYuVJ2xRnKk |
| `moment-16` | https://unsplash.com/photos/a-bride-and-her-bridesmaids-standing-together-EjL8PUEu4HU |
| `moment-17` | https://unsplash.com/photos/clear-long-stem-wine-glasses-on-table-hw_sKmjb0ns |
| `moment-18` | https://unsplash.com/photos/a-wooden-table-topped-with-plates-and-glasses-_9Lh9_uO34o |
| `moment-19` | https://unsplash.com/photos/woman-in-white-wedding-dress-nKsev-cGRuA |
| `moment-20` | https://unsplash.com/photos/a-woman-with-a-veil-on-her-head-PPuWCyPxVCk |

</details>

### Reference stand-ins (preview only)

`npm run assets:reference` fills every slot with borrowed photos and video from
wedding20251012-ny.studio.site, verostudio.com and wedding.jongjeonglee.com
(source files in `assets-ref/`, slot map in `scripts/reference-assets.mjs`).
It writes `public/ref/` and `src/data/reference.json` - all gitignored, never
uploaded to S3. A real uploaded photo always wins over a stand-in.

**These belong to other people.** Before any deploy, delete `public/ref/` and
`src/data/reference.json` (or rebuild on a clean clone) so none of it ships.

## RSVP

`src/scripts/rsvp.ts` POSTs the form as JSON to `PUBLIC_RSVP_ENDPOINT`
(`.env.local`). Until that's set, the form validates and tells guests replies
open soon - nothing is sent.

## Sections (`src/components`)

Preloader → Hero → Promise (pinned second line) → Story (pinned stepper) →
Day (diptych + schedule, venues, dress code) → Moments (masonry wall) → Verse
(seal) → Notes (wine panel: intimate gathering / adults only / gifts) → Rsvp
(invitation summary + form card) → Footer (closing, venues, links). All motion is in
`src/scripts/motion.ts`; reduced-motion users get a still, fully visible page.
