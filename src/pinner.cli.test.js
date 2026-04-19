'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

function writeTmp(name, content) {
  const p = path.join(os.tmpdir(), name);
  fs.writeFileSync(p, content);
  return p;
}

const sampleNetscape = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<DL>
<DT><A HREF="https://github.com/foo" ADD_DATE="1700000000">GitHub Foo</A>
<DT><A HREF="https://news.ycombinator.com" ADD_DATE="1700000001">HN</A>
</DL>`;

test('list prints nothing when no pins', () => {
  const inp = writeTmp('pinner_test.html', sampleNetscape);
  const out = execSync(`node src/pinner.cli.js list ${inp}`).toString();
  expect(out.trim()).toBe('');
});

test('pin command marks matching bookmarks', () => {
  const inp = writeTmp('pinner_test2.html', sampleNetscape);
  const out = writeTmp('pinner_out.html', '');
  execSync(`node src/pinner.cli.js pin --domain github.com -o ${out} ${inp}`);
  const content = fs.readFileSync(out, 'utf8');
  expect(content).toContain('github.com');
});

test('list after pin shows pinned url', () => {
  const inp = writeTmp('pinner_test3.html', sampleNetscape);
  const pinned = writeTmp('pinner_pinned.html', '');
  execSync(`node src/pinner.cli.js pin --domain github.com -o ${pinned} ${inp}`);
  const listed = execSync(`node src/pinner.cli.js list ${pinned}`).toString();
  expect(listed).toContain('github.com');
});

test('unpin removes pins', () => {
  const inp = writeTmp('pinner_test4.html', sampleNetscape);
  const pinned = writeTmp('pinner_pinned2.html', '');
  execSync(`node src/pinner.cli.js pin --domain github.com -o ${pinned} ${inp}`);
  const unpinned = writeTmp('pinner_unpinned.html', '');
  execSync(`node src/pinner.cli.js unpin -o ${unpinned} ${pinned}`);
  const listed = execSync(`node src/pinner.cli.js list ${unpinned}`).toString();
  expect(listed.trim()).toBe('');
});
