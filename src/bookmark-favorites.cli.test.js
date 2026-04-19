const fs = require('fs');
const os = require('os');
const path = require('path');
const { main } = require('./bookmark-favorites.cli');

function writeTmp(content, ext = '.html') {
  const p = path.join(os.tmpdir(), `fav-test-${Date.now()}${ext}`);
  fs.writeFileSync(p, content);
  return p;
}

const NETSCAPE = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<DL><p>
  <DT><A HREF="https://example.com" ADD_DATE="1700000000">Example</A>
  <DT><A HREF="https://other.org" ADD_DATE="1700000001">Other</A>
</DL>`;

test('list returns empty when no favorites', async () => {
  const file = writeTmp(NETSCAPE);
  const out = [];
  const orig = process.stdout.write.bind(process.stdout);
  process.stdout.write = (s) => out.push(s);
  await main(['list', file, '--format=json']);
  process.stdout.write = orig;
  const parsed = JSON.parse(out.join(''));
  expect(Array.isArray(parsed)).toBe(true);
  expect(parsed).toHaveLength(0);
});

test('mark-all marks all bookmarks', async () => {
  const file = writeTmp(NETSCAPE);
  const out = [];
  const orig = process.stdout.write.bind(process.stdout);
  process.stdout.write = (s) => out.push(s);
  await main(['mark-all', file, '--format=json']);
  process.stdout.write = orig;
  const parsed = JSON.parse(out.join(''));
  expect(parsed.every(b => b.favorite)).toBe(true);
});

test('exits on unknown command', async () => {
  const file = writeTmp(NETSCAPE);
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
  await expect(main(['bogus', file])).rejects.toThrow('exit');
  exit.mockRestore();
});
