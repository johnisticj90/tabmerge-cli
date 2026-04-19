// bookmark-categories.js — assign and manage categories on bookmarks

const DEFAULT_CATEGORY = 'uncategorized';

function setCategory(bookmark, category) {
  return { ...bookmark, category: category || DEFAULT_CATEGORY };
}

function clearCategory(bookmark) {
  const b = { ...bookmark };
  delete b.category;
  return b;
}

function getCategory(bookmark) {
  return bookmark.category || DEFAULT_CATEGORY;
}

function hasCategory(bookmark, category) {
  return getCategory(bookmark) === category;
}

function filterByCategory(bookmarks, category) {
  return bookmarks.filter(b => getCategory(b) === category);
}

function groupByCategory(bookmarks) {
  return bookmarks.reduce((acc, b) => {
    const cat = getCategory(b);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(b);
    return acc;
  }, {});
}

function listCategories(bookmarks) {
  return [...new Set(bookmarks.map(getCategory))].sort();
}

function renameCategory(bookmarks, oldName, newName) {
  return bookmarks.map(b =>
    getCategory(b) === oldName ? setCategory(b, newName) : b
  );
}

function categorizeAll(bookmarks, category) {
  return bookmarks.map(b => setCategory(b, category));
}

module.exports = {
  DEFAULT_CATEGORY,
  setCategory,
  clearCategory,
  getCategory,
  hasCategory,
  filterByCategory,
  groupByCategory,
  listCategories,
  renameCategory,
  categorizeAll,
};
