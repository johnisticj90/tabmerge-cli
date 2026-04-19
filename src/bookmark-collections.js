// Manage named collections of bookmarks

function createCollection(name, bookmarks = []) {
  return { name, bookmarks, createdAt: new Date().toISOString() };
}

function addToCollection(collection, bookmark) {
  if (collection.bookmarks.some(b => b.url === bookmark.url)) {
    return collection;
  }
  return { ...collection, bookmarks: [...collection.bookmarks, bookmark] };
}

function removeFromCollection(collection, url) {
  return { ...collection, bookmarks: collection.bookmarks.filter(b => b.url !== url) };
}

function mergeCollections(a, b) {
  const urls = new Set(a.bookmarks.map(b => b.url));
  const merged = [...a.bookmarks];
  for (const bm of b.bookmarks) {
    if (!urls.has(bm.url)) merged.push(bm);
  }
  return { name: a.name, bookmarks: merged, createdAt: a.createdAt };
}

function renameCollection(collection, newName) {
  return { ...collection, name: newName };
}

function filterCollection(collection, predicate) {
  return { ...collection, bookmarks: collection.bookmarks.filter(predicate) };
}

function collectionSize(collection) {
  return collection.bookmarks.length;
}

function hasBookmark(collection, url) {
  return collection.bookmarks.some(b => b.url === url);
}

module.exports = {
  createCollection,
  addToCollection,
  removeFromCollection,
  mergeCollections,
  renameCollection,
  filterCollection,
  collectionSize,
  hasBookmark,
};
