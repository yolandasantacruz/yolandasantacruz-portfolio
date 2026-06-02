/**
 * optimize-images.js — Generate responsive srcset variants for heavy images.
 *
 * For each source image, produces 400w, 800w, and 1200w variants at quality 80.
 * Originals are preserved with an .original.webp suffix.
 *
 * Usage: node scripts/optimize-images.js
 */

import sharp from 'sharp';
import { copyFileSync, existsSync } from 'node:fs';
import { join, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const IMAGES_DIR = join(ROOT, 'public', 'images');

const WIDTHS = [400, 800, 1200];
const QUALITY = 95;

/**
 * Images to process — paths relative to public/images/
 * Only images > 150KB that benefit from responsive variants.
 */
const IMAGES = [
  'about/at-work.webp',
  'projects/fetch-pay/research.webp',
  'projects/fetch-pay/wireframes.webp',
  'projects/fetch-pay/main.webp',
  'projects/fetch-pay/solutions.webp',
  'projects/isles-at-bayshore/landing-page.webp',
  'about/portrait-1.webp',
  'projects/fetch-pay/industry-standards-1.webp',
  'projects/fetch-pay/industry-standards-2.webp',
  'projects/fetch-pay/industry-standards-3.webp',
  'projects/plant-me/screen-1.webp',
  'projects/plant-me/screen-2.webp',
  'projects/plant-me/screen-3.webp',
  'projects/plant-me/screen-4.webp',
  'projects/plant-me/screen-5.webp',
  'projects/plant-me/screen-6.webp',
  'projects/plant-me/screen-7.webp',
  'projects/plant-me/screen-8.webp',
  'projects/plant-me/screen-9.webp',
  'projects/plant-me/screen-10.webp',
  'projects/plant-me/usability-testing.webp',
  'projects/plant-me/main.webp',
  'projects/pay-with-app/main.webp',
  'projects/pay-with-app/research1.webp',
  'projects/pay-with-app/research2.webp',
];

async function processImage(relativePath) {
  const srcPath = join(IMAGES_DIR, relativePath);
  if (!existsSync(srcPath)) {
    console.log(`  [SKIP] ${relativePath} — file not found`);
    return;
  }

  const dir = dirname(srcPath);
  const name = basename(relativePath, extname(relativePath));
  const originalBackup = join(dir, `${name}.original.webp`);

  // Back up original if not already backed up
  if (!existsSync(originalBackup)) {
    copyFileSync(srcPath, originalBackup);
    console.log(`  [BACKUP] ${name}.original.webp`);
  }

  const metadata = await sharp(srcPath).metadata();
  const srcWidth = metadata.width || 1200;

  for (const width of WIDTHS) {
    // Skip variant if source is narrower than target
    if (width > srcWidth) {
      console.log(`  [SKIP] ${name}-${width}w.webp — source only ${srcWidth}px wide`);
      continue;
    }

    const outPath = join(dir, `${name}-${width}w.webp`);
    await sharp(srcPath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outPath);

    const { size } = await sharp(outPath).metadata().catch(() => ({ size: 0 }));
    console.log(`  [GENERATED] ${name}-${width}w.webp`);
  }

  // Also re-compress the original at the same quality as a 1200w "default"
  // (this becomes the new default src for non-srcset browsers)
  const recompressedPath = join(dir, `${name}.webp`);
  await sharp(originalBackup)
    .resize({ width: Math.min(srcWidth, 1200), withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(recompressedPath + '.tmp');

  // Replace original with recompressed version
  copyFileSync(recompressedPath + '.tmp', recompressedPath);
  const { unlink } = await import('node:fs/promises');
  await unlink(recompressedPath + '.tmp');
  console.log(`  [RECOMPRESSED] ${name}.webp at q${QUALITY}`);
}

async function main() {
  console.log(`[optimize-images] Processing ${IMAGES.length} images...`);
  console.log(`[optimize-images] Widths: ${WIDTHS.join(', ')}px | Quality: ${QUALITY}\n`);

  for (const img of IMAGES) {
    console.log(`Processing: ${img}`);
    await processImage(img);
    console.log('');
  }

  console.log('[optimize-images] Done! Originals preserved as *.original.webp');
}

main().catch(console.error);
