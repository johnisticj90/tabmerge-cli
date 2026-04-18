'use strict';

const { normalizeTitle, capitalizeTitle, stripSuffix, renameOne, renameAll, rename } = require('./renamer');

describe('normalizeTitle', () => {
  it('trims leading/trailing whitespace', () => {
    expect(normalizeTitle('  hello  ')).toBe('hello');
  });

  it('collapses internal whitespace', () => {
    expect(normalizeTitle('foo   bar')).toBe('foo bar');
  });

  it('returns empty string for non-string input', () => {
    expect(normalizeTitle(null)).toBe('');
    expect(normalizeTitle(undefined)).toBe('');
  });
});

describe('capitalizeTitle', () => {
  it('capitalizes first letter', () => {
    expect(capitalizeTitle('hello world')).toBe('Hello world');
  });

  it('handles empty string', () => {
    expect(capitalizeTitle('')).toBe('');
  });

  it('normalizes before capitalizing', () => {
    expect(capitalizeTitle('  hello  ')).toBe('Hello');
  });
});

describe('stripSuffix', () => {
  it('strips " - SiteName" suffix', () => {
    expect(stripSuffix('My Article - Example Site')).toBe('My Article');
  });

  it('strips " | SiteName" suffix', () => {
    expect(stripSuffix('My Article | Example Site')).toBe('My Article');
  });

  it('leaves titles without suffix unchanged', () => {
    expect(stripSuffix('Just a title')).toBe('Just a title');
  });
});

describe('renameOne', () => {
  it('applies transform to title', () => {
    const b = { url: 'https://example.com', title: '  hello  ' };
    expect(renameOne(b, normalizeTitle).title).toBe('hello');
  });

  it('does not mutate original', () => {
    const b = { url: 'https://example.com', title: 'foo' };
    renameOne(b, t => t.toUpperCase());
    expect(b.title).toBe('foo');
  });
});

describe('rename', () => {
  const bookmarks = [
    { url: 'https://a.com', title: 'hello world - A Site' },
    { url: 'https://b.com', title: 'another page | B Site' },
  ];

  it('applies stripSuffix strategy', () => {
    const result = rename(bookmarks, 'stripSuffix');
    expect(result[0].title).toBe('hello world');
    expect(result[1].title).toBe('another page');
  });

  it('throws on unknown strategy', () => {
    expect(() => rename(bookmarks, 'unknown')).toThrow('Unknown rename strategy');
  });
});
