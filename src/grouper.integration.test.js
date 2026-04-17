const { parse } = require('./parsers/index');
const { deduplicate } = require('./deduplicator');
const { group } = require('./grouper');

const netscapeFixture = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<DL><p>
  <DT><A HREF="https://github.com/a" ADD_DATE="1700000000" TAGS="dev">A</A>
  <DT><A HREF="https://github.com/b" ADD_DATE="1700000001" TAGS="dev,oss">B</A>
  <DT><A HREF="https://example.com/" ADD_DATE="1680000000" TAGS="ref">Example</A>
  <DT><A HREF="https://github.com/a" ADD_DATE="1700000000" TAGS="dev">A dup</A>
</DL>`;

test('parse -> deduplicate -> group by domain', () => {
  const parsed = parse(netscapeFixture, 'netscape');
  const deduped = deduplicate(parsed);
  expect(deduped).toHaveLength(3);
  const g = group(deduped, 'domain');
  expect(g['github.com']).toHaveLength(2);
  expect(g['example.com']).toHaveLength(1);
});

test('parse -> deduplicate -> group by tag', () => {
  const parsed = parse(netscapeFixture, 'netscape');
  const deduped = deduplicate(parsed);
  const g = group(deduped, 'tag');
  expect(g['dev']).toHaveLength(2);
  expect(g['oss']).toHaveLength(1);
  expect(g['ref']).toHaveLength(1);
});
