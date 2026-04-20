const {
  setCreated,
  setUpdated,
  getCreated,
  getUpdated,
  hasTimestamp,
  touchUpdated,
  filterCreatedAfter,
  filterCreatedBefore,
  filterUpdatedAfter,
  stampAll,
} = require('./bookmark-timestamps');

const base = { url: 'https://example.com', title: 'Example' };

test('setCreated attaches createdAt as ISO string', () => {
  const d = new Date('2024-01-01T00:00:00Z');
  const b = setCreated(base, d);
  expect(b.createdAt).toBe('2024-01-01T00:00:00.000Z');
  expect(b.url).toBe(base.url);
});

test('setUpdated attaches updatedAt as ISO string', () => {
  const d = new Date('2024-06-15T12:00:00Z');
  const b = setUpdated(base, d);
  expect(b.updatedAt).toBe('2024-06-15T12:00:00.000Z');
});

test('setCreated accepts ISO string directly', () => {
  const b = setCreated(base, '2023-03-10T00:00:00Z');
  expect(b.createdAt).toBe('2023-03-10T00:00:00Z');
});

test('getCreated returns Date object or null', () => {
  expect(getCreated(base)).toBeNull();
  const b = setCreated(base, new Date('2024-01-01T00:00:00Z'));
  expect(getCreated(b)).toBeInstanceOf(Date);
});

test('getUpdated returns Date object or null', () => {
  expect(getUpdated(base)).toBeNull();
  const b = setUpdated(base, new Date('2024-02-01T00:00:00Z'));
  expect(getUpdated(b)).toBeInstanceOf(Date);
});

test('hasTimestamp returns true when either timestamp exists', () => {
  expect(hasTimestamp(base)).toBe(false);
  expect(hasTimestamp(setCreated(base))).toBe(true);
  expect(hasTimestamp(setUpdated(base))).toBe(true);
});

test('touchUpdated sets updatedAt to approximately now', () => {
  const before = Date.now();
  const b = touchUpdated(base);
  const after = Date.now();
  const t = new Date(b.updatedAt).getTime();
  expect(t).toBeGreaterThanOrEqual(before);
  expect(t).toBeLessThanOrEqual(after);
});

test('filterCreatedAfter filters correctly', () => {
  const bookmarks = [
    setCreated(base, new Date('2023-01-01')),
    setCreated(base, new Date('2024-01-01')),
    setCreated(base, new Date('2025-01-01')),
  ];
  const result = filterCreatedAfter(bookmarks, '2023-06-01');
  expect(result).toHaveLength(2);
});

test('filterCreatedBefore filters correctly', () => {
  const bookmarks = [
    setCreated(base, new Date('2022-01-01')),
    setCreated(base, new Date('2024-01-01')),
  ];
  const result = filterCreatedBefore(bookmarks, '2023-01-01');
  expect(result).toHaveLength(1);
});

test('filterUpdatedAfter excludes bookmarks without updatedAt', () => {
  const bookmarks = [
    base,
    setUpdated(base, new Date('2024-05-01')),
  ];
  const result = filterUpdatedAfter(bookmarks, '2024-01-01');
  expect(result).toHaveLength(1);
});

test('stampAll adds createdAt and updatedAt to unstamped bookmarks', () => {
  const already = setCreated(setUpdated(base, new Date('2020-01-01')), new Date('2020-01-01'));
  const result = stampAll([base, already]);
  expect(result[0].createdAt).toBeDefined();
  expect(result[0].updatedAt).toBeDefined();
  expect(result[1].createdAt).toBe(already.createdAt);
});
