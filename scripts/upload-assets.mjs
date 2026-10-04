/**
 * Source artwork → WebP → S3 (served through CloudFront).
 *
 *   npm run assets:upload [-- --source <dir>] [--force]
 *
 * For every piece in CATALOG this:
 *   1. encodes responsive WebP widths (640 → 2560, never upscaled) plus a
 *      full-resolution master, all at high quality so nothing visibly degrades;
 *   2. uploads them to s3://<bucket>/rhaine-harvy/work/<category>/<slug>/<hash>/<w>.webp
 *      with a one-year immutable Cache-Control. <hash> is a digest of the
 *      source file, so replacing a piece always yields new URLs - CloudFront
 *      never has to be invalidated (and this IAM user can't invalidate anyway);
 *   3. records dimensions, a 24px LQIP data URI and the dominant colour in
 *      src/data/media.json, which src/lib/assets.ts turns into CloudFront URLs.
 *
 * Objects that already exist with the same byte size are skipped, so re-runs
 * are cheap. Pass --force to re-upload everything.
 */
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import sharp from "sharp";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(root, ".env.local"), quiet: true });

const args = process.argv.slice(2);
const argValue = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};

const SOURCE =
  argValue("--source") ??
  // TODO: point at the folder of photos once we have them.
  path.join(root, "assets-src");
const FORCE = args.includes("--force");
const BUCKET = "amzn-s3-bucket-common-kosmikha";
const PREFIX = "rhaine-harvy";
const OUT_FILE = path.join(root, "src/data/media.json");

const WIDTHS = [640, 1280, 1920, 2560];
/* Display sizes: q90 is visually lossless on this kind of artwork. */
const WEBP_DISPLAY = {
  quality: 90,
  effort: 6,
  smartSubsample: true,
  alphaQuality: 100,
};
/* The master behind "view full resolution" gets a little more headroom. */
const WEBP_MASTER = {
  quality: 93,
  effort: 6,
  smartSubsample: true,
  alphaQuality: 100,
};
/* Masters are capped here; beyond it no screen benefits and bytes balloon. */
const MASTER_MAX = 3200;

/**
 * The curated catalogue. Everything the site shows comes from here.
 *
 * Interim photography: free-license Unsplash photos (unsplash.com/license -
 * commercial use allowed, no permission needed), one per slot, until the
 * couple's own photos replace them. Keep the slugs; swap the files.
 */
