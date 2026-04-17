import { describe, it, expect } from 'vitest';
import { exportToString } from './exporter.js';
import { parseCsv } from './parsers/csv.js';
import { parseJson } from './parsers/json.js';
import { parseNetscape } from './parsers/netscape.js';

const bookmarks = [
  { url: 'https://example.com', title: 'Example', tags: ['news'], addDate: 1700000000 },
  { url: 'https://github.com',  title: 'GitHub',  tags: ['dev', 'code'], addDate: 1710000000 },
];

describe('exporter round-trip', () => {
  it('csv export can be re-parsed', () => {
    const csv = exportToString(bookmarks, 'csv');
    const parsed = parseCsv(csv);
    expect(parsed).toHaveLength(2);
    expect(parsed.map(b => b.url)).toContain('https://example.com');
    expect(parsed.map(b => b.url)).toContain('https://github.com');
  });

  it('json export can be re-parsed', () => {
    const json = exportToString(bookmarks, 'json');
    const parsed = parseJson(json);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].title).toBe('Example');
  });

  it('netscape export can be re-parsed', () => {
    const html = exportToString(bookmarks, 'netscape');
    const parsed = parseNetscape(html);
    expect(parsed).toHaveLength(2);
    expect(parsed.map(b => b.url)).toContain('https://github.com');
  });

  it('preserves tags through json round-trip', () => {
    const json = exportToString(bookmarks, 'json');
    const parsed = parseJson(json);
    const gh = parsed.find(b => b.url === 'https://github.com');
    expect(gh.tags).toEqual(expect.arrayContaining(['dev', 'code']));
  });
});
