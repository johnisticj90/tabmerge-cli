const { deduplicate, normalizeUrl } = require('./deduplicator');

describe('normalizeUrl', () => {
  test('lowercases URLs', () => {
    expect(normalizeUrl('HTTPS://Example.COM/Path')).toBe('https://example.com/Path'.toLowerCase());
  });

  test('strips trailing slash from root', () => {
    expect(normalizeUrl('https://example.com/')).toBe('https://example.com');
  });

  test('preserves path trailing slash', () => {
    const url = 'https://example.com/path/';
    expect(normalizeUrl(url)).toBe(url.toLowerCase());
  });

  test('handles invalid URLs gracefully', () => {
    expect(normalizeUrl('not-a-url')).toBe('not-a-url');
  });
});

describe('deduplicate', () => {
  const bookmarks = [
    { url: 'https://example.com', title: 'Example', tags: ['a'] },
    { url: 'https://example.com/', title: 'Example Dupe', tags: ['b'] },
    { url: 'https://other.com', title: 'Other', tags: ['c'] },
  ];

  test('removes duplicate URLs', () => {
    const { bookmarks: result, duplicatesRemoved } = deduplicate(bookmarks);
    expect(result).toHaveLength(2);
    expect(duplicatesRemoved).toBe(1);
  });

  test('keeps first occurrence title', () => {
    const { bookmarks: result } = deduplicate(bookmarks);
    expect(result[0].title).toBe('Example');
  });

  test('merges tags from duplicates by default', () => {
    const { bookmarks: result } = deduplicate(bookmarks);
    expect(result[0].tags).toEqual(expect.arrayContaining(['a', 'b']));
  });

  test('does not merge tags when mergeTags=false', () => {
    const { bookmarks: result } = deduplicate(bookmarks, { mergeTags: false });
    expect(result[0].tags).toEqual(['a']);
  });

  test('handles empty array', () => {
    const { bookmarks: result, duplicatesRemoved } = deduplicate([]);
    expect(result).toHaveLength(0);
    expect(duplicatesRemoved).toBe(0);
  });

  test('no duplicates returns all bookmarks', () => {
    const unique = [
      { url: 'https://a.com', title: 'A' },
      { url: 'https://b.com', title: 'B' },
    ];
    const { bookmarks: result, duplicatesRemoved } = deduplicate(unique);
    expect(result).toHaveLength(2);
    expect(duplicatesRemoved).toBe(0);
  });
});
