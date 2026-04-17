const { groupByDomain, groupByTag, groupByDate, group } = require('./grouper');

const bookmarks = [
  { url: 'https://github.com/foo', title: 'Foo', tags: ['dev', 'git'], addDate: 1700000000 },
  { url: 'https://github.com/bar', title: 'Bar', tags: ['dev'],        addDate: 1700000000 },
  { url: 'https://news.ycombinator.com/', title: 'HN', tags: [],       addDate: 1680000000 },
  { url: 'not-a-url',                     title: 'Bad', tags: null,    addDate: null },
];

test('groupByDomain groups by hostname', () => {
  const g = groupByDomain(bookmarks);
  expect(Object.keys(g)).toContain('github.com');
  expect(g['github.com']).toHaveLength(2);
  expect(Object.keys(g)).toContain('news.ycombinator.com');
  expect(Object.keys(g)).toContain('invalid');
});

test('groupByTag groups by each tag', () => {
  const g = groupByTag(bookmarks);
  expect(g['dev']).toHaveLength(2);
  expect(g['git']).toHaveLength(1);
  expect(g['untagged']).toHaveLength(2); // HN (empty array) and Bad (null)
});

test('groupByDate groups by year-month', () => {
  const g = groupByDate(bookmarks);
  expect(Object.keys(g)).toContain('2023-11');
  expect(Object.keys(g)).toContain('unknown');
});

test('group dispatches correctly', () => {
  expect(group(bookmarks, 'domain')).toEqual(groupByDomain(bookmarks));
  expect(group(bookmarks, 'tag')).toEqual(groupByTag(bookmarks));
  expect(group(bookmarks, 'date')).toEqual(groupByDate(bookmarks));
});

test('group throws on unknown key', () => {
  expect(() => group(bookmarks, 'color')).toThrow('Unknown group key: color');
});
