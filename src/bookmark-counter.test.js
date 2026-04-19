'use strict';

const { countByDomain, countByTag, countByYear, topN, count } = require('./bookmark-counter');

const bookmarks = [
  { url: 'https://github.com/foo', tags: ['dev', 'git'], addDate: 1609459200 },
  { url: 'https://github.com/bar', tags: ['dev'], addDate: 1609459200 },
  { url: 'https://news.ycombinator.com/item?id=1', tags: [], addDate: 1640995200 },
  { url: 'https://www.example.com/', tags: ['misc'], addDate: null },
  { url: 'not-a-url', tags: ['broken'], addDate: 1609459200 },
];

test('countByDomain groups by hostname', () => {
  const result = countByDomain(bookmarks);
  expect(result['github.com']).toBe(2);
  expect(result['news.ycombinator.com']).toBe(1);
  expect(result['example.com']).toBe(1);
  expect(result['invalid']).toBe(1);
});

test('countByTag counts each tag occurrence', () => {
  const result = countByTag(bookmarks);
  expect(result['dev']).toBe(2);
  expect(result['git']).toBe(1);
  expect(result['misc']).toBe(1);
  expect(result['untagged']).toBe(1);
});

test('countByYear groups by year from unix timestamp', () => {
  const result = countByYear(bookmarks);
  expect(result['2021']).toBe(3);
  expect(result['2022']).toBe(1);
  expect(result['unknown']).toBe(1);
});

test('topN returns sorted entries limited to n', () => {
  const counts = { a: 5, b: 10, c: 3, d: 8 };
  const top2 = topN(counts, 2);
  expect(top2).toEqual([{ key: 'b', count: 10 }, { key: 'd', count: 8 }]);
});

test('count dispatches by dimension', () => {
  const result = count(bookmarks, 'domain', 5);
  expect(result[0].key).toBe('github.com');
  expect(result[0].count).toBe(2);
});

test('count throws on unknown dimension', () => {
  expect(() => count(bookmarks, 'foobar')).toThrow('Unknown dimension: foobar');
});
