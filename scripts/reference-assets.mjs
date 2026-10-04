/**
 * Stand-in photography for previewing the layout before the couple's own
 * photos exist.
 *
 *   npm run assets:reference
 *
 * Reads borrowed reference media from assets-ref/ (gathered from
 * wedding20251012-ny.studio.site, verostudio.com and wedding.jongjeonglee.com),
 * encodes local WebP copies into public/ref/ and writes
 * src/data/reference.json. src/lib/assets.ts uses an entry only when no real
 * uploaded photo has that slug.
 *
 * These belong to other people: all three outputs are gitignored, and this
 * script never touches S3. Nothing here may ship.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(root, "assets-ref");
const OUT_DIR = path.join(root, "public/ref");
const OUT_FILE = path.join(root, "src/data/reference.json");
const MAX = 2000;

/** slot → source file (and an optional looping video for that slot). */
const SLOTS = {
  hero: { file: "ny-01.webp", video: "jj-intro.mp4" },
  "preloader-1": { file: "ny-05.webp" },
  "preloader-2": { file: "ny-03.webp" },
  "preloader-3": { file: "ny-11.webp" },

  "promise-portrait": { file: "ny-17.webp" },

  "story-1": { file: "ny-02.webp" },
  "story-2": { file: "ny-09.webp" },
  "story-3": { file: "ny-15.webp" },

  "day-portrait": { file: "ny-13.webp" },
  "day-1": { file: "ny-14.webp" },
  "day-2": { file: "vero-09.png" },
  "day-3": { file: "vero-07.png" },
  "day-4": { file: "ny-07.webp" },
  "day-5": { file: "vero-04.png" },

  "moment-01": { file: "vero-10.png" },
  "moment-02": { file: "ny-03.webp" },
  "moment-03": { file: "vero-21.png" },
  "moment-04": { file: "ny-06.webp" },
  "moment-05": { file: "vero-14.png" },
  "moment-06": { file: "vero-26.png" },
  "moment-07": { file: "ny-12.webp" },
  "moment-08": { file: "vero-11.jpg" },
  "moment-09": { file: "ny-10.webp" },
  "moment-10": { file: "vero-16.jpg" },
  "moment-11": { file: "ny-08.webp" },
  "moment-12": { file: "vero-18.png" },
  "moment-13": { file: "vero-22.png" },
  "moment-14": { file: "ny-04.webp" },
  "moment-15": { file: "vero-24.jpg" },
  "moment-16": { file: "vero-20.jpg" },
  "moment-17": { file: "ny-16.webp" },
  "moment-18": { file: "vero-13.png" },
  "moment-19": { file: "vero-27.png" },
  "moment-20": { file: "vero-17.jpg" },
};

const toHex = ({ r, g, b }) =>
  `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;

await fs.mkdir(OUT_DIR, { recursive: true });
const manifest = {};
const encoded = new Map();

for (const [slug, { file, video }] of Object.entries(SLOTS)) {
  const src = path.join(SOURCE, file);
  const name = `${path.parse(file).name}.webp`;

  if (!encoded.has(file)) {
    const input = sharp(src, { limitInputPixels: false }).rotate();
    const { width, height } = await input.metadata();
    const scale = Math.min(1, MAX / Math.max(width, height));
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);
    await input.clone().resize(w, h).webp({ quality: 82, effort: 5 }).toFile(path.join(OUT_DIR, name));
    const [lqip, stats] = await Promise.all([
      input.clone().resize(24).webp({ quality: 50 }).toBuffer(),
      input.clone().stats(),
    ]);
    encoded.set(file, {
      src: `/ref/${name}`,
      width: w,
      height: h,
      lqip: `data:image/webp;base64,${lqip.toString("base64")}`,
      color: toHex(stats.dominant),
    });
  }

  const entry = { slug, title: `Reference - ${slug}`, ...encoded.get(file) };
  if (video) {
    await fs.copyFile(path.join(SOURCE, video), path.join(OUT_DIR, video));
    entry.video = `/ref/${video}`;
  }
  manifest[slug] = entry;
  console.log(`  ${slug.padEnd(18)} ← ${file}${video ? ` + ${video}` : ""}`);
}

await fs.writeFile(OUT_FILE, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`[reference] ${Object.keys(manifest).length} slots → ${path.relative(root, OUT_FILE)}`);
