// Auto-tag bookmarks based on URL patterns and title keywords

const DOMAIN_TAGS = [
  { pattern: /github\.com/, tag: 'dev' },
  { pattern: /stackoverflow\.com/, tag: 'dev' },
  { pattern: /npmjs\.com/, tag: 'dev' },
  { pattern: /youtube\.com|vimeo\.com/, tag: 'video' },
  { pattern: /twitter\.com|x\.com|mastodon/, tag: 'social' },
  { pattern: /reddit\.com/, tag: 'social' },
  { pattern: /medium\.com|dev\.to|substack\.com/, tag: 'blog' },
  { pattern: /wikipedia\.org/, tag: 'reference' },
  { pattern: /docs\./, tag: 'docs' },
];

const TITLE_TAGS = [
  { pattern: /tutorial|how.?to|guide|getting started/i, tag: 'tutorial' },
  { pattern: /\bapi\b|reference|docs/i, tag: 'docs' },
  { pattern: /video|watch|stream/i, tag: 'video' },
  { pattern: /news|breaking/i, tag: 'news' },
];

function inferTags(bookmark) {
  const tags = new Set(bookmark.tags || []);

  for (const { pattern, tag } of DOMAIN_TAGS) {
    if (pattern.test(bookmark.url)) tags.add(tag);
  }

  const title = bookmark.title || '';
  for (const { pattern, tag } of TITLE_TAGS) {
    if (pattern.test(title)) tags.add(tag);
  }

  return [...tags];
}

function applyTags(bookmarks, { overwrite = false } = {}) {
  return bookmarks.map(b => {
    const inferred = inferTags(b);
    const existing = overwrite ? [] : (b.tags || []);
    const merged = [...new Set([...existing, ...inferred])];
    return { ...b, tags: merged };
  });
}

module.exports = { inferTags, applyTags };
