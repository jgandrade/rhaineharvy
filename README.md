# Rhaine & Harvy - wedding RSVP

Astro static site + GSAP (ScrollTrigger, ScrollSmoother). Structure and motion
follow verostudio.com, re-toned to burgundy: ivory `#f4eeea`, ink `#1e1416`,
wine `#6e1a2b`. Cormorant Garamond (CAPS with *italic* asides) + Hanken
Grotesk, self-hosted in `public/fonts`.

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
| `moment-01` … `moment-20`          | Moments grid                                |

A hero video can replace the hero photo: set `SITE.heroVideo` to its URL.

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
Day (diptych + schedule) → Moments (drifting grid) → Verse (seal) → Notes
(intimate gathering / adults only / gifts) → Rsvp → Footer. All motion is in
`src/scripts/motion.ts`; reduced-motion users get a still, fully visible page.
