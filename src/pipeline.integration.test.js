'use strict';

const { run } = require('./pipeline');
const { computeStats } = require('./stats');

const csv1 = `url,title,tags,addDate
https://alpha.dev/one,One,dev,1700000100
https://beta.io/two,Two,news,1700000200
https://alpha.dev/one,One Dup,dev,1700000100`;

const csv2 = `url,title,tags,addDate
https://gamma.net/three,Three,tools,1700000300
https://beta.io/two,Two Again,news,1700000200`;

const inputs = [
  { content: csv1, path: 'first.csv' },
  { content: csv2, path: 'second.csv' },
];

test('integration: csv inputs merged, deduped, sorted', () => {
  const { bookmarks } = run(inputs, { sort: 'title', sortDir: 'asc' });
  const urls = bookmarks.map(b => b.url);
  // duplicates removed
  expect(new Set(urls).size).toBe(urls.length);
  // all unique sources present
  expect(urls).toContain('https://alpha.dev/one');
  expect(urls).toContain('https://beta.io/two');
  expect(urls).toContain('https://gamma.net/three');
  // sorted by title
  const titles = bookmarks.map(b => b.title);
  expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
});

test('integration: stats reflect deduped result', () => {
  const { bookmarks } = run(inputs, {});
  const stats = computeStats(bookmarks);
  expect(stats.total).toBe(bookmarks.length);
});

test('integration: tag filter after merge', () => {
  const { bookmarks } = run(inputs, { tag: 'news' });
  expect(bookmarks.length).toBeGreaterThan(0);
  expect(bookmarks.every(b => b.tags.includes('news'))).toBe(true);
});
