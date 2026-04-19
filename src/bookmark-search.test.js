const { scoreMatch, search, searchAll, searchAny } = require('./bookmark-search');

const bookmarks = [
  { title: 'GitHub', url: 'https://github.com', tags: ['dev', 'code'] },
  { title: 'Google', url: 'https://google.com', tags: ['search'] },
  { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', tags: ['dev', 'docs'] },
  { title: 'YouTube', url: 'https://youtube.com', tags: ['video'] },
];

test('scoreMatch returns 0 for no match', () => {
  expect(scoreMatch(bookmarks[0], 'zzz')).toBe(0);
});

test('scoreMatch scores title match higher than url match', () => {
  const b = { title: 'github', url: 'https://github.com', tags: [] };
  const titleScore = scoreMatch(b, 'github');
  const urlScore = scoreMatch({ title: 'code host', url: 'https://github.com', tags: [] }, 'github');
  expect(titleScore).toBeGreaterThan(urlScore);
});

test('search returns matching bookmarks', () => {
  const results = search(bookmarks, 'github');
  expect(results).toHaveLength(1);
  expect(results[0].title).toBe('GitHub');
});

test('search returns all on empty query', () => {
  expect(search(bookmarks, '')).toHaveLength(bookmarks.length);
});

test('search matches by tag', () => {
  const results = search(bookmarks, 'dev');
  expect(results.map(b => b.title)).toContain('GitHub');
  expect(results.map(b => b.title)).toContain('MDN Web Docs');
});

test('searchAll applies AND logic', () => {
  const results = searchAll(bookmarks, ['dev', 'docs']);
  expect(results).toHaveLength(1);
  expect(results[0].title).toBe('MDN Web Docs');
});

test('searchAny applies OR logic', () => {
  const results = searchAny(bookmarks, ['github', 'google']);
  expect(results).toHaveLength(2);
});

test('searchAny deduplicates results', () => {
  const results = searchAny(bookmarks, ['dev', 'github']);
  const urls = results.map(b => b.url);
  const unique = new Set(urls);
  expect(urls.length).toBe(unique.size);
});
