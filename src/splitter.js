// Split a flat bookmark list into chunks by size or count

/**
 * Split bookmarks into chunks of a given size.
 * @param {object[]} bookmarks
 * @param {number} chunkSize
 * @returns {object[][]}
 */
function chunkBySize(bookmarks, chunkSize) {
  if (!Number.isInteger(chunkSize) || chunkSize < 1) {
    throw new Error('chunkSize must be a positive integer');
  }
  const chunks = [];
  for (let i = 0; i < bookmarks.length; i += chunkSize) {
    chunks.push(bookmarks.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Split bookmarks into exactly n parts (as evenly as possible).
 * @param {object[]} bookmarks
 * @param {number} n
 * @returns {object[][]}
 */
function splitIntoParts(bookmarks, n) {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error('n must be a positive integer');
  }
  const total = bookmarks.length;
  const parts = [];
  let start = 0;
  for (let i = 0; i < n; i++) {
    const remaining = n - i;
    const partSize = Math.ceil((total - start) / remaining);
    parts.push(bookmarks.slice(start, start + partSize));
    start += partSize;
  }
  return parts.filter(p => p.length > 0);
}

/**
 * Split bookmarks by a predicate into two groups: matching and non-matching.
 * @param {object[]} bookmarks
 * @param {function} predicate
 * @returns {{ matched: object[], rest: object[] }}
 */
function splitByPredicate(bookmarks, predicate) {
  const matched = [];
  const rest = [];
  for (const b of bookmarks) {
    (predicate(b) ? matched : rest).push(b);
  }
  return { matched, rest };
}

module.exports = { chunkBySize, splitIntoParts, splitByPredicate };
