const { highlight, highlightBookmark, highlightAll } = require('./highlighter');

describe('highlight', () => {
  test('wraps matching text with ANSI codes', () => {
    const result = highlight('Hello World', 'world', true);
    expect(result).toContain('World');
    expect(result).toContain('\x1b[1;33m');
  });

  test('no-color mode wraps with brackets', () => {
    const result = highlight('Hello World', 'world', false);
    expect(result).toBe('Hello [World]');
  });

  test('is case-insensitive', () => {
    const result = highlight('GitHub Gist', 'git', false);
    expect(result).toBe('[Git]Hub [Git]');
  });

  test('returns original text when query is empty', () => {
    expect(highlight('Hello', '')).toBe('Hello');
  });

  test('returns empty string when text is falsy', () => {
    expect(highlight(null, 'foo')).toBe('');
  });

  test('escapes special regex characters in query', () => {
    const result = highlight('price $5.00', '$5.00', false);
    expect(result).toBe('price [$5.00]');
  });
});

describe('highlightBookmark', () => {
  const bm = { title: 'GitHub Home', url: 'https://github.com', tags: ['dev'] };

  test('highlights title and url by default', () => {
    const result = highlightBookmark(bm, 'git', { color: false });
    expect(result.title).toBe('[Git]Hub Home');
    expect(result.url).toBe('https://[git]hub.com');
  });

  test('does not mutate original bookmark', () => {
    highlightBookmark(bm, 'git', { color: false });
    expect(bm.title).toBe('GitHub Home');
  });

  test('returns bookmark unchanged when no query', () => {
    const result = highlightBookmark(bm, '');
    expect(result).toEqual(bm);
  });

  test('respects custom fields option', () => {
    const result = highlightBookmark(bm, 'git', { color: false, fields: ['title'] });
    expect(result.title).toContain('[Git]');
    expect(result.url).toBe('https://github.com');
  });
});

describe('highlightAll', () => {
  test('applies highlighting to all bookmarks', () => {
    const bookmarks = [
      { title: 'GitHub', url: 'https://github.com' },
      { title: 'GitLab', url: 'https://gitlab.com' },
    ];
    const results = highlightAll(bookmarks, 'git', { color: false });
    expect(results[0].title).toBe('[Git]Hub');
    expect(results[1].title).toBe('[Git]Lab');
  });

  test('returns empty array for empty input', () => {
    expect(highlightAll([], 'git')).toEqual([]);
  });
});
