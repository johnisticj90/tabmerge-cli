/**
 * Filter bookmarks by various criteria
 */

/**
 * Filter bookmarks by domain
 * @param {Array} bookmarks
 * @param {string} domain
 * @returns {Array}
 */
function filterByDomain(bookmarks, domain) {
  const normalized = domain.toLowerCase().replace(/^www\./, '');
  return bookmarks.filter(b => {
    try {
      const host = new URL(b.url).hostname.toLowerCase().replace(/^www\./, '');
      return host === normalized || host.endsWith('.' + normalized);
    } catch {
      return false;
    }
  });
}

/**
 * Filter bookmarks by tag
 * @param {Array} bookmarks
 * @param {string} tag
 * @returns {Array}
 */
function filterByTag(bookmarks, tag) {
  const t = tag.toLowerCase();
  return bookmarks.filter(b =>
    Array.isArray(b.tags) && b.tags.some(bt => bt.toLowerCase() === t)
  );
}

/**
 * Filter bookmarks added after a given date
 * @param {Array} bookmarks
 * @param {Date} date
 * @returns {Array}
 */
function filterByDateAfter(bookmarks, date) {
  return bookmarks.filter(b => b.addDate && new Date(b.addDate * 1000) >= date);
}

/**
 * Filter bookmarks whose title or url match a search string
 * @param {Array} bookmarks
 * @param {string} query
 * @returns {Array}
 */
function filterByQuery(bookmarks, query) {
  const q = query.toLowerCase();
  return bookmarks.filter(b =>
    (b.title && b.title.toLowerCase().includes(q)) ||
    (b.url && b.url.toLowerCase().includes(q))
  );
}

module.exports = { filterByDomain, filterByTag, filterByDateAfter, filterByQuery };
