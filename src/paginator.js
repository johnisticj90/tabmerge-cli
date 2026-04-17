/**
 * Paginator — split large bookmark lists into pages
 */

/**
 * @param {Array} items
 * @param {number} pageSize
 * @returns {{ pages: Array[], totalPages: number, totalItems: number }}
 */
function paginate(items, pageSize = 50) {
  if (!Array.isArray(items)) throw new TypeError('items must be an array');
  if (pageSize < 1) throw new RangeError('pageSize must be >= 1');

  const pages = [];
  for (let i = 0; i < items.length; i += pageSize) {
    pages.push(items.slice(i, i + pageSize));
  }
  if (pages.length === 0) pages.push([]);

  return {
    pages,
    totalPages: pages.length,
    totalItems: items.length,
  };
}

/**
 * @param {Array} items
 * @param {number} page  1-based
 * @param {number} pageSize
 * @returns {{ items: Array, page: number, pageSize: number, totalPages: number, totalItems: number }}
 */
function getPage(items, page = 1, pageSize = 50) {
  const { pages, totalPages, totalItems } = paginate(items, pageSize);
  const idx = page - 1;
  if (idx < 0 || idx >= totalPages) {
    throw new RangeError(`page ${page} out of range (1–${totalPages})`);
  }
  return {
    items: pages[idx],
    page,
    pageSize,
    totalPages,
    totalItems,
  };
}

module.exports = { paginate, getPage };
