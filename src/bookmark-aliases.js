// Manage short aliases for bookmark URLs

'use strict';

function setAlias(bookmark, alias) {
  return { ...bookmark, alias: alias.trim() };
}

function clearAlias(bookmark) {
  const b = { ...bookmark };
  delete b.alias;
  return b;
}

function hasAlias(bookmark) {
  return typeof bookmark.alias === 'string' && bookmark.alias.length > 0;
}

function findByAlias(bookmarks, alias) {
  return bookmarks.find(b => b.alias === alias) || null;
}

function resolveAlias(bookmarks, aliasOrUrl) {
  const byAlias = findByAlias(bookmarks, aliasOrUrl);
  if (byAlias) return byAlias;
  return bookmarks.find(b => b.url === aliasOrUrl) || null;
}

function listAliases(bookmarks) {
  return bookmarks
    .filter(hasAlias)
    .map(b => ({ alias: b.alias, url: b.url, title: b.title }));
}

function renameAlias(bookmarks, oldAlias, newAlias) {
  return bookmarks.map(b =>
    b.alias === oldAlias ? { ...b, alias: newAlias.trim() } : b
  );
}

module.exports = {
  setAlias,
  clearAlias,
  hasAlias,
  findByAlias,
  resolveAlias,
  listAliases,
  renameAlias,
};
