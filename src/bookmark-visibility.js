// bookmark-visibility: hide/show bookmarks and filter by visibility

function isHidden(bookmark) {
  return bookmark.hidden === true;
}

function isVisible(bookmark) {
  return !isHidden(bookmark);
}

function hideOne(bookmark) {
  return { ...bookmark, hidden: true };
}

function showOne(bookmark) {
  const b = { ...bookmark };
  delete b.hidden;
  return b;
}

function hideAll(bookmarks) {
  return bookmarks.map(hideOne);
}

function showAll(bookmarks) {
  return bookmarks.map(showOne);
}

function filterVisible(bookmarks) {
  return bookmarks.filter(isVisible);
}

function filterHidden(bookmarks) {
  return bookmarks.filter(isHidden);
}

function toggleVisibility(bookmark) {
  return isHidden(bookmark) ? showOne(bookmark) : hideOne(bookmark);
}

function hideByDomain(bookmarks, domain) {
  return bookmarks.map(b =>
    b.url && b.url.includes(domain) ? hideOne(b) : b
  );
}

module.exports = {
  isHidden,
  isVisible,
  hideOne,
  showOne,
  hideAll,
  showAll,
  filterVisible,
  filterHidden,
  toggleVisibility,
  hideByDomain,
};
