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
 */
const CATALOG = [
  // { file: "hero.jpg", category: "gallery", slug: "hero", title: "Hero", tag: "Photo" },
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
