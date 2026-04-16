/**
 * Deduplicates bookmarks by URL, keeping the first occurrence.
 * Optionally merges tags from duplicates.
 */

/**
 * Normalize a URL for comparison (lowercase, strip trailing slash)
 * @param {string} url
 * @returns {string}
 */
function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    let normalized = parsed.href.toLowerCase();
    if (normalized.endsWith('/') && parsed.pathname === '/') {
      normalized = normalized.slice(0, -1);
    }
    return normalized;
  } catch {
    return url.toLowerCase().trim();
  }
}

/**
 * Deduplicate an array of bookmark objects.
 * Each bookmark: { url, title, tags?, addDate? }
 *
 * @param {Array<object>} bookmarks
 * @param {{ mergeTags?: boolean }} options
 * @returns {{ bookmarks: Array<object>, duplicatesRemoved: number }}
 */
function deduplicate(bookmarks, options = {}) {
  const { mergeTags = true } = options;
  const seen = new Map();
  let duplicatesRemoved = 0;

  for (const bookmark of bookmarks) {
    const key = normalizeUrl(bookmark.url);

    if (seen.has(key)) {
      duplicatesRemoved++;
      if (mergeTags && bookmark.tags && bookmark.tags.length > 0) {
        const existing = seen.get(key);
        const merged = new Set([...(existing.tags || []), ...bookmark.tags]);
        existing.tags = Array.from(merged);
      }
    } else {
      seen.set(key, { ...bookmark });
    }
  }

  return {
    bookmarks: Array.from(seen.values()),
    duplicatesRemoved,
  };
}

module.exports = { deduplicate, normalizeUrl };
