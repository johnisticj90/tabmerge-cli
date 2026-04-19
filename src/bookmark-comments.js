// bookmark-comments.js — add/remove/query inline comments on bookmarks

function addComment(bookmark, text) {
  const comments = bookmark.comments ? [...bookmark.comments] : [];
  const entry = { text: String(text), addedAt: new Date().toISOString() };
  return { ...bookmark, comments: [...comments, entry] };
}

function removeComment(bookmark, index) {
  if (!bookmark.comments) return bookmark;
  const comments = bookmark.comments.filter((_, i) => i !== index);
  return { ...bookmark, comments };
}

function clearComments(bookmark) {
  return { ...bookmark, comments: [] };
}

function hasComments(bookmark) {
  return Array.isArray(bookmark.comments) && bookmark.comments.length > 0;
}

function getComments(bookmark) {
  return bookmark.comments || [];
}

function filterWithComments(bookmarks) {
  return bookmarks.filter(hasComments);
}

function filterWithoutComments(bookmarks) {
  return bookmarks.filter(b => !hasComments(b));
}

function searchComments(bookmarks, query) {
  const q = query.toLowerCase();
  return bookmarks.filter(b =>
    (b.comments || []).some(c => c.text.toLowerCase().includes(q))
  );
}

module.exports = {
  addComment,
  removeComment,
  clearComments,
  hasComments,
  getComments,
  filterWithComments,
  filterWithoutComments,
  searchComments,
};
