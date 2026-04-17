/**
 * Scores bookmarks by relevance/quality heuristics.
 */

const HTTPS_BONUS = 2;
const HAS_TITLE_BONUS = 1;
const HAS_TAGS_BONUS = 1;
const TAG_BONUS = 0.5;
const RECENT_BONUS = 3;
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * Score a single bookmark. Higher = more relevant/complete.
 * @param {object} bookmark
 * @returns {number}
 */
function scoreBookmark(bookmark) {
  let score = 0;

  if (!bookmark || !bookmark.url) return score;

  // Prefer HTTPS
  if (bookmark.url.startsWith('https://')) {
    score += HTTPS_BONUS;
  }

  // Has a meaningful title
  if (bookmark.title && bookmark.title.trim().length > 0) {
    score += HAS_TITLE_BONUS;
  }

  // Has tags
  const tags = bookmark.tags;
  if (Array.isArray(tags) && tags.length > 0) {
    score += HAS_TAGS_BONUS;
    score += Math.min(tags.length * TAG_BONUS, 3);
  }

  // Recency bonus (added within last year)
  if (bookmark.addDate) {
    const added = new Date(typeof bookmark.addDate === 'number'
      ? bookmark.addDate * 1000
      : bookmark.addDate);
    if (!isNaN(added) && Date.now() - added.getTime() < ONE_YEAR_MS) {
      score += RECENT_BONUS;
    }
  }

  return score;
}

/**
 * Annotate each bookmark with a `_score` field.
 * @param {object[]} bookmarks
 * @returns {object[]}
 */
function scoreAll(bookmarks) {
  return bookmarks.map(b => ({ ...b, _score: scoreBookmark(b) }));
}

/**
 * Sort bookmarks by score descending.
 * @param {object[]} bookmarks
 * @returns {object[]}
 */
function sortByScore(bookmarks) {
  return [...bookmarks].sort((a, b) =>
    (b._score ?? scoreBookmark(b)) - (a._score ?? scoreBookmark(a))
  );
}

module.exports = { scoreBookmark, scoreAll, sortByScore };
