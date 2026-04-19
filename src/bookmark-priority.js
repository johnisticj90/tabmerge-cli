// bookmark-priority.js — assign and manage priority levels for bookmarks

const LEVELS = ['low', 'normal', 'high', 'critical'];

function isValidPriority(p) {
  return LEVELS.includes(p);
}

function setPriority(bookmark, level) {
  if (!isValidPriority(level)) throw new Error(`Invalid priority: ${level}`);
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
  if (!isValidPriority(level)) throw new Error(`Invalid priority: ${level}`);
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
};
