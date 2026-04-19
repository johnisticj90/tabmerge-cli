const {
  isValidRating, rateOne, unrateOne, getRating,
  filterByRating, filterUnrated, filterRated,
  rateAll, averageRating, topRated
} = require('./bookmark-ratings');

const b = (url, rating) => ({ url, title: url, ...(rating ? { rating } : {}) });

test('isValidRating', () => {
  expect(isValidRating(1)).toBe(true);
  expect(isValidRating(5)).toBe(true);
  expect(isValidRating(0)).toBe(false);
  expect(isValidRating(6)).toBe(false);
  expect(isValidRating(3.5)).toBe(false);
});

test('rateOne adds rating', () => {
  expect(rateOne(b('a.com'), 4).rating).toBe(4);
});

test('rateOne throws on invalid rating', () => {
  expect(() => rateOne(b('a.com'), 0)).toThrow();
});

test('unrateOne removes rating', () => {
  const rated = rateOne(b('a.com'), 3);
  expect(unrateOne(rated).rating).toBeUndefined();
});

test('getRating returns rating or null', () => {
  expect(getRating(b('a.com', 3))).toBe(3);
  expect(getRating(b('a.com'))).toBeNull();
});

test('filterByRating', () => {
  const list = [b('a', 1), b('b', 3), b('c', 5)];
  expect(filterByRating(list, 3).map(x => x.url)).toEqual(['b', 'c']);
  expect(filterByRating(list, 2, 4).map(x => x.url)).toEqual(['b']);
});

test('filterUnrated / filterRated', () => {
  const list = [b('a', 2), b('b'), b('c', 4)];
  expect(filterUnrated(list).map(x => x.url)).toEqual(['b']);
  expect(filterRated(list).map(x => x.url)).toEqual(['a', 'c']);
});

test('rateAll', () => {
  const list = [b('a'), b('b')];
  expect(rateAll(list, 5).every(x => x.rating === 5)).toBe(true);
});

test('averageRating', () => {
  expect(averageRating([b('a', 2), b('b', 4)])).toBe(3);
  expect(averageRating([b('a')])).toBeNull();
});

test('topRated returns sorted slice', () => {
  const list = [b('a', 2), b('b', 5), b('c', 3)];
  expect(topRated(list, 2).map(x => x.url)).toEqual(['b', 'c']);
});
