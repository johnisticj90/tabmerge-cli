const { scoreBookmark, scoreAll, sortByScore } = require('./scorer');

const now = Math.floor(Date.now() / 1000);

describe('scoreBookmark', () => {
  test('returns 0 for empty/null input', () => {
    expect(scoreBookmark(null)).toBe(0);
    expect(scoreBookmark({})).toBe(0);
  });

  test('gives https bonus', () => {
    const https = scoreBookmark({ url: 'https://example.com' });
    const http = scoreBookmark({ url: 'http://example.com' });
    expect(https).toBeGreaterThan(http);
  });

  test('gives title bonus', () => {
    const withTitle = scoreBookmark({ url: 'http://a.com', title: 'Hello' });
    const noTitle = scoreBookmark({ url: 'http://a.com', title: '' });
    expect(withTitle).toBeGreaterThan(noTitle);
  });

  test('gives tag bonus', () => {
    const tagged = scoreBookmark({ url: 'http://a.com', tags: ['dev', 'js'] });
    const untagged = scoreBookmark({ url: 'http://a.com', tags: [] });
    expect(tagged).toBeGreaterThan(untagged);
  });

  test('caps tag bonus at 3', () => {
    const manyTags = scoreBookmark({ url: 'http://a.com', tags: ['a','b','c','d','e','f','g','h'] });
    const fewTags = scoreBookmark({ url: 'http://a.com', tags: ['a','b','c','d'] });
    // both should be capped
    expect(manyTags).toBe(fewTags);
  });

  test('gives recency bonus for recent bookmark', () => {
    const recent = scoreBookmark({ url: 'http://a.com', addDate: now });
    const old = scoreBookmark({ url: 'http://a.com', addDate: now - 400 * 24 * 3600 });
    expect(recent).toBeGreaterThan(old);
  });
});

describe('scoreAll', () => {
  test('annotates each bookmark with _score', () => {
    const bms = [
      { url: 'https://a.com', title: 'A' },
      { url: 'http://b.com' },
    ];
    const result = scoreAll(bms);
    expect(result[0]._score).toBeDefined();
    expect(result[1]._score).toBeDefined();
    expect(result[0]._score).toBeGreaterThan(result[1]._score);
  });

  test('does not mutate originals', () => {
    const bms = [{ url: 'https://a.com' }];
    scoreAll(bms);
    expect(bms[0]._score).toBeUndefined();
  });
});

describe('sortByScore', () => {
  test('sorts descending by score', () => {
    const bms = [
      { url: 'http://low.com' },
      { url: 'https://high.com', title: 'High', tags: ['a'], addDate: now },
      { url: 'https://mid.com', title: 'Mid' },
    ];
    const sorted = sortByScore(bms);
    expect(sorted[0].url).toBe('https://high.com');
    expect(sorted[sorted.length - 1].url).toBe('http://low.com');
  });
});
