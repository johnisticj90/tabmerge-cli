// Manage favorite/starred bookmarks

function isFavorite(bookmark) {
  return bookmark.favorite === true || bookmark.starred === true;
}

function favoriteOne(bookmark) {
  return { ...bookmark, favorite: true };
}

function unfavoriteOne(bookmark) {
  const b = { ...bookmark };
  delete b.favorite;
  delete b.starred;
  return b;
}

function favoriteAll(bookmarks, predicate) {
  return bookmarks.map(b => (predicate ? predicate(b) : true) ? favoriteOne(b) : b);
}

function unfavoriteAll(bookmarks) {
  return bookmarks.map(unfavoriteOne);
}

function filterFavorites(bookmarks) {
  return bookmarks.filter(isFavorite);
}

function filterNonFavorites(bookmarks) {
  return bookmarks.filter(b => !isFavorite(b));
}

function countFavorites(bookmarks) {
  return bookmarks.filter(isFavorite).length;
}

module.exports = {
  isFavorite,
  favoriteOne,
  unfavoriteOne,
  favoriteAll,
  unfavoriteAll,
  filterFavorites,
  filterNonFavorites,
  countFavorites,
};
