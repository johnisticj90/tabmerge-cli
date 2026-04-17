const fs = require('fs');
const path = require('path');
const os = require('os');
const { archiveToDir } = require('./archiver');
const { parse } = require('./parsers/index');

const bookmarks = [
  { url: 'https://nodejs.org', title: 'Node.js', tags: ['dev'], addDate: 1700000000 },
  { url: 'https://github.com', title: 'GitHub', tags: ['dev', 'git'], addDate: 1710000000 },
  { url: 'https://github.com', title: 'GitHub Dupe', tags: [], addDate: 1710000001 },
];

test('full archive round-trip: write json, read back', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tabmerge-int-'));
  archiveToDir(bookmarks, tmp, ['json']);
  const jsonPath = path.join(tmp, 'bookmarks.json');
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const parsed = parse(raw, 'json');
  expect(parsed.length).toBe(3);
  expect(parsed.map(b => b.url)).toContain('https://nodejs.org');
  fs.rmSync(tmp, { recursive: true });
});

test('manifest reflects correct count', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tabmerge-int2-'));
  archiveToDir(bookmarks, tmp, ['csv']);
  const manifest = JSON.parse(fs.readFileSync(path.join(tmp, 'manifest.json'), 'utf8'));
  expect(manifest.count).toBe(bookmarks.length);
  fs.rmSync(tmp, { recursive: true });
});
