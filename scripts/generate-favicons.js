import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SVG_PATH = join(ROOT, 'public', 'images', 'logo.svg');
const PUBLIC_DIR = join(ROOT, 'public');

function packIco(pngBuffers) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type: Icon
  header.writeUInt16LE(pngBuffers.length, 4); // Number of images

  const directoryEntries = [];
  let currentOffset = 6 + 16 * pngBuffers.length;

  for (const png of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(png.width >= 256 ? 0 : png.width, 0);
    entry.writeUInt8(png.height >= 256 ? 0 : png.height, 1);
    entry.writeUInt8(0, 2); // Palette colors
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(png.buffer.length, 8); // Image size
    entry.writeUInt32LE(currentOffset, 12); // Image offset

    directoryEntries.push(entry);
    currentOffset += png.buffer.length;
  }

  const buffers = [header, ...directoryEntries, ...pngBuffers.map(p => p.buffer)];
  return Buffer.concat(buffers);
}

async function main() {
  console.log('Loading SVG logo...');
  const svgContent = readFileSync(SVG_PATH, 'utf-8');
  
  // Create maskable version by replacing the circle with a rect
  const maskableSvgContent = svgContent.replace(
    '<circle cx="24" cy="24" r="24" fill="#fff"/>',
    '<rect width="48" height="48" fill="#fff"/>'
  );

  const svgBuffer = Buffer.from(svgContent);
  const maskableSvgBuffer = Buffer.from(maskableSvgContent);

  // Define outputs
  const targets = [
    { name: 'favicon-16x16.png', size: 16, maskable: false },
    { name: 'favicon-32x32.png', size: 32, maskable: false },
    { name: 'apple-touch-icon.png', size: 180, maskable: false },
    { name: 'android-chrome-192x192.png', size: 192, maskable: false },
    { name: 'android-chrome-512x512.png', size: 512, maskable: false },
    { name: 'android-chrome-maskable-192x192.png', size: 192, maskable: true },
    { name: 'android-chrome-maskable-512x512.png', size: 512, maskable: true }
  ];

  console.log('Generating images...');
  const pngBuffersForIco = [];

  for (const target of targets) {
    const buffer = target.maskable ? maskableSvgBuffer : svgBuffer;
    const outPath = join(PUBLIC_DIR, target.name);
    
    const pngBuffer = await sharp(buffer)
      .resize(target.size, target.size)
      .png()
      .toBuffer();

    writeFileSync(outPath, pngBuffer);
    console.log(`Generated ${target.name} (${target.size}x${target.size})`);

    if (target.name === 'favicon-16x16.png' || target.name === 'favicon-32x32.png') {
      pngBuffersForIco.push({
        width: target.size,
        height: target.size,
        buffer: pngBuffer
      });
    }
  }

  console.log('Generating favicon.ico...');
  const icoBuffer = packIco(pngBuffersForIco);
  writeFileSync(join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);
  console.log('Generated favicon.ico');

  console.log('All icons generated successfully!');
}

main().catch(console.error);
