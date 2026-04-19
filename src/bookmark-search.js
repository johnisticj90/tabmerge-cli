// Full-text search across bookmark fields

/**
 * Score a bookmark against a query string
 * Returns 0 if no match, positive number based on match quality
 */
function scoreMatch(bookmark, query) {
  const q = query.toLowerCase();
  const title = (bookmark.title || '').toLowerCase();
  const url = (bookmark.url || '').toLowerCase();
  const tags = (bookmark.tags || []).join(' ').toLowerCase();

  let score = 0;
  if (title.includes(q)) score += title === q ? 10 : 5;
  if (url.includes(q)) score += 3;
  if (tags.includes(q)) score += 4;
  return score;
}

/**
 * Search bookmarks by a query string across title, url, and tags
 */
function search(bookmarks, query) {
  if (!query || !query.trim()) return bookmarks.slice();
  const q = query.trim();
  return bookmarks
    .map(b => ({ bookmark: b, score: scoreMatch(b, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ bookmark }) => bookmark);
}

/**
 * Search with multiple terms (AND logic)
 */
function searchAll(bookmarks, terms) {
  if (!terms || terms.length === 0) return bookmarks.slice();
  return terms.reduce((acc, term) => search(acc, term), bookmarks);
}

/**
 * Search with multiple terms (OR logic)
 */
function searchAny(bookmarks, terms) {
  if (!terms || terms.length === 0) return bookmarks.slice();
  const matched = new Map();
  for (const term of terms) {
    for (const b of search(bookmarks, term)) {
      matched.set(b.url, b);
    }
  }
  return Array.from(matched.values());
}

module.exports = { scoreMatch, search, searchAll, searchAny };
