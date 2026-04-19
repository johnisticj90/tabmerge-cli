const fs = require('fs');
const os = require('os');
const path = require('path');
const { main } = require('./bookmark-notes.cli');

function writeTmp(data) {
  const p = path.join(os.tmpdir(), `notes-test-${Date.now()}.json`);
  fs.writeFileSync(p, JSON.stringify(data));
  return p;
}

const sample = [
  { url: 'https://example.com', title: 'Example', note: 'existing note' },
  { url: 'https://other.com', title: 'Other' },
];

let out;
beforeEach(() => { out = []; jest.spyOn(console, 'log').mockImplementation(s => out.push(s)); });
afterEach(() => jest.restoreAllMocks());

test('list shows only bookmarks with notes', async () => {
  const p = writeTmp(sample);
  await main(['list', p]);
  expect(out).toHaveLength(1);
  expect(out[0]).toContain('https://example.com');
  expect(out[0]).toContain('existing note');
});

test('export returns url+note pairs', async () => {
  const p = writeTmp(sample);
  await main(['export', p]);
  const parsed = JSON.parse(out.join(''));
  expect(parsed).toHaveLength(1);
  expect(parsed[0]).toEqual({ url: 'https://example.com', note: 'existing note' });
});

test('add attaches note to matching url', async () => {
  const p = writeTmp(sample);
  await main(['add', 'https://other.com', 'new note', p]);
  const parsed = JSON.parse(out.join(''));
  const target = parsed.find(b => b.url === 'https://other.com');
  expect(target.note).toBe('new note');
});

test('remove deletes note from matching url', async () => {
  const p = writeTmp(sample);
  await main(['remove', 'https://example.com', p]);
  const parsed = JSON.parse(out.join(''));
  const target = parsed.find(b => b.url === 'https://example.com');
  expect(target.note).toBeUndefined();
});
