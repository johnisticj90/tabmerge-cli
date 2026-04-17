/**
 * Sort bookmarks by various criteria
 */

/**
 * Sort bookmarks by title (alphabetical)
 * @param {Array} bookmarks
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array}
 */
function sortByTitle(bookmarks, order = 'asc') {
  const sorted = [...bookmarks].sort((a, b) => {
    const ta = (a.title || '').toLowerCase();
    const tb = (b.title || '').toLowerCase();
    return ta.localeCompare(tb);
  });
  return order === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Sort bookmarks by date added
 * @param {Array} bookmarks
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array}
 */
function sortByDate(bookmarks, order = 'asc') {
  const sorted = [...bookmarks].sort((a, b) => {
    const da = a.addDate ? Number(a.addDate) : 0;
    const db = b.addDate ? Number(b.addDate) : 0;
    return da - db;
  });
  return order === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Sort bookmarks by URL
 * @param {Array} bookmarks
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array}
 */
function sortByUrl(bookmarks, order = 'asc') {
  const sorted = [...bookmarks].sort((a, b) => {
    const ua = (a.url || '').toLowerCase();
    const ub = (b.url || '').toLowerCase();
    return ua.localeCompare(ub);
  });
  return order === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Sort bookmarks by a given field
 * @param {Array} bookmarks
 * @param {string} field - 'title' | 'date' | 'url'
 * @param {string} order - 'asc' | 'desc'
 * @returns {Array}
 */
function sort(bookmarks, field = 'title', order = 'asc') {
  switch (field) {
    case 'date': return sortByDate(bookmarks, order);
    case 'url': return sortByUrl(bookmarks, order);
    case 'title':
    default: return sortByTitle(bookmarks, order);
  }
}

module.exports = { sortByTitle, sortByDate, sortByUrl, sort };
