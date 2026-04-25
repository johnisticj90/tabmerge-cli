// bookmark-priority.js — assign and manage priority levels for bookmarks

const LEVELS = ['low', 'normal', 'high', 'critical'];

function isValidPriority(p) {
  return LEVELS.includes(p);
}

function validatePriority(level) {
  if (!isValidPriority(level)) throw new Error(`Invalid priority: ${level}`);
}

function setPriority(bookmark, level) {
  validatePriority(level);
  return { ...bookmark, priority: level };
}

function clearPriority(bookmark) {
  const b = { ...bookmark };
  delete b.priority;
  return b;
}

function getPriority(bookmark) {
  return bookmark.priority || 'normal';
}

function filterByPriority(bookmarks, level) {
  validatePriority(level);
  return bookmarks.filter(b => getPriority(b) === level);
}

function filterAtLeast(bookmarks, level) {
  const idx = LEVELS.indexOf(level);
  if (idx === -1) throw new Error(`Invalid priority: ${level}`);
  return bookmarks.filter(b => LEVELS.indexOf(getPriority(b)) >= idx);
}

function sortByPriority(bookmarks, direction = 'desc') {
  const sorted = [...bookmarks].sort((a, b) => {
    const ai = LEVELS.indexOf(getPriority(a));
    const bi = LEVELS.indexOf(getPriority(b));
    return direction === 'desc' ? bi - ai : ai - bi;
  });
  return sorted;
}

function setPriorityAll(bookmarks, level) {
  return bookmarks.map(b => setPriority(b, level));
}

/**
 * Returns a summary count of bookmarks grouped by priority level.
 * @param {Array} bookmarks
 * @returns {Object} e.g. { low: 2, normal: 5, high: 1, critical: 0 }
 */
function countByPriority(bookmarks) {
  const counts = Object.fromEntries(LEVELS.map(l => [l, 0]));
  for (const b of bookmarks) {
    const p = getPriority(b);
    if (p in counts) counts[p]++;
  }
  return counts;
}

module.exports = {
  LEVELS,
  isValidPriority,
  setPriority,
  clearPriority,
  getPriority,
  filterByPriority,
  filterAtLeast,
  sortByPriority,
  setPriorityAll,
  countByPriority,
};
