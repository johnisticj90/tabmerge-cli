const fs = require('fs');
const os = require('os');
const path = require('path');
const { main } = require('./bookmark-history.cli');

function writeTmp(content, ext = '.json') {
  const p = path.join(os.tmpdir(), `bh-test-${Date.now()}${ext}`);
  fs.writeFileSync(p, content, 'utf8');
  return p;
}

const sampleJson = JSON.stringify([
  { url: 'https://example.com', title: 'Example' },
  { url: 'https://visited.com', title: 'Visited', visits: ['2024-01-01'] },
]);

let output;
beforeEach(() => {
  output = '';
  jest.spyOn(process.stdout, 'write').mockImplementation(s => { output += s; });
});
afterEach(() => jest.restoreAllMocks());

test('never-visited returns only unvisited', async () => {
  const f = writeTmp(sampleJson);
  await main(['never-visited', f]);
  const parsed = JSON.parse(output);
  expect(parsed).toHaveLength(1);
  expect(parsed[0].url).toBe('https://example.com');
});

test('add-visit adds visits to all bookmarks', async () => {
  const f = writeTmp(sampleJson);
  await main(['add-visit', f]);
  const parsed = JSON.parse(output);
  expect(parsed.every(b => b.visits && b.visits.length > 0)).toBe(true);
});

test('visited-after filters by date', async () => {
  const f = writeTmp(sampleJson);
  await main(['visited-after', '2023-01-01', f]);
  const parsed = JSON.parse(output);
  expect(parsed).toHaveLength(1);
  expect(parsed[0].url).toBe('https://visited.com');
});

test('sort returns bookmarks sorted by last visited', async () => {
  const data = JSON.stringify([
    { url: 'https://a.com', title: 'A', visits: ['2024-01-01'] },
    { url: 'https://b.com', title: 'B', visits: ['2024-06-01'] },
  ]);
  const f = writeTmp(data);
  await main(['sort', f]);
  const parsed = JSON.parse(output);
  expect(parsed[0].url).toBe('https://b.com');
});
