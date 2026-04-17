const fs = require('fs');
const path = require('path');
const os = require('os');
const { buildManifest, collectEntries, archiveToDir, SUPPORTED_FORMATS } = require('./archiver');

const sample = [
  { url: 'https://example.com', title: 'Example', tags: [], addDate: 0 },
  { url: 'https://openai.com', title: 'OpenAI', tags: ['ai'], addDate: 0 },
];

test('SUPPORTED_FORMATS contains expected formats', () => {
  expect(SUPPORTED_FORMATS).toContain('netscape');
  expect(SUPPORTED_FORMATS).toContain('json');
  expect(SUPPORTED_FORMATS).toContain('csv');
});

test('buildManifest returns valid JSON with count', () => {
  const raw = buildManifest(sample, { source: 'test' });
  const obj = JSON.parse(raw);
  expect(obj.count).toBe(2);
  expect(obj.version).toBe(1);
  expect(obj.source).toBe('test');
  expect(obj.createdAt).toBeDefined();
});

test('buildManifest with empty bookmarks returns count 0', () => {
  const raw = buildManifest([], {});
  const obj = JSON.parse(raw);
  expect(obj.count).toBe(0);
});

test('collectEntries returns one entry per format plus manifest', () => {
  const entries = collectEntries(sample, ['json', 'csv']);
  expect(entries).toHaveLength(3);
  const names = entries.map(e => e.name);
  expect(names).toContain('bookmarks.json');
  expect(names).toContain('bookmarks.csv');
  expect(names).toContain('manifest.json');
});

test('collectEntries throws on unsupported format', () => {
  expect(() => collectEntries(sample, ['xml'])).toThrow('Unsupported format');
});

test('collectEntries entries all have name and content fields', () => {
  const entries = collectEntries(sample, ['json']);
  for (const entry of entries) {
    expect(entry).toHaveProperty('name');
    expect(entry).toHaveProperty('content');
    expect(typeof entry.name).toBe('string');
    expect(typeof entry.content).toBe('string');
  }
});

test('archiveToDir writes files to disk', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tabmerge-'));
  const written = archiveToDir(sample, tmp, ['json']);
  expect(written.length).toBe(2); // json + manifest
  for (const f of written) expect(fs.existsSync(f)).toBe(true);
  fs.rmSync(tmp, { recursive: true });
});

test('archiveToDir creates outDir if missing', () => {
  const tmp = path.join(os.tmpdir(), `tabmerge-new-${Date.now()}`);
  archiveToDir(sample, tmp, ['csv']);
  expect(fs.existsSync(tmp)).toBe(true);
  fs.rmSync(tmp, { recursive: true });
});
