import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, "..", "public", "nana.png");
const OUT = SRC;

// Two-stage thresholds.
// Flood fill only crosses pixels nearly equal to pure white, so it cannot
// leak through the anti-aliased edge of the rounded blue square.
// The fade band turns a small ring of edge pixels semi-transparent so the
// curved boundary still looks smooth.
const FLOOD_THRESHOLD = 250; // min RGB to be considered passable background
const FADE_INNER = 235;      // pixels darker than this stay fully opaque
const FADE_OUTER = 250;      // pixels >= this become fully transparent

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
if (channels !== 4) {
  throw new Error(`Expected 4-channel RGBA buffer, got ${channels}`);
}

const idx = (x, y) => (y * width + x) * 4;
const minRGB = (i) => Math.min(data[i], Math.min(data[i + 1], data[i + 2]));

// Stage 1: flood-fill the contiguous near-pure-white region from the corners.
const bg = new Uint8Array(width * height);
const stack = [];
const seed = (x, y) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const p = y * width + x;
  if (bg[p]) return;
  if (minRGB(idx(x, y)) < FLOOD_THRESHOLD) return;
  bg[p] = 1;
  stack.push(p);
};

seed(0, 0);
seed(width - 1, 0);
seed(0, height - 1);
seed(width - 1, height - 1);

while (stack.length) {
  const p = stack.pop();
  const x = p % width;
  const y = (p - x) / width;
  if (x > 0) seed(x - 1, y);
  if (x < width - 1) seed(x + 1, y);
  if (y > 0) seed(x, y - 1);
  if (y < height - 1) seed(x, y + 1);
}

// Stage 2: apply alpha. Background pixels go transparent; pixels adjacent to
// the background that fall in the fade band become semi-transparent so the
// rounded edge stays smooth.
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const p = y * width + x;
    const i = p * 4;

    if (bg[p]) {
      data[i + 3] = 0;
      continue;
    }

    let touchesBg = false;
    if (x > 0 && bg[p - 1]) touchesBg = true;
    else if (x < width - 1 && bg[p + 1]) touchesBg = true;
    else if (y > 0 && bg[p - width]) touchesBg = true;
    else if (y < height - 1 && bg[p + width]) touchesBg = true;
    if (!touchesBg) continue;

    const m = minRGB(i);
    if (m <= FADE_INNER) continue;
    if (m >= FADE_OUTER) {
      data[i + 3] = 0;
      continue;
    }
    const t = (m - FADE_INNER) / (FADE_OUTER - FADE_INNER);
    data[i + 3] = Math.round(data[i + 3] * (1 - t));
  }
}

await sharp(data, { raw: { width, height, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(OUT);

console.log(`Wrote ${OUT}`);
