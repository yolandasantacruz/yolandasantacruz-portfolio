import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADPLIST_URL = 'https://adplist.org/mentors/yolanda-santa-cruz';
const OUTPUT_FILE = path.join(__dirname, '../src/content/about/mentorship.md');

/**
 * Extracts JSON-LD Person schema from raw HTML.
 * Returns the parsed object or null.
 */
function extractJsonLdPerson(html) {
  const jsonLdRegex = /<script\s+type="application\/ld\+json"\s*>([\s\S]*?)<\/script>/g;
  let match;
  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      if (data['@type'] === 'Person') {
        return data;
      }
    } catch {
      // Skip malformed JSON-LD blocks
    }
  }
  return null;
}

/**
 * Extracts the __NEXT_DATA__ hydration payload from raw HTML.
 * Returns the parsed object or null.
 */
function extractNextData(html) {
  const nextDataRegex = /<script\s+id="__NEXT_DATA__"\s+type="application\/json"\s*>([\s\S]*?)<\/script>/;
  const match = html.match(nextDataRegex);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

/**
 * Reads the existing mentorship.md and splits it into frontmatter fields and body text.
 * Preserves any fields not managed by this script (e.g. badge, title, videoUrl).
 */
function readExistingFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!fmMatch) {
    return { body: raw, preservedLines: [] };
  }
  return {
    preservedLines: fmMatch[1].split('\n'),
    body: fmMatch[2]
  };
}

async function main() {
  try {
    console.log(`Fetching ADPList profile from ${ADPLIST_URL}...`);
    const response = await fetch(ADPLIST_URL, {
      headers: {
        // Mimic a browser to avoid potential bot blocks
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBuild/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    // --- Extract rating + reviewsCount from JSON-LD ---
    const personLd = extractJsonLdPerson(html);
    let rating = null;
    let reviewsCount = null;

    if (personLd?.aggregateRating) {
      rating = personLd.aggregateRating.ratingValue ?? null;
      reviewsCount = personLd.aggregateRating.ratingCount ?? null;
    }

    // --- Extract is_active from __NEXT_DATA__ ---
    const nextData = extractNextData(html);
    let isActive = null;

    if (nextData?.props?.pageProps?.mentor) {
      const mentor = nextData.props.pageProps.mentor;
      // Active means: is_active=true, not suspended, not on break
      isActive = mentor.is_active === true
        && !mentor.suspended_at
        && !mentor.on_break;
    }

    console.log('Extracted ADPList stats:');
    console.log(`  rating: ${rating}`);
    console.log(`  reviewsCount: ${reviewsCount}`);
    console.log(`  available: ${isActive}`);

    if (rating === null && reviewsCount === null && isActive === null) {
      console.warn('Could not extract any stats from ADPList. Skipping update.');
      return;
    }

    // --- Read existing mentorship.md and preserve non-metric fields ---
    const { preservedLines, body } = readExistingFile(OUTPUT_FILE);

    // Rebuild frontmatter: keep all lines except the metrics block, then append fresh metrics
    const newFmLines = [];
    let insideMetrics = false;

    for (const line of preservedLines) {
      // Detect the start of the metrics: array
      if (/^metrics:\s*$/.test(line)) {
        insideMetrics = true;
        continue;
      }
      // Skip nested array items inside metrics
      if (insideMetrics) {
        if (/^\s+-\s|^\s+\w/.test(line)) {
          continue;
        }
        // A non-indented line means we've left the metrics block
        insideMetrics = false;
      }
      newFmLines.push(line);
    }

    // Build the fresh metrics array in YAML
    const metrics = [];

    // Keep the existing "Sessions Hosted" metric as-is (manual until minutes API available)
    metrics.push({ num: '"200+"', label: '"Sessions Hosted"' });

    if (reviewsCount !== null && rating !== null) {
      metrics.push({ num: `"${reviewsCount}"`, label: `"Reviews (${rating}★)"` });
    }

    // Badge: derive from active status
    if (isActive !== null) {
      metrics.push({ num: '"Super Mentor"', label: '"ADPList Badge"' });
    }

    newFmLines.push('metrics:');
    for (const m of metrics) {
      newFmLines.push(`  - num: ${m.num}`);
      newFmLines.push(`    label: ${m.label}`);
    }

    const markdownContent = `---\n${newFmLines.join('\n')}\n---\n${body}`;

    console.log(`Writing updated mentorship stats to ${OUTPUT_FILE}...`);
    fs.writeFileSync(OUTPUT_FILE, markdownContent, 'utf8');
    console.log('Successfully updated mentorship.md with live ADPList stats!');
  } catch (error) {
    console.error('Error fetching or updating ADPList stats:', error);
    // Exit with 0 so build processes do not fail if offline
    process.exit(0);
  }
}

main();
