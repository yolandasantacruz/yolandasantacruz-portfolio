import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(ROOT, 'public');

const SVG_CONTENT = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#fff"/><path fill="#00a29a" d="m15.6 15.125-.095.112c-1.78 2.157-.144 4.928 2.324 6.243.337.18.695.387 1.08.645 2 1.343 2.929.07 3.499-.5.5-.5.592-1.5.5-2-.09-.492-.868-3-2.175-4.5s-3.825-1.5-5.133 0"/><path fill="#00a29a" d="M34.236 15.125c-1.2-1.2-3.449-1.107-4.5-.5-1.05.607-1.87 1.676-3 4.5-3 7.5-5.236 8-7.5 9-1.649.728-3.5.5-4.5 1.5-.79.79-1.5 3 1 4.5 4.223 2.533 11-6 15-10 3.5-3.5 3-2.5 4-4s1-3.5-.5-5"/></svg>`;

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
  const svgContent = SVG_CONTENT;
  
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
