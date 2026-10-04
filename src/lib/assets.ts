/**
 * Every image on the site comes from here.
 *
 * Artwork lives in S3 (`amzn-s3-bucket-common-kosmikha/rhaine-harvy/…`) and is
 * served through CloudFront. `scripts/upload-assets.mjs` encodes and uploads
 * it, and writes `src/data/media.json` - dimensions, the widths that exist, a
 * 24px LQIP and the dominant colour. This module turns that manifest into URLs.
 *
 * To add a piece: add a line to CATALOG in the upload script, run
 * `npm run assets:upload`, done.
 */
import media from "../data/media.json";

export const CDN = "https://d2jd2y2utwgsqv.cloudfront.net";

// TODO: add categories as the photo set takes shape.
export type CategorySlug = "gallery";

interface MediaEntry {
  slug: string;
  title: string;
  category: string;
  tag: string;
  width: number;
  height: number;
  /** Ascending. The last one is always the master (`full.webp`). */
  widths: number[];
  /** S3 key prefix, e.g. `rhaine-harvy/work/gallery/first-dance`. */
  base: string;
  lqip: string;
  color: string;
}

export interface Artwork {
  slug: string;
  title: string;
  category: CategorySlug;
  /** Format / sub-discipline, e.g. "Prenup". */
  tag: string;
  width: number;
  height: number;
  ratio: number;
  orientation: "portrait" | "landscape" | "square";
  /** Full-resolution master. */
  full: string;
  /** Smallest variant - for tiny UI (thumbnails, placeholders). */
  thumb: string;
  /** Closest variant at or above `w`. */
  src: (w: number) => string;
  srcset: string;
  lqip: string;
  color: string;
  /** Shared by every tile and the detail hero, so the frame morphs between them. */
  vtName: string;
  /** Optional looping video for this slot (reference media only, for now). */
  video?: string;
  /** True for borrowed preview media from scripts/reference-assets.mjs. */
  reference?: boolean;
}

/** Absolute CloudFront URL for any key under the bucket. */
export const cdn = (key: string) => `${CDN}/${key.replace(/^\/+/, "")}`;

function toArtwork(entry: MediaEntry): Artwork {
  const master = entry.widths[entry.widths.length - 1]!;
  const url = (w: number) =>
    cdn(`${entry.base}/${w === master ? "full" : w}.webp`);
  const ratio = entry.width / entry.height;

  return {
    slug: entry.slug,
    title: entry.title,
    category: entry.category as CategorySlug,
    tag: entry.tag,
    width: entry.width,
    height: entry.height,
    ratio,
    orientation:
      ratio > 1.06 ? "landscape" : ratio < 0.94 ? "portrait" : "square",
    full: url(master),
    thumb: url(entry.widths[0]!),
    src: (w) => url(entry.widths.find((x) => x >= w) ?? master),
    srcset: entry.widths.map((w) => `${url(w)} ${w}w`).join(", "),
    lqip: entry.lqip,
    color: entry.color,
    vtName: `art-${entry.slug}`,
  };
}

export const artworks: Artwork[] = (media as MediaEntry[]).map(toArtwork);

/*
 * Stand-in photography (scripts/reference-assets.mjs). The manifest is
 * gitignored, so it's loaded optionally: a fresh clone simply has none and
 * every empty slot shows its toned placeholder.
 */
interface ReferenceEntry {
  slug: string;
  title: string;
  src: string;
  width: number;
  height: number;
  lqip: string;
  color: string;
  video?: string;
}

const referenceFiles = import.meta.glob<{ default: Record<string, ReferenceEntry> }>(
  "../data/reference.json",
  { eager: true },
);
const references = Object.values(referenceFiles)[0]?.default ?? {};

function fromReference(entry: ReferenceEntry): Artwork {
  const ratio = entry.width / entry.height;
  return {
    slug: entry.slug,
    title: entry.title,
    category: "gallery",
    tag: "Reference",
    width: entry.width,
    height: entry.height,
    ratio,
    orientation:
      ratio > 1.06 ? "landscape" : ratio < 0.94 ? "portrait" : "square",
    full: entry.src,
    thumb: entry.src,
    src: () => entry.src,
    srcset: `${entry.src} ${entry.width}w`,
    lqip: entry.lqip,
    color: entry.color,
    vtName: `art-${entry.slug}`,
    video: entry.video,
    reference: true,
  };
}

/** A real uploaded photo wins; otherwise the reference stand-in, if any. */
export const getArtwork = (slug: string) =>
  artworks.find((a) => a.slug === slug) ??
  (references[slug] ? fromReference(references[slug]) : undefined);

export const byCategory = (category: CategorySlug) =>
  artworks.filter((a) => a.category === category);

/** Previous / next across the whole archive, wrapping. */
export function neighbours(slug: string) {
  const i = artworks.findIndex((a) => a.slug === slug);
  const n = artworks.length;
  return { prev: artworks[(i - 1 + n) % n]!, next: artworks[(i + 1) % n]! };
}
