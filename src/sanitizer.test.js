const { sanitizeUrl, sanitizeTitle, sanitizeTags, sanitizeBookmark, sanitizeAll } = require('./sanitizer');

describe('sanitizeUrl', () => {
  it('trims whitespace', () => {
    expect(sanitizeUrl('  https://example.com  ')).toBe('https://example.com');
  });
  it('rejects javascript: urls', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('');
  });
  it('rejects data: urls', () => {
    expect(sanitizeUrl('data:text/html,hi')).toBe('');
  });
  it('returns empty string for non-string', () => {
    expect(sanitizeUrl(null)).toBe('');
  });
});

describe('sanitizeTitle', () => {
  it('trims and collapses whitespace', () => {
    expect(sanitizeTitle('  Hello   World  ')).toBe('Hello World');
  });
  it('removes control characters', () => {
    expect(sanitizeTitle('Hello\x00World')).toBe('HelloWorld');
  });
  it('returns empty string for non-string', () => {
    expect(sanitizeTitle(42)).toBe('');
  });
});

describe('sanitizeTags', () => {
  it('lowercases and deduplicates', () => {
    expect(sanitizeTags(['JS', 'js', 'Node'])).toEqual(['js', 'node']);
  });
  it('filters empty strings', () => {
    expect(sanitizeTags(['', '  ', 'dev'])).toEqual(['dev']);
  });
  it('returns empty array for non-array', () => {
    expect(sanitizeTags(null)).toEqual([]);
  });
});

describe('sanitizeBookmark', () => {
  it('sanitizes all fields', () => {
    const b = { url: '  https://example.com  ', title: '  My  Site  ', tags: ['JS', 'js'] };
    expect(sanitizeBookmark(b)).toEqual({ url: 'https://example.com', title: 'My Site', tags: ['js'] });
  });
  it('returns null for invalid url', () => {
    expect(sanitizeBookmark({ url: 'javascript:x', title: 'bad' })).toBeNull();
  });
  it('returns null for non-object', () => {
    expect(sanitizeBookmark(null)).toBeNull();
  });
});

describe('sanitizeAll', () => {
  it('filters out null results', () => {
    const bookmarks = [
      { url: 'https://a.com', title: 'A', tags: [] },
      { url: 'javascript:void(0)', title: 'Bad', tags: [] },
      { url: 'https://b.com', title: 'B', tags: [] },
    ];
    const result = sanitizeAll(bookmarks);
    expect(result).toHaveLength(2);
    expect(result.map(b => b.url)).toEqual(['https://a.com', 'https://b.com']);
  });
  it('returns empty array for non-array input', () => {
    expect(sanitizeAll('nope')).toEqual([]);
  });
});
