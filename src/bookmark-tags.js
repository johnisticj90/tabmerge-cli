// bookmark-tags.js — tag management utilities

function addTag(bookmark, tag) {
  const tags = bookmark.tags ? [...bookmark.tags] : [];
  if (!tags.includes(tag)) tags.push(tag);
  return { ...bookmark, tags };
}

function removeTag(bookmark, tag) {
  const tags = (bookmark.tags || []).filter(t => t !== tag);
  return { ...bookmark, tags };
}

function hasTag(bookmark, tag) {
  return (bookmark.tags || []).includes(tag);
}

function renameTags(bookmarks, oldTag, newTag) {
  return bookmarks.map(b => {
    if (!hasTag(b, oldTag)) return b;
    const tags = (b.tags || []).map(t => (t === oldTag ? newTag : t));
    return { ...b, tags };
  });
}

function mergeTags(bookmarks, tagsToMerge, targetTag) {
  return bookmarks.map(b => {
    let tags = b.tags || [];
    const hasAny = tags.some(t => tagsToMerge.includes(t));
    if (!hasAny) return b;
    tags = tags.filter(t => !tagsToMerge.includes(t));
    if (!tags.includes(targetTag)) tags.push(targetTag);
    return { ...b, tags };
  });
}

function listAllTags(bookmarks) {
  const set = new Set();
  for (const b of bookmarks) {
    for (const t of b.tags || []) set.add(t);
  }
  return [...set].sort();
}

function countByTag(bookmarks) {
  const counts = {};
  for (const b of bookmarks) {
    for (const t of b.tags || []) {
      counts[t] = (counts[t] || 0) + 1;
    }
  }
  return counts;
}

module.exports = { addTag, removeTag, hasTag, renameTags, mergeTags, listAllTags, countByTag };
