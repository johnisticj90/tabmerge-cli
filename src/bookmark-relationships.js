// Manage relationships (parent/child, related) between bookmarks

function addRelationship(bookmark, type, targetUrl) {
  if (!bookmark.relationships) bookmark.relationships = {};
  if (!bookmark.relationships[type]) bookmark.relationships[type] = [];
  if (!bookmark.relationships[type].includes(targetUrl)) {
    bookmark.relationships[type].push(targetUrl);
  }
  return bookmark;
}

function removeRelationship(bookmark, type, targetUrl) {
  if (!bookmark.relationships || !bookmark.relationships[type]) return bookmark;
  bookmark.relationships[type] = bookmark.relationships[type].filter(u => u !== targetUrl);
  if (bookmark.relationships[type].length === 0) delete bookmark.relationships[type];
  return bookmark;
}

function hasRelationship(bookmark, type, targetUrl) {
  return !!(
    bookmark.relationships &&
    bookmark.relationships[type] &&
    bookmark.relationships[type].includes(targetUrl)
  );
}

function getRelationships(bookmark, type) {
  if (!bookmark.relationships) return [];
  if (type) return bookmark.relationships[type] || [];
  return bookmark.relationships;
}

function clearRelationships(bookmark, type) {
  if (!bookmark.relationships) return bookmark;
  if (type) {
    delete bookmark.relationships[type];
  } else {
    delete bookmark.relationships;
  }
  return bookmark;
}

function findRelated(bookmarks, bookmark, type) {
  const urls = getRelationships(bookmark, type);
  if (!Array.isArray(urls)) return [];
  return bookmarks.filter(b => urls.includes(b.url));
}

function buildRelationshipMap(bookmarks) {
  const map = {};
  for (const b of bookmarks) {
    if (!b.relationships) continue;
    map[b.url] = b.relationships;
  }
  return map;
}

/**
 * Returns all bookmarks that have a relationship pointing to the given URL.
 * Useful for finding "incoming" relationships (e.g. who considers this a parent).
 */
function findIncomingRelationships(bookmarks, targetUrl, type) {
  return bookmarks.filter(b => hasRelationship(b, type, targetUrl));
}

module.exports = {
  addRelationship,
  removeRelationship,
  hasRelationship,
  getRelationships,
  clearRelationships,
  findRelated,
  buildRelationshipMap,
  findIncomingRelationships,
};
