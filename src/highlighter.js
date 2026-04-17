/**
 * Highlights matching query terms in bookmark titles and URLs.
 */

const RESET = '\x1b[0m';
const BOLD_YELLOW = '\x1b[1;33m';

/**
 * Wraps matched substrings with ANSI escape codes.
 * @param {string} text
 * @param {string} query
 * @param {boolean} color
 * @returns {string}
 */
function highlight(text, query, color = true) {
  if (!text || !query) return text || '';
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${escaped})`, 'gi');
  if (!color) {
    return text.replace(re, '[$1]');
  }
  return text.replace(re, `${BOLD_YELLOW}$1${RESET}`);
}

/**
 * Applies highlighting to title and url fields of a bookmark.
 * @param {object} bookmark
 * @param {string} query
 * @param {object} options
 * @returns {object}
 */
function highlightBookmark(bookmark, query, { color = true, fields = ['title', 'url'] } = {}) {
  if (!query) return bookmark;
  const result = { ...bookmark };
  for (const field of fields) {
    if (typeof result[field] === 'string') {
      result[field] = highlight(result[field], query, color);
    }
  }
  return result;
}

/**
 * Applies highlighting to an array of bookmarks.
 * @param {object[]} bookmarks
 * @param {string} query
 * @param {object} options
 * @returns {object[]}
 */
function highlightAll(bookmarks, query, options = {}) {
  return bookmarks.map(b => highlightBookmark(b, query, options));
}

module.exports = { highlight, highlightBookmark, highlightAll };
