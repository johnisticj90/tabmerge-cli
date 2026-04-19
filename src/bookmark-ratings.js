// Bookmark ratings (1-5 stars)

function isValidRating(rating) {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

function rateOne(bookmark, rating) {
  if (!isValidRating(rating)) throw new Error(`Invalid rating: ${rating}`);
  return { ...bookmark, rating };
}

function unrateOne(bookmark) {
  const b = { ...bookmark };
  delete b.rating;
  return b;
}

function getRating(bookmark) {
  return bookmark.rating || null;
}

function filterByRating(bookmarks, min, max = 5) {
  return bookmarks.filter(b => b.rating >= min && b.rating <= max);
}

function filterUnrated(bookmarks) {
  return bookmarks.filter(b => !b.rating);
}

function filterRated(bookmarks) {
  return bookmarks.filter(b => !!b.rating);
}

function rateAll(bookmarks, rating) {
  return bookmarks.map(b => rateOne(b, rating));
}

function averageRating(bookmarks) {
  const rated = filterRated(bookmarks);
  if (rated.length === 0) return null;
  return rated.reduce((sum, b) => sum + b.rating, 0) / rated.length;
}

function topRated(bookmarks, n = 10) {
  return [...filterRated(bookmarks)]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, n);
}

module.exports = {
  isValidRating, rateOne, unrateOne, getRating,
  filterByRating, filterUnrated, filterRated,
  rateAll, averageRating, topRated
};
