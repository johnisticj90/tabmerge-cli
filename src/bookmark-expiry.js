// bookmark-expiry.js — set/check expiry dates on bookmarks

function setExpiry(bookmark, date) {
  return { ...bookmark, expiresAt: new Date(date).toISOString() };
}

function clearExpiry(bookmark) {
  const b = { ...bookmark };
  delete b.expiresAt;
  return b;
}

function hasExpiry(bookmark) {
  return Boolean(bookmark.expiresAt);
}

function isExpired(bookmark, now = new Date()) {
  if (!bookmark.expiresAt) return false;
  return new Date(bookmark.expiresAt) <= new Date(now);
}

function filterExpired(bookmarks, now = new Date()) {
  return bookmarks.filter(b => isExpired(b, now));
}

function filterActive(bookmarks, now = new Date()) {
  return bookmarks.filter(b => !isExpired(b, now));
}

function expiresWithin(bookmark, ms, now = new Date()) {
  if (!bookmark.expiresAt) return false;
  const diff = new Date(bookmark.expiresAt) - new Date(now);
  return diff > 0 && diff <= ms;
}

function sortByExpiry(bookmarks) {
  return [...bookmarks].sort((a, b) => {
    if (!a.expiresAt) return 1;
    if (!b.expiresAt) return -1;
    return new Date(a.expiresAt) - new Date(b.expiresAt);
  });
}

module.exports = {
  setExpiry,
  clearExpiry,
  hasExpiry,
  isExpired,
  filterExpired,
  filterActive,
  expiresWithin,
  sortByExpiry,
};
