/**
 * postbuild.js — Auto-generates sitemap.xml from Analog prerendered routes.
 *
 * Runs after `vite build` and scans the output directory for .html files,
 * producing a valid sitemap.xml in the build output.
 *
 * Usage: node scripts/postbuild.js
 */

import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// The prerendered static output directory from Analog's build
const OUTPUT_DIR = join(ROOT, 'dist', 'analog', 'public');
const SITE_URL = 'https://yolandasantacruz.com';

/**
 * Recursively find all .html files under a directory.
 */
function findHtmlFiles(dir, results = []) {
  if (!existsSync(dir)) return results;

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      findHtmlFiles(fullPath, results);
    } else if (entry.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Convert an HTML file path to a sitemap URL path.
 * e.g. dist/analog/public/about/index.html → /about
 */
function toUrlPath(htmlPath) {
  let rel = relative(OUTPUT_DIR, htmlPath).replace(/\\/g, '/');
  // Strip trailing index.html
  rel = rel.replace(/\/index\.html$/, '').replace(/^index\.html$/, '');
  return '/' + rel;
}

// Priority mapping — higher for top-level pages, lower for deep project pages
function getPriority(urlPath) {
  if (urlPath === '/') return '1.0';
  if (urlPath === '/about' || urlPath === '/resume') return '0.8';
  return '0.6';
}

function generateSitemap() {
  if (!existsSync(OUTPUT_DIR)) {
    console.log('[postbuild] Output directory not found — skipping sitemap generation.');
    console.log(`[postbuild] Expected: ${OUTPUT_DIR}`);
    return;
  }

  const htmlFiles = findHtmlFiles(OUTPUT_DIR);
  const urls = htmlFiles
    .map(toUrlPath)
    // Exclude asset/utility paths
    .filter(url => !url.includes('/assets/') && !url.includes('/.'))
    .sort();

  const today = new Date().toISOString().split('T').at(0);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/2005/sitemap">
${urls.map(url => `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${today}</lastmod>
    <priority>${getPriority(url)}</priority>
  </url>`).join('\n')}
</urlset>
`;

  const sitemapPath = join(OUTPUT_DIR, 'sitemap.xml');
  writeFileSync(sitemapPath, xml, 'utf-8');
  console.log(`[postbuild] Generated sitemap.xml with ${urls.length} URLs → ${sitemapPath}`);
}

generateSitemap();
