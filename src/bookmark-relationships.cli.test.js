const fs = require('fs');
const os = require('os');
const path = require('path');
const { main } = require('./bookmark-relationships.cli');

function writeTmp(data) {
  const file = path.join(os.tmpdir(), `rel-test-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify(data));
  return file;
}

function capture(fn) {
  const logs = [];
  const orig = console.log;
  console.log = (...a) => logs.push(a.join(' '));
  fn();
  console.log = orig;
  return logs;
}

test('add writes relationship to file', () => {
  const file = writeTmp([{ url: 'https://a.com', title: 'A' }]);
  main(['add', file, 'https://a.com', 'related', 'https://b.com']);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  expect(data[0].relationships.related).toContain('https://b.com');
});

test('remove deletes a relationship', () => {
  const bm = { url: 'https://a.com', title: 'A', relationships: { related: ['https://b.com'] } };
  const file = writeTmp([bm]);
  main(['remove', file, 'https://a.com', 'related', 'https://b.com']);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  expect(data[0].relationships).not.toHaveProperty('related');
});

test('list prints relationships', () => {
  const bm = { url: 'https://a.com', title: 'A', relationships: { related: ['https://b.com'] } };
  const file = writeTmp([bm]);
  const logs = capture(() => main(['list', file, 'https://a.com', 'related']));
  expect(logs.join('\n')).toContain('https://b.com');
});

test('clear removes all relationships', () => {
  const bm = { url: 'https://a.com', title: 'A', relationships: { related: ['https://b.com'] } };
  const file = writeTmp([bm]);
  main(['clear', file, 'https://a.com']);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  expect(data[0].relationships).toBeUndefined();
});

test('find returns related bookmarks', () => {
  const a = { url: 'https://a.com', title: 'A', relationships: { related: ['https://b.com'] } };
  const b = { url: 'https://b.com', title: 'B' };
  const file = writeTmp([a, b]);
  const logs = capture(() => main(['find', file, 'https://a.com', 'related']));
  expect(logs.join('\n')).toContain('https://b.com');
});
