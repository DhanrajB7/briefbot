import * as cheerio from 'cheerio';

export async function extractTextFromURL(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; BriefBot/1.0; +https://briefbot.dev)',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove unwanted elements
  $('script, style, nav, footer, header, aside, iframe, noscript').remove();

  // Try to find main content
  const selectors = ['article', 'main', '[role="main"]', '.post-content', '.article-body', '.entry-content'];
  let text = '';

  for (const selector of selectors) {
    const el = $(selector);
    if (el.length) {
      text = el.text();
      break;
    }
  }

  // Fallback to body
  if (!text.trim()) {
    text = $('body').text();
  }

  // Clean whitespace
  return text.replace(/\s+/g, ' ').trim();
}
