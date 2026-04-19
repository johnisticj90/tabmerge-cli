const {
  setExpiry,
  clearExpiry,
  hasExpiry,
  isExpired,
  filterExpired,
  filterActive,
  expiresWithin,
  sortByExpiry,
} = require('./bookmark-expiry');

const past = '2000-01-01T00:00:00.000Z';
const future = '2099-01-01T00:00:00.000Z';
const base = { url: 'https://example.com', title: 'Example' };

test('setExpiry attaches expiresAt', () => {
  const b = setExpiry(base, future);
  expect(b.expiresAt).toBe(new Date(future).toISOString());
  expect(b.url).toBe(base.url);
});

test('clearExpiry removes expiresAt', () => {
  const b = clearExpiry(setExpiry(base, future));
  expect(b.expiresAt).toBeUndefined();
});

test('hasExpiry returns correct boolean', () => {
  expect(hasExpiry(setExpiry(base, future))).toBe(true);
  expect(hasExpiry(base)).toBe(false);
});

test('isExpired returns true for past date', () => {
  expect(isExpired(setExpiry(base, past))).toBe(true);
  expect(isExpired(setExpiry(base, future))).toBe(false);
});

test('isExpired returns false when no expiresAt', () => {
  expect(isExpired(base)).toBe(false);
});

test('filterExpired returns only expired bookmarks', () => {
  const bookmarks = [setExpiry(base, past), setExpiry(base, future), base];
  expect(filterExpired(bookmarks)).toHaveLength(1);
});

test('filterActive returns non-expired bookmarks', () => {
  const bookmarks = [setExpiry(base, past), setExpiry(base, future), base];
  expect(filterActive(bookmarks)).toHaveLength(2);
});

test('expiresWithin detects upcoming expiry', () => {
  const soon = new Date(Date.now() + 5000).toISOString();
  const b = setExpiry(base, soon);
  expect(expiresWithin(b, 10000)).toBe(true);
  expect(expiresWithin(b, 1000)).toBe(false);
  expect(expiresWithin(base, 10000)).toBe(false);
});

test('sortByExpiry sorts ascending, no-expiry last', () => {
  const b1 = setExpiry(base, future);
  const b2 = setExpiry(base, past);
  const sorted = sortByExpiry([b1, base, b2]);
  expect(sorted[0].expiresAt).toBe(b2.expiresAt);
  expect(sorted[2].expiresAt).toBeUndefined();
});
