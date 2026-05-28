import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const legacyDir = '/Users/zorphdark/dev/yolandasantacruz-portfolio/legacy-site';
const fontsDir = path.join(legacyDir, 'assets', 'fonts');
const cssDir = path.join(legacyDir, 'assets', 'css');

// Ensure fonts directory exists
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

// Config from Typekit script
const fontConfigs = [
  // ftnk (Futura PT)
  {
    family: 'ftnk',
    weight: '300',
    style: 'normal',
    url: 'https://use.typekit.net/af/9c3000/000000000000000077586b5e/31/l?subset_id=1&fvd=n3&v=3',
    filename: 'ftnk-300-normal.woff2'
  },
  {
    family: 'ftnk',
    weight: '600',
    style: 'normal',
    url: 'https://use.typekit.net/af/5c9bb8/00000000000000007735d694/31/l?subset_id=1&fvd=n6&v=3',
    filename: 'ftnk-600-normal.woff2'
  },
  {
    family: 'ftnk',
    weight: '700',
    style: 'normal',
    url: 'https://use.typekit.net/af/361f51/000000000000000077586b60/31/l?subset_id=1&fvd=n7&v=3',
    filename: 'ftnk-700-normal.woff2'
  },
  // wjzg (Futura PT Condensed / Adobe Clean)
  {
    family: 'wjzg',
    weight: '300',
    style: 'italic',
    url: 'https://use.typekit.net/af/b96a62/00000000000000007753c3af/31/l?subset_id=1&fvd=i3&v=3',
    filename: 'wjzg-300-italic.woff2'
  },
  {
    family: 'wjzg',
    weight: '300',
    style: 'normal',
    url: 'https://use.typekit.net/af/72b457/00000000000000007753c3b5/31/l?subset_id=1&fvd=n3&v=3',
    filename: 'wjzg-300-normal.woff2'
  },
  {
    family: 'wjzg',
    weight: '400',
    style: 'normal',
    url: 'https://use.typekit.net/af/a24fc8/00000000000000007753c3ae/31/l?subset_id=1&fvd=n4&v=3',
    filename: 'wjzg-400-normal.woff2'
  },
  {
    family: 'wjzg',
    weight: '500',
    style: 'normal',
    url: 'https://use.typekit.net/af/1b7608/00000000000000007753c3b0/31/l?subset_id=1&fvd=n5&v=3',
    filename: 'wjzg-500-normal.woff2'
  },
  {
    family: 'wjzg',
    weight: '600',
    style: 'normal',
    url: 'https://use.typekit.net/af/4fa2f6/00000000000000007753c3b6/31/l?subset_id=1&fvd=n6&v=3',
    filename: 'wjzg-600-normal.woff2'
  },
  {
    family: 'wjzg',
    weight: '700',
    style: 'normal',
    url: 'https://use.typekit.net/af/9f5daf/00000000000000007753c3bf/31/l?subset_id=1&fvd=n7&v=3',
    filename: 'wjzg-700-normal.woff2'
  },
  {
    family: 'wjzg',
    weight: '800',
    style: 'normal',
    url: 'https://use.typekit.net/af/0789c1/00000000000000007753c3ad/31/l?subset_id=1&fvd=n8&v=3',
    filename: 'wjzg-800-normal.woff2'
  }
];

// 1. Download font binaries
console.log('Downloading font binaries...');
fontConfigs.forEach(font => {
  const destPath = path.join(fontsDir, font.filename);
  if (fs.existsSync(destPath)) {
    console.log(`Already downloaded: ${font.filename}`);
    return;
  }
  console.log(`Downloading ${font.family} (weight: ${font.weight}, style: ${font.style})...`);
  try {
    execSync(`curl -L -s "${font.url}" -o "${destPath}"`);
    console.log(`Successfully downloaded: ${font.filename}`);
  } catch (err) {
    console.error(`Failed to download ${font.filename}:`, err.message);
  }
});

// 2. Generate fonts.css
console.log('\nGenerating fonts.css stylesheet...');
let cssContent = '/* Localized Adobe Typekit Offline Fonts */\n\n';
fontConfigs.forEach(font => {
  cssContent += `@font-face {\n`;
  cssContent += `  font-family: "${font.family}";\n`;
  cssContent += `  src: url("../fonts/${font.filename}") format("woff2");\n`;
  cssContent += `  font-weight: ${font.weight};\n`;
  cssContent += `  font-style: ${font.style};\n`;
  cssContent += `  font-display: swap;\n`;
  cssContent += `}\n\n`;
  
  // Typekit sometimes refers to families with prefixed styles (e.g. tk-ftnk-n3)
  const fvdChar = font.style === 'italic' ? 'i' : 'n';
  const fvd = `${fvdChar}${font.weight.charAt(0)}`;
  const prefixedFamily = `tk-${font.family}-${fvd}`;
  
  cssContent += `@font-face {\n`;
  cssContent += `  font-family: "${prefixedFamily}";\n`;
  cssContent += `  src: url("../fonts/${font.filename}") format("woff2");\n`;
  cssContent += `  font-weight: ${font.weight};\n`;
  cssContent += `  font-style: ${font.style};\n`;
  cssContent += `  font-display: swap;\n`;
  cssContent += `}\n\n`;
});

const fontsCssPath = path.join(cssDir, 'fonts.css');
fs.writeFileSync(fontsCssPath, cssContent, 'utf8');
console.log(`fonts.css written to ${fontsCssPath}`);

// 3. Inject reference in HTML files
console.log('\nInjecting fonts.css reference in HTML pages...');
const htmlFiles = fs.readdirSync(legacyDir).filter(file => file.endsWith('.html'));

htmlFiles.forEach(file => {
  const filePath = path.join(legacyDir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Inject fonts.css link tag inside head if not already present
  if (!html.includes('assets/css/fonts.css')) {
    const linkTag = '\n    <link rel="stylesheet" href="./assets/css/fonts.css">';
    // Insert right after the last stylesheet link or before </head>
    if (html.includes('</head>')) {
      html = html.replace('</head>', `${linkTag}\n  </head>`);
      fs.writeFileSync(filePath, html, 'utf8');
      console.log(`Injected link tag into ${file}`);
    }
  } else {
    console.log(`Link tag already present in ${file}`);
  }
});

console.log('\nOffline fonts setup completed successfully!');
