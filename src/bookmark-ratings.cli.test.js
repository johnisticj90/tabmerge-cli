const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

function writeTmp(data) {
  const f = path.join(os.tmpdir(), `ratings-test-${Date.now()}.json`);
  fs.writeFileSync(f, JSON.stringify(data));
  return f;
}

const cli = path.resolve(__dirname, 'bookmark-ratings.cli.js');
const run = (args) => execSync(`node ${cli} ${args}`, { encoding: 'utf8' });

const bookmarks = [
  { url: 'https://a.com', title: 'A' },
  { url: 'https://b.com', title: 'B', rating: 3 }
];

test('rate sets rating on all', () => {
  const f = writeTmp(bookmarks);
  const out = run(`rate 5 ${f}`);
  const result = JSON.parse(out);
  expect(result.every(b => b.rating === 5)).toBe(true);
});

test('unrate removes ratings', () => {
  const f = writeTmp(bookmarks);
  const out = run(`unrate ${f}`);
  const result = JSON.parse(out);
  expect(result.every(b => !b.rating)).toBe(true);
});

test('filter by min rating', () => {
  const rated = [
    { url: 'https://a.com', title: 'A', rating: 2 },
    { url: 'https://b.com', title: 'B', rating: 4 }
  ];
  const f = writeTmp(rated);
  const out = run(`filter 3 ${f}`);
  const result = JSON.parse(out);
  expect(result.length).toBe(1);
  expect(result[0].url).toBe('https://b.com');
});

test('top returns top n', () => {
  const rated = [
    { url: 'https://a.com', title: 'A', rating: 1 },
    { url: 'https://b.com', title: 'B', rating: 5 },
    { url: 'https://c.com', title: 'C', rating: 3 }
  ];
  const f = writeTmp(rated);
  const out = run(`top 2 ${f}`);
  const result = JSON.parse(out);
  expect(result.length).toBe(2);
  expect(result[0].url).toBe('https://b.com');
});

test('avg prints average', () => {
  const rated = [
    { url: 'https://a.com', title: 'A', rating: 2 },
    { url: 'https://b.com', title: 'B', rating: 4 }
  ];
  const f = writeTmp(rated);
  const out = run(`avg ${f}`);
  expect(out.trim()).toBe('3.00');
});
