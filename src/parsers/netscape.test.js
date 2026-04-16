const { parseNetscape } = require('./netscape');

const SAMPLE_HTML = `
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
  <DT><A HREF="https://example.com" ADD_DATE="1609459200" TAGS="dev,tools">Example</A>
  <DT><A HREF="https://github.com" ADD_DATE="1612137600">GitHub</A>
  <DT><A HREF="about:blank">Should be skipped</A>
  <DT><A HREF="https://news.ycombinator.com">Hacker News</A>
</DL>
`;

describe('parseNetscape', () => {
  letmarks;

  beforeAll(() => {
    bookmarks = parseNetscape(SAMPLE_HTML);
  });
('returns correct number of bookmarks (ips about:blank)', () => {
    expect(bookmarks).toHaveLength(3);
  });

  test('par and url correctly', () => {
    expect(bookmarks[0]).toMatchObject({
      title: 'Example',
      url: 'https://example.com/'
    });
  });

  test('parses add_date as integer', () => {
    expect(bookmarks[0].addDate).toBe(1609459200);
  });

  test('parses tags as array', () => {
    expect(bookmarks[0].tags).toEqual(['dev', 'tools']);
  });

  test('bookmark without tags has no tags property', () => {
    expect(bookmarks[1].tags).toBeUndefined();
  });

  test('parses bookmark without add_date', () => {
    expect(bookmarks[2]).toMatchObject({
      title: 'Hacker News',
      url: 'https://news.ycombinator.com/'
    });
    expect(bookmarks[2].addDate).toBeUndefined();
  });
});
