'use strict';

const { buildPipeline, transform } = require('./transformer');

const bookmarks = [
  { url: 'https://example.com/a', title: 'Bravo', tags: ['news'], addDate: 1700000200 },
  { url: 'https://example.com/b', title: 'Alpha', tags: ['dev'],  addDate: 1700000100 },
  { url: 'https://other.org/c',   title: 'Charlie', tags: ['news'], addDate: 1700000300 },
  { url: 'https://example.com/a', title: 'Bravo dup', tags: [], addDate: 1700000200 },
];

test('dedup removes duplicate urls by default', () => {
  const result = transform([...bookmarks], {});
  const urls = result.map(b => b.url);
  expect(new Set(urls).size).toBe(urls.length);
});

test('domain filter keeps only matching domain', () => {
  const result = transform([...bookmarks], { domain: 'example.com' });
  expect(result.every(b => b.url.includes('example.com'))).toBe(true);
});

test('tag filter keeps only matching tag', () => {
  const result = transform([...bookmarks], { dedup: false, tag: 'news' });
  expect(result.every(b => b.tags.includes('news'))).toBe(true);
});

test('sort by title ascending', () => {
  const result = transform([...bookmarks], { dedup: false, sort: 'title', sortDir: 'asc' });
  const titles = result.map(b => b.title);
  expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
});

test('buildPipeline returns a reusable function', () => {
  const pipeline = buildPipeline({ domain: 'other.org', dedup: false });
  const r1 = pipeline([...bookmarks]);
  const r2 = pipeline([...bookmarks]);
  expect(r1).toEqual(r2);
  expect(r1.every(b => b.url.includes('other.org'))).toBe(true);
});

test('no options returns deduped list unchanged otherwise', () => {
  const input = [
    { url: 'https://a.com', title: 'A', tags: [] },
    { url: 'https://b.com', title: 'B', tags: [] },
  ];
  const result = transform(input, {});
  expect(result.length).toBe(2);
});
