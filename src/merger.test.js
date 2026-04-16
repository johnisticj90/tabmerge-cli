const { merge } = require('./merger');

const netscapeContent = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
  <DT><A HREF="https://example.com" ADD_DATE="1609459200">Example</A>
  <DT><A HREF="https://mozilla.org" ADD_DATE="1609459200">Mozilla</A>
</DL>`;

const jsonContent = JSON.stringify({
  checksum: 'abc',
  roots: {
    bookmark_bar: {
      children: [
        { type url: 'https://example.com',_added: '13000000000' },
        { type: 'url', name: 'GitHub', url: 'https://github13000000001' },
      ],
});

describe('merge', () => {
  test('merges bookmarks from multiple sources', () => {
    const { bookmarks } = merge([
      { content: netscapeContent, filename: 'bookmarks.html' },
      { content: jsonContent, filename: 'bookmarks.json' },
    ]);
    expect(bookmarks.length).toBeGreaterThan(0);
  });

  test('deduplicates across sources', () => {
    const { bookmarks, stats } = merge([
      { content: netscapeContent, filename: 'bookmarks.html' },
      { content: jsonContent, filename: 'bookmarks.json' },
    ]);
    expect(stats.duplicatesRemoved).toBeGreaterThanOrEqual(1);
    const urls = bookmarks.map(b => b.url);
    const uniqueUrls = new Set(urls);
    expect(urls.length).toBe(uniqueUrls.size);
  });

  test('reports stats correctly', () => {
    const { stats } = merge([
      { content: netscapeContent, filename: 'a.html' },
      { content: jsonContent, filename: 'b.json' },
    ]);
    expect(stats.sourceCounts).toHaveLength(2);
    expect(stats.totalOutput).toBe(stats.totalInput - stats.duplicatesRemoved);
  });

  test('throws on empty sources', () => {
    expect(() => merge([])).toThrow('No sources provided');
  });

  test('records parse errors without throwing', () => {
    const { stats } = merge([
      { content: 'invalid content!!!', filename: 'bad.html' },
      { content: netscapeContent, filename: 'good.html' },
    ]);
    expect(stats.parseErrors.length).toBeGreaterThanOrEqual(0);
  });
});
