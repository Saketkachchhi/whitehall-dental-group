/**
 * Generates responsive AVIF/WebP/fallback derivatives for every source image,
 * plus the social share card, into public/images/opt/.
 *
 * Sources live in assets-src/ (NOT under public/) so the multi-megabyte
 * originals are never deployed — only the generated derivatives ship.
 *
 * Run with: node scripts/optimize-images.mjs
 * Requires: npm i -D sharp
 */
import sharp from "sharp";
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";

const SRC = path.resolve("assets-src");
const OUT = path.resolve("public/images/opt");
mkdirSync(OUT, { recursive: true });

/** width ladders per role */
const JOBS = [
  { file: "exterior.png", widths: [640, 960, 1280, 1600, 1836], fallback: "jpg" },
  { file: "dr-hn.png", widths: [320, 480, 640, 900], fallback: "jpg" },
  { file: "dr-jvp.png", widths: [320, 480, 640, 900], fallback: "jpg" },
  { file: "dr-rt.png", widths: [320, 480, 640, 900], fallback: "jpg" },
  { file: "reception.jpeg", widths: [400, 600, 900, 1200], fallback: "jpg" },
  { file: "waiting.jpeg", widths: [400, 600, 900, 1200], fallback: "jpg" },
  { file: "hallway.jpeg", widths: [400, 600, 900, 1200], fallback: "jpg" },
  { file: "treatment.jpeg", widths: [400, 600, 900, 1200], fallback: "jpg" },
  { file: "operatory.jpeg", widths: [400, 600, 900, 1200], fallback: "jpg" },
  // logo carries transparency -> png fallback, no jpg
  { file: "whitehall-logo.png", widths: [200, 300, 400], fallback: "png" },
];

const bytes = (p) => statSync(p).size;
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

let beforeTotal = 0;
let afterTotal = 0;

for (const job of JOBS) {
  const src = path.join(SRC, job.file);
  const base = job.file.replace(/\.(png|jpe?g)$/i, "");
  const meta = await sharp(src).metadata();
  beforeTotal += bytes(src);

  for (const w of job.widths) {
    if (w > meta.width) continue;
    const pipe = () => sharp(src).resize({ width: w, withoutEnlargement: true });

    const avifPath = path.join(OUT, `${base}-${w}.avif`);
    const webpPath = path.join(OUT, `${base}-${w}.webp`);
    const fbPath = path.join(OUT, `${base}-${w}.${job.fallback}`);

    await pipe().avif({ quality: 55, effort: 4 }).toFile(avifPath);
    await pipe().webp({ quality: 78, effort: 5 }).toFile(webpPath);
    if (job.fallback === "jpg") {
      await pipe().jpeg({ quality: 80, mozjpeg: true }).toFile(fbPath);
    } else {
      await pipe().png({ compressionLevel: 9, palette: true }).toFile(fbPath);
    }
    afterTotal += bytes(avifPath) + bytes(webpPath) + bytes(fbPath);
    console.log(
      `${base}-${w}  avif ${kb(bytes(avifPath))} | webp ${kb(bytes(webpPath))} | ${job.fallback} ${kb(bytes(fbPath))}`,
    );
  }
}

/* ---- social share card: 1200x630, required by og:image ---- */
const ogPath = path.join(OUT, "og-image.jpg");
await sharp(path.join(SRC, "exterior.png"))
  .resize({ width: 1200, height: 630, fit: "cover", position: "attention" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(ogPath);
console.log(`og-image.jpg  ${kb(bytes(ogPath))}`);

console.log(`\nsource total: ${kb(beforeTotal)}`);
console.log(`derivative total (all widths, all formats): ${kb(afterTotal)}`);
