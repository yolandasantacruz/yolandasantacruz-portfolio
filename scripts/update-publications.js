import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FEED_URL = 'https://medium.com/feed/@yolanda_santacruz';
const OUTPUT_FILE = path.join(__dirname, '../src/content/about/publications.md');

async function main() {
  try {
    console.log(`Fetching Medium RSS feed from ${FEED_URL}...`);
    const response = await fetch(FEED_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
    }
    const xml = await response.text();

    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemContent = match[1];

      // Extract title
      const titleMatch = itemContent.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || itemContent.match(/<title>([\s\S]*?)<\/title>/);
      const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

      // Extract link/url
      const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
      const url = linkMatch ? linkMatch[1].trim() : 'https://medium.com';

      // Extract cover image from content:encoded first img tag
      let imageUrl = 'https://placehold.co/600x400/1a1a1a/55c5c7?text=Medium+Article';
      const imgMatch = itemContent.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch) {
        imageUrl = imgMatch[1];
      }

      // Extract description snippet
      let description = '';
      const contentMatch = itemContent.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/);
      if (contentMatch) {
        const content = contentMatch[1];
        const subMatch = content.match(/<h4>([\s\S]*?)<\/h4>/) || content.match(/<p>([\s\S]*?)<\/p>/);
        if (subMatch) {
          description = subMatch[1].replace(/<[^>]*>/g, '').trim();
        }
      }

      if (!description) {
        const descMatch = itemContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || itemContent.match(/<description>([\s\S]*?)<\/description>/);
        if (descMatch) {
          description = descMatch[1].replace(/<[^>]*>/g, '').trim();
        }
      }

      if (description.length > 180) {
        description = description.slice(0, 180) + '...';
      }

      // Extract first category tag
      const categoryMatches = [...itemContent.matchAll(/<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g)];
      const categories = categoryMatches.map(m => m[1]);
      const category = categories.length > 0 ? categories[0] : 'Article';
      const formattedCategory = category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      items.push({
        tag: formattedCategory,
        title,
        description,
        imageUrl,
        url
      });
    }

    if (items.length === 0) {
      console.warn('No items parsed from Medium RSS feed.');
      return;
    }

    // Limit to top 3
    const topItems = items.slice(0, 3);

    const heading = "Articles, interviews & thought leadership";
    const moreArticlesUrl = "https://medium.com/@yolanda_santacruz";
    const moreArticlesLabel = "Explore more articles";

    const itemsYaml = topItems.map(item => {
      return `  - tag: ${JSON.stringify(item.tag)}
    title: ${JSON.stringify(item.title)}
    description: ${JSON.stringify(item.description)}
    imageUrl: ${JSON.stringify(item.imageUrl)}
    url: ${JSON.stringify(item.url)}`;
    }).join('\n');

    const markdownContent = `---
heading: ${JSON.stringify(heading)}
moreArticlesUrl: ${JSON.stringify(moreArticlesUrl)}
moreArticlesLabel: ${JSON.stringify(moreArticlesLabel)}
items:
${itemsYaml}
---
`;

    console.log(`Writing ${topItems.length} publications to ${OUTPUT_FILE}...`);
    fs.writeFileSync(OUTPUT_FILE, markdownContent, 'utf8');
    console.log('Successfully updated publications.md!');
  } catch (error) {
    console.error('Error fetching or updating publications:', error);
    // Exit with 0 so build processes do not fail if offline
    process.exit(0);
  }
}

main();
