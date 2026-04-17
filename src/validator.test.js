const { isValidUrl, validateBookmark, validate } = require('./validator');

describe('isValidUrl', () => {
  test('accepts http urls', () => {
    expect(isValidUrl('http://example.com')).toBe(true);
  });

  test('accepts https urls', () => {
    expect(isValidUrl('https://example.com/path?q=1')).toBe(true);
  });

  test('accepts ftp urls', () => {
    expect(isValidUrl('ftp://files.example.com')).toBe(true);
  });

  test('rejects javascript: urls', () => {
    expect(isValidUrl('javascript:void(0)')).toBe(false);
  });

  test('rejects empty string', () => {
    expect(isValidUrl('')).toBe(false);
  });

  test('rejects non-url strings', () => {
    expect(isValidUrl('not a url')).toBe(false);
  });
});

describe('validateBookmark', () => {
  test('valid bookmark passes', () => {
    const b = { url: 'https://example.com', title: 'Example', tags: ['news'], addDate: 1700000000 };
    expect(validateBookmark(b)).toEqual([]);
  });

  test('missing url returns error', () => {
    expect(validateBookmark({ title: 'No URL' })).toContain('missing required field: url');
  });

  test('invalid url returns error', () => {
    const errs = validateBookmark({ url: 'not-a-url' });
    expect(errs.some(e => e.includes('invalid url'))).toBe(true);
  });

  test('non-array tags returns error', () => {
    const errs = validateBookmark({ url: 'https://x.com', tags: 'tag1' });
    expect(errs).toContain('tags must be an array');
  });

  test('non-numeric addDate returns error', () => {
    const errs = validateBookmark({ url: 'https://x.com', addDate: 'yesterday' });
    expect(errs).toContain('addDate must be a numeric timestamp');
  });

  test('non-object input returns error', () => {
    expect(validateBookmark(null)).toEqual(['bookmark must be an object']);
  });
});

describe('validate', () => {
  test('valid array returns valid true', () => {
    const result = validate([{ url: 'https://a.com' }, { url: 'https://b.com' }]);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('non-array input is invalid', () => {
    const result = validate('oops');
    expect(result.valid).toBe(false);
  });

  test('reports index of invalid bookmark', () => {
    const result = validate([{ url: 'https://ok.com' }, { title: 'no url' }]);
    expect(result.valid).toBe(false);
    expect(result.errors[0].index).toBe(1);
  });
});