const CATALOG = [
  // https://unsplash.com/photos/man-and-woman-kissing-on-brown-grass-field-during-daytime-haRyBAihS_0
  { file: "hero.jpg", category: "gallery", slug: "hero", title: "Hero", tag: "Unsplash" },
  // https://unsplash.com/photos/a-black-and-white-photo-of-a-womans-dress-LAnaayWiBuw
  { file: "preloader-1.jpg", category: "gallery", slug: "preloader-1", title: "Preloader 1", tag: "Unsplash" },
  // https://unsplash.com/photos/woman-in-white-floral-dress-holding-green-plant-QKYxgkaTmQk
  { file: "preloader-2.jpg", category: "gallery", slug: "preloader-2", title: "Preloader 2", tag: "Unsplash" },
  // https://unsplash.com/photos/woman-touching-chest-of-man-BOhDR9n4u2s
  { file: "preloader-3.jpg", category: "gallery", slug: "preloader-3", title: "Preloader 3", tag: "Unsplash" },
  // https://unsplash.com/photos/woman-in-white-wedding-dress-standing-near-window-during-daytime-zGtGfqQqe6U
  { file: "promise-portrait.jpg", category: "gallery", slug: "promise-portrait", title: "Promise Portrait", tag: "Unsplash" },
  // https://unsplash.com/photos/couple-looks-at-each-other-lovingly-in-a-field-3qKpnFMcNdM
  { file: "story-1.jpg", category: "gallery", slug: "story-1", title: "Story 1", tag: "Unsplash" },
  // https://unsplash.com/photos/woman-touch-mans-hand-N1CZNuM_Fd8
  { file: "story-2.jpg", category: "gallery", slug: "story-2", title: "Story 2", tag: "Unsplash" },
  // https://unsplash.com/photos/grayscale-shot-of-bride-and-groom-FTW8ADj5igs
  { file: "story-3.jpg", category: "gallery", slug: "story-3", title: "Story 3", tag: "Unsplash" },
  // https://unsplash.com/photos/woman-wearing-wedding-gown-white-holding-bouquet-qQ01rvKkE0w
  { file: "day-portrait.jpg", category: "gallery", slug: "day-portrait", title: "Day Portrait", tag: "Unsplash" },
  // https://unsplash.com/photos/groom-and-bridge-about-to-kiss-during-daytime-7baHM9rEYUw
  { file: "day-1.jpg", category: "gallery", slug: "day-1", title: "Day 1", tag: "Unsplash" },
  // https://unsplash.com/photos/grayscale-photo-of-woman-in-wedding-gown-0gVEoi52d-E
  { file: "day-2.jpg", category: "gallery", slug: "day-2", title: "Day 2", tag: "Unsplash" },
  // https://unsplash.com/photos/woman-in-white-tank-top-jpiiDziFagQ
  { file: "day-3.jpg", category: "gallery", slug: "day-3", title: "Day 3", tag: "Unsplash" },
  // https://unsplash.com/photos/newly-wedded-couple-standing-on-shore-during-daytime-H_cZqryUuok
  { file: "day-4.jpg", category: "gallery", slug: "day-4", title: "Day 4", tag: "Unsplash" },
  // https://unsplash.com/photos/a-close-up-of-a-purse-MS0VPle30z0
  { file: "day-5.jpg", category: "gallery", slug: "day-5", title: "Day 5", tag: "Unsplash" },
  // https://unsplash.com/photos/woman-in-white-wedding-dress-mLIurLmSRAY
  { file: "moment-01.jpg", category: "gallery", slug: "moment-01", title: "Moment 01", tag: "Unsplash" },
  // https://unsplash.com/photos/man-in-black-suit-kissing-woman-in-white-wedding-dress-jbaF5N0uO0k
  { file: "moment-02.jpg", category: "gallery", slug: "moment-02", title: "Moment 02", tag: "Unsplash" },
  // https://unsplash.com/photos/man-kissing-shoulder-of-woman-4nPVmlj8ngM
  { file: "moment-03.jpg", category: "gallery", slug: "moment-03", title: "Moment 03", tag: "Unsplash" },
  // https://unsplash.com/photos/a-woman-in-a-wedding-dress-spraying-herself-with-water-ri4X7rIavK4
  { file: "moment-04.jpg", category: "gallery", slug: "moment-04", title: "Moment 04", tag: "Unsplash" },
  // https://unsplash.com/photos/a-person-in-a-white-dress-YfkB8R3GB4M
  { file: "moment-05.jpg", category: "gallery", slug: "moment-05", title: "Moment 05", tag: "Unsplash" },
  // https://unsplash.com/photos/a-couple-of-women-standing-next-to-each-other-twnM_uWr3Gc
  { file: "moment-06.jpg", category: "gallery", slug: "moment-06", title: "Moment 06", tag: "Unsplash" },
  // https://unsplash.com/photos/a-woman-in-a-dress-holding-a-bouquet-of-flowers-hFsZ_rWqJyo
  { file: "moment-07.jpg", category: "gallery", slug: "moment-07", title: "Moment 07", tag: "Unsplash" },
  // https://unsplash.com/photos/woman-wearing-white-floral-wedding-dress-holding-bouquet-BJfGfaCKFn0
  { file: "moment-08.jpg", category: "gallery", slug: "moment-08", title: "Moment 08", tag: "Unsplash" },
  // https://unsplash.com/photos/a-bride-and-groom-walking-on-the-beach-Fp5v1bp_0JI
  { file: "moment-09.jpg", category: "gallery", slug: "moment-09", title: "Moment 09", tag: "Unsplash" },
  // https://unsplash.com/photos/woman-wearing-white-sheer-lace-wedding-gown-KRPCwGCzUJs
  { file: "moment-10.jpg", category: "gallery", slug: "moment-10", title: "Moment 10", tag: "Unsplash" },
  // https://unsplash.com/photos/bride-holding-bouquet-standing-on-white-stairs-BruuboWUC_U
  { file: "moment-11.jpg", category: "gallery", slug: "moment-11", title: "Moment 11", tag: "Unsplash" },
  // https://unsplash.com/photos/woman-in-white-floral-wedding-dress--shn8ecaH2w
  { file: "moment-12.jpg", category: "gallery", slug: "moment-12", title: "Moment 12", tag: "Unsplash" },
  // https://unsplash.com/photos/a-close-up-of-two-people-holding-hands-ZkgitNKeR9U
  { file: "moment-13.jpg", category: "gallery", slug: "moment-13", title: "Moment 13", tag: "Unsplash" },
  // https://unsplash.com/photos/selective-focus-photography-of-two-gold-colored-rings-on-black-stone-during-daytime-AKbE5xlIZXA
  { file: "moment-14.jpg", category: "gallery", slug: "moment-14", title: "Moment 14", tag: "Unsplash" },
  // https://unsplash.com/photos/a-group-of-women-standing-next-to-each-other-tYuVJ2xRnKk
  { file: "moment-15.jpg", category: "gallery", slug: "moment-15", title: "Moment 15", tag: "Unsplash" },
  // https://unsplash.com/photos/a-bride-and-her-bridesmaids-standing-together-EjL8PUEu4HU
  { file: "moment-16.jpg", category: "gallery", slug: "moment-16", title: "Moment 16", tag: "Unsplash" },
  // https://unsplash.com/photos/clear-long-stem-wine-glasses-on-table-hw_sKmjb0ns
  { file: "moment-17.jpg", category: "gallery", slug: "moment-17", title: "Moment 17", tag: "Unsplash" },
  // https://unsplash.com/photos/a-wooden-table-topped-with-plates-and-glasses-_9Lh9_uO34o
  { file: "moment-18.jpg", category: "gallery", slug: "moment-18", title: "Moment 18", tag: "Unsplash" },
  // https://unsplash.com/photos/woman-in-white-wedding-dress-nKsev-cGRuA
  { file: "moment-19.jpg", category: "gallery", slug: "moment-19", title: "Moment 19", tag: "Unsplash" },
  // https://unsplash.com/photos/a-woman-with-a-veil-on-her-head-PPuWCyPxVCk
  { file: "moment-20.jpg", category: "gallery", slug: "moment-20", title: "Moment 20", tag: "Unsplash" },
];

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

