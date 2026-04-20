/**
 * bookmark-timestamps.js
 * Utilities for managing created/updated timestamps on bookmarks.
 */

function setCreated(bookmark, date = new Date()) {
  return { ...bookmark, createdAt: date instanceof Date ? date.toISOString() : date };
}

function setUpdated(bookmark, date = new Date()) {
  return { ...bookmark, updatedAt: date instanceof Date ? date.toISOString() : date };
}

function getCreated(bookmark) {
  return bookmark.createdAt ? new Date(bookmark.createdAt) : null;
}

function getUpdated(bookmark) {
  return bookmark.updatedAt ? new Date(bookmark.updatedAt) : null;
}

function hasTimestamp(bookmark) {
  return Boolean(bookmark.createdAt || bookmark.updatedAt);
}

function touchUpdated(bookmark) {
  return setUpdated(bookmark, new Date());
}

function filterCreatedAfter(bookmarks, date) {
  const threshold = new Date(date).getTime();
  return bookmarks.filter(b => {
    const created = getCreated(b);
    return created && created.getTime() > threshold;
  });
}

function filterCreatedBefore(bookmarks, date) {
  const threshold = new Date(date).getTime();
  return bookmarks.filter(b => {
    const created = getCreated(b);
    return created && created.getTime() < threshold;
  });
}

function filterUpdatedAfter(bookmarks, date) {
  const threshold = new Date(date).getTime();
  return bookmarks.filter(b => {
    const updated = getUpdated(b);
    return updated && updated.getTime() > threshold;
  });
}

function stampAll(bookmarks) {
  const now = new Date();
  return bookmarks.map(b => {
    const stamped = b.createdAt ? b : setCreated(b, now);
    return stamped.updatedAt ? stamped : setUpdated(stamped, now);
  });
}

module.exports = {
  setCreated,
  setUpdated,
  getCreated,
  getUpdated,
  hasTimestamp,
  touchUpdated,
  filterCreatedAfter,
  filterCreatedBefore,
  filterUpdatedAfter,
  stampAll,
};
