import { defineEventHandler } from 'h3';

interface MediumArticle {
  title: string;
  category: string;
  readTime: string;
  imageUrl: string;
  url: string;
  description: string;
}

export default defineEventHandler(async () => {
  try {
    const response = await fetch('https://medium.com/feed/@yolanda_santacruz');
    if (!response.ok) {
      throw new Error(`Failed to fetch Medium feed: ${response.statusText}`);
    }
    
    const xml = await response.text();
    const items: MediumArticle[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemContent = match[1];
      
      // Extract title (handling CDATA or raw tags)
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
      // Look in content:encoded first for subtitle/snippet
      const contentMatch = itemContent.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/);
      if (contentMatch) {
        const content = contentMatch[1];
        const subMatch = content.match(/<h4>([\s\S]*?)<\/h4>/) || content.match(/<p>([\s\S]*?)<\/p>/);
        if (subMatch) {
          // Strip any internal HTML tags (like links or span styling)
          description = subMatch[1].replace(/<[^>]*>/g, '').trim();
        }
      }
      
      // Fallback to description tag if content:encoded didn't yield a snippet
      if (!description) {
        const descMatch = itemContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || itemContent.match(/<description>([\s\S]*?)<\/description>/);
        if (descMatch) {
          description = descMatch[1].replace(/<[^>]*>/g, '').trim();
        }
      }
      
      // Cap description size for neat card alignment
      if (description.length > 180) {
        description = description.slice(0, 180) + '...';
      }
      
      // Extract first category tag to act as a tag/badge
      const categoryMatches = [...itemContent.matchAll(/<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g)];
      const categories = categoryMatches.map(m => m[1]);
      const category = categories.length > 0 ? categories[0] : 'Article';
      // Format category (e.g. "product-design" -> "Product Design")
      const formattedCategory = category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Estimate reading time from text content length
      let readTime = '5 min read';
      if (contentMatch) {
        const textOnly = contentMatch[1].replace(/<[^>]*>/g, '');
        const wordCount = textOnly.split(/\s+/).length;
        const wpm = 200; // Average reading speed
        const minutes = Math.max(1, Math.round(wordCount / wpm));
        readTime = `${minutes} min read`;
      }
      
      items.push({
        title,
        category: formattedCategory,
        readTime,
        imageUrl,
        url,
        description
      });
    }
    
    return { success: true, items };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[API publications] Failed to fetch or parse Medium RSS feed:', error);
    return { success: false, error: errorMessage };
  }
});
