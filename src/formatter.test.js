import { formatNetscape, formatJson, formatCsv, format } from './formatter.js';

const sampleBookmarks = [
  { url: 'https://example.com', title: 'Example', addDate: '1609459200' },
  { url: 'https://foo.bar/path?q=1', title: 'Foo & Bar', addDate: '1612137600' },
  { url: 'https://plain.org', title: 'Plain' },
];

describe('formatNetscape', () => {
  it('includes doctype header', () => {
    const out = formatNetscape(sampleBookmarks);
    expect(out).toContain('<!DOCTYPE NETSCAPE-Bookmark-file-1>');
  });

  it('renders each bookmark as <A> tag', () => {
    const out = formatNetscape(sampleBookmarks);
    expect(out).toContain('<A HREF="https://example.com"');
    expect(out).toContain('>Example</A>');
  });

  it('escapes HTML entities in titles', () => {
    const out = formatNetscape(sampleBookmarks);
    expect(out).toContain('Foo &amp; Bar');
  });

  it('includes ADD_DATE when present', () => {
    const out = formatNetscape(sampleBookmarks);
    expect(out).toContain('ADD_DATE="1609459200"');
  });

  it('omits ADD_DATE when missing', () => {
    const out = formatNetscape([{ url: 'https://plain.org', title: 'Plain' }]);
    expect(out).not.toContain('ADD_DATE');
  });
});

describe('formatJson', () => {
  it('returns valid JSON', () => {
    const out = formatJson(sampleBookmarks);
    expect(() => JSON.parse(out)).not.toThrow();
  });

  it('preserves all bookmark fields', () => {
    const parsed = JSON.parse(formatJson(sampleBookmarks));
    expect(parsed).toHaveLength(3);
    expect(parsed[0].url).toBe('https://example.com');
  });
});

describe('formatCsv', () => {
  it('includes header row', () => {
    const out = formatCsv(sampleBookmarks);
    expect(out.startsWith('url,title,addDate')).toBe(true);
  });

  it('has correct number of rows', () => {
    const rows = formatCsv(sampleBookmarks).split('\n');
    expect(rows).toHaveLength(sampleBookmarks.length + 1);
  });

  it('wraps fields containing commas in quotes', () => {
    const out = formatCsv([{ url: 'https://a.com', title: 'Hello, World' }]);
    expect(out).toContain('"Hello, World"');
  });
});

describe('format (dispatcher)', () => {
  it('defaults to json', () => {
    const out = format(sampleBookmarks);
    expect(() => JSON.parse(out)).not.toThrow();
  });

  it('routes to netscape', () => {
    const out = format(sampleBookmarks, 'netscape');
    expect(out).toContain('<!DOCTYPE NETSCAPE-Bookmark-file-1>');
  });

  it('routes to csv', () => {
    const out = format(sampleBookmarks, 'csv');
    expect(out.startsWith('url,title,addDate')).toBe(true);
  });
});
