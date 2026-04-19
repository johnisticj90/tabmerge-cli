// pinner.js — pin/unpin bookmarks and retrieve pinned list

'use strict';

const PIN_TAG = '__pinned__';

function isPinned(bookmark) {
  return Array.isArray(bookmark.tags) && bookmark.tags.includes(PIN_TAG);
}

function pinOne(bookmark) {
  const tags = Array.isArray(bookmark.tags) ? bookmark.tags : [];
  if (tags.includes(PIN_TAG)) return bookmark;
  return { ...bookmark, tags: [PIN_TAG, ...tags] };
}

function unpinOne(bookmark) {
  const tags = Array.isArray(bookmark.tags) ? bookmark.tags : [];
  return { ...bookmark, tags: tags.filter(t => t !== PIN_TAG) };
}

function pinAll(bookmarks, predicate) {
  return bookmarks.map(b => (predicate(b) ? pinOne(b) : b));
}

function unpinAll(bookmarks) {
  return bookmarks.map(unpinOne);
}

function getPinned(bookmarks) {
  return bookmarks.filter(isPinned);
}

function sortWithPinnedFirst(bookmarks) {
  const pinned = bookmarks.filter(isPinned);
  const rest = bookmarks.filter(b => !isPinned(b));
  return [...pinned, ...rest];
}

module.exports = { PIN_TAG, isPinned, pinOne, unpinOne, pinAll, unpinAll, getPinned, sortWithPinnedFirst };
