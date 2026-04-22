const { domainKey, tokenize, jaccard, clusterBookmarks, getClusters } = require('./bookmark-clusters');

const bm = (url, title, tags = []) => ({ url, title, tags });

describe('domainKey', () => {
  test('strips www prefix', () => {
    expect(domainKey('https://www.example.com/page')).toBe('example.com');
  });
  test('returns empty string for invalid url', () => {
    expect(domainKey('not-a-url')).toBe('');
  });
});

describe('tokenize', () => {
  test('splits into lowercase words', () => {
    expect(tokenize('Hello World 2024')).toEqual(['hello', 'world', '2024']);
  });
  test('handles empty string', () => {
    expect(tokenize('')).toEqual([]);
  });
  test('handles null/undefined gracefully', () => {
    expect(tokenize(undefined)).toEqual([]);
  });
});

describe('jaccard', () => {
  test('identical sets return 1', () => {
    expect(jaccard(['a', 'b'], ['a', 'b'])).toBe(1);
  });
  test('disjoint sets return 0', () => {
    expect(jaccard(['a'], ['b'])).toBe(0);
  });
  test('partial overlap', () => {
    expect(jaccard(['a', 'b'], ['b', 'c'])).toBeCloseTo(1 / 3);
  });
  test('empty sets return 0', () => {
    expect(jaccard([], [])).toBe(0);
  });
});

describe('clusterBookmarks', () => {
  test('identical bookmarks end up in same cluster', () => {
    const bookmarks = [
      bm('https://github.com/foo', 'GitHub Foo', ['code']),
      bm('https://github.com/bar', 'GitHub Bar', ['code']),
      bm('https://cooking.com/recipe', 'Best Recipe', ['food'])
    ];
    const clusters = clusterBookmarks(bookmarks, 0.2);
    const sizes = [...clusters.values()].map(c => c.length).sort((a, b) => b - a);
    expect(sizes[0]).toBeGreaterThanOrEqual(2);
  });

  test('completely different bookmarks each get own cluster', () => {
    const bookmarks = [
      bm('https://alpha.com', 'Alpha'),
      bm('https://beta.org', 'Beta'),
      bm('https://gamma.net', 'Gamma')
    ];
    const clusters = clusterBookmarks(bookmarks, 0.9);
    expect(clusters.size).toBe(3);
  });
});

describe('getClusters', () => {
  test('returns array sorted by size descending', () => {
    const bookmarks = [
      bm('https://news.ycombinator.com/1', 'HN Post 1', ['news', 'tech']),
      bm('https://news.ycombinator.com/2', 'HN Post 2', ['news', 'tech']),
      bm('https://news.ycombinator.com/3', 'HN Post 3', ['news', 'tech']),
      bm('https://cooking.com/pasta', 'Pasta Recipe', ['food'])
    ];
    const result = getClusters(bookmarks, 0.15);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].length).toBeGreaterThanOrEqual(result[result.length - 1].length);
  });

  test('empty input returns empty array', () => {
    expect(getClusters([])).toEqual([]);
  });
});
