/**
 * bookmark-locks.js
 * Lock/unlock bookmarks to prevent accidental modification or deletion.
 */

function isLocked(bookmark) {
  return bookmark.locked === true;
}

function lockOne(bookmark) {
  return { ...bookmark, locked: true };
}

function unlockOne(bookmark) {
  const copy = { ...bookmark };
  delete copy.locked;
  return copy;
}

function lockAll(bookmarks) {
  return bookmarks.map(lockOne);
}

function unlockAll(bookmarks) {
  return bookmarks.map(unlockOne);
}

function filterLocked(bookmarks) {
  return bookmarks.filter(isLocked);
}

function filterUnlocked(bookmarks) {
  return bookmarks.filter(b => !isLocked(b));
}

/**
 * Guard: throw if any of the given bookmarks are locked.
 * Useful for write operations that should respect locks.
 */
function assertUnlocked(bookmarks) {
  const locked = (Array.isArray(bookmarks) ? bookmarks : [bookmarks]).filter(isLocked);
  if (locked.length > 0) {
    const urls = locked.map(b => b.url).join(', ');
    throw new Error(`Cannot modify locked bookmark(s): ${urls}`);
  }
}

/**
 * Apply a transformation only to unlocked bookmarks;
 * locked ones are passed through unchanged.
 */
function applyIfUnlocked(bookmarks, fn) {
  return bookmarks.map(b => (isLocked(b) ? b : fn(b)));
}

module.exports = {
  isLocked,
  lockOne,
  unlockOne,
  lockAll,
  unlockAll,
  filterLocked,
  filterUnlocked,
  assertUnlocked,
  applyIfUnlocked,
};
