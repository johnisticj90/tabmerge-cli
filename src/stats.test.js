const { computeStats, formatStats } = require('./stats');

const sampleBookmarks = [
  { url: 'https://github.com/foo', title: 'Foo', tags: ['dev', 'git'] },
  { url: 'https://github.com/bar', title: 'Bar', tags: ['git'] },
  { url: 'https://news.ycombinator.com/', title: 'HN', tags: [] },
  { url: 'https://www.example.com/page', title: '', tags: ['misc'] },
  { url: 'not-a-url', title: 'Bad', tags: [] },
];

describe('computeStats', () => {
  let stats;
  beforeAll(() => {
    stats = computeStats(sampleBookmarks);
  });

  test('total count', () => {
    expect(stats.total).toBe(5);
  });

  test('unique domains ignores www prefix', () => {
    // github.com, news.ycombinator.com, example.com
    expect(stats.uniqueDomains).toBe(3);
  });

  test('withTitle counts non-empty titles', () => {
    expect(stats.withTitle).toBe(3); // Foo, Bar, HN
  });

  test('withTags counts bookmarks that have at least one tag', () => {
    expect(stats.withTags).toBe(3);
  });

  test('topDomains sorted descending', () => {
    expect(stats.topDomains[0].domain).toBe('github.com');
    expect(stats.topDomains[0].count).toBe(2);
  });

  test('topTags sorted descending', () => {
    expect(stats.topTags[0].tag).toBe('git');
    expect(stats.topTags[0].count).toBe(2);
  });

  test('empty bookmarks array', () => {
    const s = computeStats([]);
    expect(s.total).toBe(0);
    expect(s.uniqueDomains).toBe(0);
    expect(s.topDomains).toEqual([]);
    expect(s.topTags).toEqual([]);
  });
});

describe('formatStats', () => {
  test('returns a non-empty string', () => {
    const stats = computeStats(sampleBookmarks);
    const output = formatStats(stats);
    expect(typeof output).toBe('string');
    expect(output).toContain('Total bookmarks');
    expect(output).toContain('github.com');
  });

  test('no top domains section when none exist', () => {
    const output = formatStats({ total: 0, withTags: 0, withTitle: 0, uniqueDomains: 0, topDomains: [], topTags: [] });
    expect(output).not.toContain('Top domains');
  });
});
