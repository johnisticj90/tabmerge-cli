'use strict';

const { run } = require('./pipeline');

const netscapeDoc = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
  <DT>com"_DATE="1700000100" TAGS="dev</A>
  .org" ADD_DATE="1700000200</A>
</DL><p>`;

const netscapeDoc2 = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
  <DT>" ADD_DATE="1700000</DL><p>`;

const inputs = [
  { content: netscapeDoc,  path: 'a.html' },
  { content: netscapeDoc2, path: 'b.html' },
];

test('run merges and deduplicates', () => {
  const { bookmarks } = run(inputs, {});
  const urls = bookmarks.map(b => b.url);
  expect(urls.filter(u => u === 'https://example.com').length).toBe(1);
  expect(urls).toContain('https://other.org');
  expect(urls).toContain('https://extra.io');
});

test('run outputs netscape by default', () => {
  const { output } = run(inputs, {});
  expect(output).toMatch(/NETSCAPE-Bookmark-file-1/);
});

test('run outputs csv format', () => {
  const { output } = run(inputs, { format: 'csv' });
  const lines = output.trim().split('\n');
  expect(lines[0]).toMatch(/url/i);
});

test('run outputs json format', () => {
  const { output } = run(inputs, { format: 'json' });
  expect(() => JSON.parse(output)).not.toThrow();
});

test('run throws on unknown format', () => {
  expect(() => run(inputs, { format: 'xml' })).toThrow('Unknown output format: xml');
});

test('run applies domain filter', () => {
  const { bookmarks } = run(inputs, { domain: 'example.com' });
  expect(bookmarks.every(b => b.url.includes('example.com'))).toBe(true);
});
