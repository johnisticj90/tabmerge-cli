const { filterByDomain, filterByTag, filterByDateAfter, filterByQuery } = require('./filter');

const bookmarks = [
  { url: 'https://github.com/user/repo', title: 'My Repo', tags: ['dev', 'git'], addDate: 1700000000 },
  { url: 'https://www.github.com/other', title: 'Other', tags: ['git'], addDate: 1600000000 },
  { url: 'https://news.ycombinator.com', title: 'HN', tags: ['news'], addDate: 1710000000 },
  { url: 'https://sub.example.com/page', title: 'Example Sub', tags: [], addDate: 1500000000 },
  { url: 'not-a-url', title: 'Bad URL', tags: ['misc'], addDate: 1700000001 },
];

describe('filterByDomain', () => {
  test('matches exact domain', () => {
    const res = filterByDomain(bookmarks, 'news.ycombinator.com');
    expect(res).toHaveLength(1);
    expect(res[0].title).toBe('HN');
  });

  test('strips www from both sides', () => {
    const res = filterByDomain(bookmarks, 'github.com');
    expect(res).toHaveLength(2);
  });

  test('matches subdomain', () => {
    const res = filterByDomain(bookmarks, 'example.com');
    expect(res).toHaveLength(1);
    expect(res[0].title).toBe('Example Sub');
  });

  test('skips invalid urls', () => {
    const res = filterByDomain(bookmarks, 'not-a-url');
    expect(res).toHaveLength(0);
  });
});

describe('filterByTag', () => {
  test('returns bookmarks with matching tag', () => {
    const res = filterByTag(bookmarks, 'git');
    expect(res).toHaveLength(2);
  });

  test('is case insensitive', () => {
    const res = filterByTag(bookmarks, 'DEV');
    expect(res).toHaveLength(1);
  });

  test('returns empty if no match', () => {
    expect(filterByTag(bookmarks, 'nope')).toHaveLength(0);
  });
});

describe('filterByDateAfter', () => {
  test('filters by date', () => {
    const res = filterByDateAfter(bookmarks, new Date('2023-11-01'));
    expect(res.length).toBeGreaterThanOrEqual(2);
  });

  test('excludes older bookmarks', () => {
    const res = filterByDateAfter(bookmarks, new Date('2030-01-01'));
    expect(res).toHaveLength(0);
  });
});

describe('filterByQuery', () => {
  test('matches title', () => {
    const res = filterByQuery(bookmarks, 'repo');
    expect(res).toHaveLength(1);
  });

  test('matches url', () => {
    const res = filterByQuery(bookmarks, 'ycombinator');
    expect(res).toHaveLength(1);
  });

  test('is case insensitive', () => {
    expect(filterByQuery(bookmarks, 'HN')).toHaveLength(1);
  });
});
