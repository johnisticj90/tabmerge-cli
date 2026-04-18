const { truncateString, truncateTitle, truncateUrl, truncate, truncateAll } = require('./truncator');

const longTitle = 'A'.repeat(80);
const longUrl = 'https://example.com/' + 'b'.repeat(100);

describe('truncateString', () => {
  it('returns short strings unchanged', () => {
    expect(truncateString('hello', 60)).toBe('hello');
  });

  it('truncates long strings with ellipsis', () => {
    const result = truncateString(longTitle, 60);
    expect(result.length).toBe(60);
    expect(result.endsWith('...')).toBe(true);
  });

  it('handles non-string input', () => {
    expect(truncateString(null, 60)).toBe('');
    expect(truncateString(undefined, 60)).toBe('');
  });
});

describe('truncateTitle', () => {
  it('truncates title field', () => {
    const b = { title: longTitle, url: 'https://x.com' };
    const result = truncateTitle(b);
    expect(result.title.length).toBeLessThanOrEqual(60);
    expect(result.url).toBe('https://x.com');
  });

  it('respects custom maxLength', () => {
    const b = { title: 'Hello World', url: '' };
    const result = truncateTitle(b, 5);
    expect(result.title).toBe('He...');
  });
});

describe('truncateUrl', () => {
  it('truncates url field', () => {
    const b = { title: 'Test', url: longUrl };
    const result = truncateUrl(b);
    expect(result.url.length).toBeLessThanOrEqual(80);
    expect(result.title).toBe('Test');
  });
});

describe('truncate', () => {
  it('truncates both title and url by default', () => {
    const b = { title: longTitle, url: longUrl };
    const result = truncate(b);
    expect(result.title.length).toBeLessThanOrEqual(60);
    expect(result.url.length).toBeLessThanOrEqual(80);
  });

  it('skips url truncation when url: false', () => {
    const b = { title: longTitle, url: longUrl };
    const result = truncate(b, { url: false });
    expect(result.url).toBe(longUrl);
  });

  it('respects custom lengths', () => {
    const b = { title: 'Hello World!', url: 'https://example.com/path' };
    const result = truncate(b, { titleLength: 8, urlLength: 20 });
    expect(result.title).toBe('Hello...');
    expect(result.url).toBe('https://example.c...');
  });
});

describe('truncateAll', () => {
  it('maps truncate over array', () => {
    const bookmarks = [
      { title: longTitle, url: longUrl },
      { title: 'Short', url: 'https://x.com' },
    ];
    const results = truncateAll(bookmarks);
    expect(results).toHaveLength(2);
    expect(results[0].title.length).toBeLessThanOrEqual(60);
    expect(results[1].title).toBe('Short');
  });

  it('returns empty array for non-array input', () => {
    expect(truncateAll(null)).toEqual([]);
  });
});
