const fs = require('fs');
const os = require('os');
const path = require('path');
const { importFile, importMany, collectBookmarks } = require('./importer');

function writeTmp(name, content) {
  const p = path.join(os.tmpdir(), name);
  fs.writeFileSync(p, content, 'utf8');
  return p;
}

const csvContent = `url,title,tags\nhttps://example.com,Example,test\nhttps://foo.com,Foo,`;
const jsonContent = JSON.stringify({
  roots: { bookmark_bar: { children: [{ type: 'url', name: 'Example', url: 'https://example.com' }] } }
});

test('importFile parses csv', () => {
  const p = writeTmp('test_import.csv', csvContent);
  const result = importFile(p);
  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBeGreaterThan(0);
  expect(result[0].url).toBe('https://example.com');
});

test('importFile throws for missing file', () => {
  expect(() => importFile('/no/such/file.csv')).toThrow('File not found');
});

test('importMany returns results and errors', () => {
  const p = writeTmp('test_import2.csv', csvContent);
  const { results, errors } = importMany([p, '/missing.csv']);
  expect(results).toHaveLength(1);
  expect(errors).toHaveLength(1);
  expect(errors[0].ok).toBe(false);
});

test('collectBookmarks flattens all bookmarks', () => {
  const p1 = writeTmp('test_collect1.csv', csvContent);
  const p2 = writeTmp('test_collect2.csv', csvContent);
  const all = collectBookmarks([p1, p2]);
  expect(all.length).toBe(4);
});

test('importMany strict mode throws on error', () => {
  const p = writeTmp('test_strict.csv', csvContent);
  expect(() => importMany([p, '/missing.csv'], { strict: true })).toThrow();
});
