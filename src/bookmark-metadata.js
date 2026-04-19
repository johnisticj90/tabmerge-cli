// Manage arbitrary metadata key/value pairs on bookmarks

function setMeta(bookmark, key, value) {
  const meta = bookmark.meta ? { ...bookmark.meta } : {};
  meta[key] = value;
  return { ...bookmark, meta };
}

function getMeta(bookmark, key) {
  return bookmark.meta ? bookmark.meta[key] : undefined;
}

function removeMeta(bookmark, key) {
  if (!bookmark.meta) return bookmark;
  const meta = { ...bookmark.meta };
  delete meta[key];
  return { ...bookmark, meta };
}

function hasMeta(bookmark, key) {
  return bookmark.meta != null && Object.prototype.hasOwnProperty.call(bookmark.meta, key);
}

function filterByMeta(bookmarks, key, value) {
  return bookmarks.filter(b => {
    if (!hasMeta(b, key)) return false;
    return value === undefined ? true : b.meta[key] === value;
  });
}

function setMetaAll(bookmarks, key, value) {
  return bookmarks.map(b => setMeta(b, key, value));
}

function clearMetaAll(bookmarks, key) {
  return bookmarks.map(b => removeMeta(b, key));
}

module.exports = { setMeta, getMeta, removeMeta, hasMeta, filterByMeta, setMetaAll, clearMetaAll };
