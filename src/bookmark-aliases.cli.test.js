'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { main } = require('./bookmark-aliases.cli');

function writeTmp(data) {
  const f = path.join(os.tmpdir(), `aliases-test-${Date.now()}.json`);
  fs.writeFileSync(f, JSON.stringify(data));
  return f;
}

const bookmarks = [
  { url: 'https://example.com', title: 'Example' },
  { url: 'https://node.js.org', title: 'Node', alias: 'node' },
];

test('set writes alias to matching bookmark', async () => {
  const f = writeTmp(bookmarks);
  const out = path.join(os.tmpdir(), `aliases-out-${Date.now()}.json`);
  await main(['set', 'ex', 'https://example.com', '-o', out, f]);
  const result = JSON.parse(fs.readFileSync(out, 'utf8'));
  expect(result.find(b => b.url === 'https://example.com').alias).toBe('ex');
});

test('clear removes alias', async () => {
  const f = writeTmp(bookmarks);
  const out = path.join(os.tmpdir(), `aliases-out-${Date.now()}.json`);
  await main(['clear', 'node', '-o', out, f]);
  const result = JSON.parse(fs.readFileSync(out, 'utf8'));
  expect(result.find(b => b.url === 'https://node.js.org').alias).toBeUndefined();
});

test('list prints aliases to stdout', async () => {
  const f = writeTmp(bookmarks);
  const lines = [];
  const orig = console.log;
  console.log = (...a) => lines.push(a.join(' '));
  await main(['list', f]);
  console.log = orig;
  expect(lines.some(l => l.includes('node'))).toBe(true);
});

test('rename updates alias name', async () => {
  const f = writeTmp(bookmarks);
  const out = path.join(os.tmpdir(), `aliases-out-${Date.now()}.json`);
  await main(['rename', 'node', 'nodejs', '-o', out, f]);
  const result = JSON.parse(fs.readFileSync(out, 'utf8'));
  expect(result.find(b => b.url === 'https://node.js.org').alias).toBe('nodejs');
});