async function remoteSize(Key) {
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key }));
    return head.ContentLength;
  } catch {
    return undefined;
  }
}

async function put(Key, Body) {
  if (!FORCE && (await remoteSize(Key)) === Body.length) return false;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key,
      Body,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return true;
}

const toHex = ({ r, g, b }) =>
  `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;

async function processPiece(piece) {
  const file = path.join(SOURCE, piece.file);
  const input = sharp(file, { limitInputPixels: false }).rotate();
  const { width, height } = await input.metadata();
  const digest = createHash("sha1")
    .update(await fs.readFile(file))
    .digest("hex")
    .slice(0, 10);
  const base = `${PREFIX}/work/${piece.category}/${piece.slug}/${digest}`;

  const widths = WIDTHS.filter((w) => w < width);
  const masterWidth = Math.min(width, MASTER_MAX);

  const jobs = [
    ...widths.map(async (w) => ({
      key: `${base}/${w}.webp`,
      body: await input.clone().resize(w).webp(WEBP_DISPLAY).toBuffer(),
    })),
    (async () => ({
      key: `${base}/full.webp`,
      body: await input
        .clone()
        .resize(masterWidth, null, { withoutEnlargement: true })
        .webp(WEBP_MASTER)
        .toBuffer(),
    }))(),
  ];
  const encoded = await Promise.all(jobs);

  let uploaded = 0;
  let bytes = 0;
  for (const { key, body } of encoded) {
    bytes += body.length;
    if (await put(key, body)) uploaded++;
  }

  const [lqipBuf, stats] = await Promise.all([
    input
      .clone()
      .resize(24)
      .modulate({ saturation: 1.15 })
      .webp({ quality: 55, effort: 6 })
      .toBuffer(),
    input.clone().stats(),
  ]);

  const masterHeight = Math.round((height * masterWidth) / width);
  const sourceBytes = (await fs.stat(file)).size;
  console.log(
    `  ${piece.slug.padEnd(28)} ${`${width}x${height}`.padEnd(10)} ` +
      `${(sourceBytes / 1e6).toFixed(1)}MB src → ${(encoded.at(-1).body.length / 1e6).toFixed(2)}MB master` +
      `  (${uploaded}/${encoded.length} uploaded)`,
  );

  return {
    slug: piece.slug,
    title: piece.title,
    category: piece.category,
    tag: piece.tag,
    width: masterWidth,
    height: masterHeight,
    widths: [...widths, masterWidth],
    base,
    lqip: `data:image/webp;base64,${lqipBuf.toString("base64")}`,
    color: toHex(stats.dominant),
    bytes,
  };
}

console.log(
  `[assets] ${CATALOG.length} pieces → s3://${BUCKET}/${PREFIX}/work/`,
);
const results = [];
// A few at a time: sharp is multi-threaded already, S3 puts are I/O-bound.
for (let i = 0; i < CATALOG.length; i += 4) {
  results.push(
    ...(await Promise.all(CATALOG.slice(i, i + 4).map(processPiece))),
  );
}

await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
await fs.writeFile(OUT_FILE, `${JSON.stringify(results, null, "\t")}\n`);
const total = results.reduce((sum, r) => sum + r.bytes, 0);
console.log(
  `[assets] done - ${(total / 1e6).toFixed(1)}MB of WebP, manifest at src/data/media.json`,
);
