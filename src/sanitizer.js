/**
 * sanitizer.js — clean up bookmark fields
 */

function sanitizeUrl(url) {
  if (typeof url !== 'string') return '';
  const trimmed = url.trim();
  // strip javascript: and data: urls
  if (/^javascript:/i.test(trimmed) || /^data:/i.test(trimmed)) return '';
  return trimmed;
}

function sanitizeTitle(title) {
  if (typeof title !== 'string') return '';
  return title
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[\x00-\x1F\x7F]/g, '');
}

function sanitizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return tags
    .map(t => (typeof t === 'string' ? t.trim().toLowerCase() : ''))
    .filter(t => t.length > 0)
    .filter((t, i, arr) => arr.indexOf(t) === i);
}

function sanitizeBookmark(bookmark) {
  if (!bookmark || typeof bookmark !== 'object') return null;
  const url = sanitizeUrl(bookmark.url);
  if (!url) return null;
  return {
    ...bookmark,
    url,
    title: sanitizeTitle(bookmark.title || ''),
    tags: sanitizeTags(bookmark.tags),
  };
}

function sanitizeAll(bookmarks) {
  if (!Array.isArray(bookmarks)) return [];
  return bookmarks
    .map(sanitizeBookmark)
    .filter(b => b !== null);
}

module.exports = { sanitizeUrl, sanitizeTitle, sanitizeTags, sanitizeBookmark, sanitizeAll };
