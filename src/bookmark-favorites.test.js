const {
  isFavorite,
  favoriteOne,
  unfavoriteOne,
  favoriteAll,
  unfavoriteAll,
  filterFavorites,
  filterNonFavorites,
  countFavorites,
} = require('./bookmark-favorites');

const make = (url, favorite) => ({ url, title: url, ...(favorite !== undefined ? { favorite } : {}) });

test('isFavorite returns true for favorite:true', () => {
  expect(isFavorite(make('a', true))).toBe(true);
});

test('isFavorite returns true for starred:true', () => {
  expect(isFavorite({ url: 'a', starred: true })).toBe(true);
});

test('isFavorite returns false when not set', () => {
  expect(isFavorite(make('a'))).toBe(false);
});

test('favoriteOne sets favorite flag', () => {
  expect(favoriteOne(make('a')).favorite).toBe(true);
});

test('unfavoriteOne removes favorite and starred', () => {
  const b = unfavoriteOne({ url: 'a', favorite: true, starred: true });
  expect(b.favorite).toBeUndefined();
  expect(b.starred).toBeUndefined();
});

test('favoriteAll marks all when no predicate', () => {
  const result = favoriteAll([make('a'), make('b')]);
  expect(result.every(b => b.favorite)).toBe(true);
});

test('favoriteAll uses predicate', () => {
  const result = favoriteAll([make('a'), make('b')], b => b.url === 'a');
  expect(result[0].favorite).toBe(true);
  expect(result[1].favorite).toBeUndefined();
});

test('filterFavorites returns only favorites', () => {
  const list = [make('a', true), make('b'), make('c', true)];
  expect(filterFavorites(list)).toHaveLength(2);
});

test('filterNonFavorites returns non-favorites', () => {
  const list = [make('a', true), make('b')];
  expect(filterNonFavorites(list)).toHaveLength(1);
});

test('countFavorites counts correctly', () => {
  expect(countFavorites([make('a', true), make('b'), make('c', true)])).toBe(2);
});
