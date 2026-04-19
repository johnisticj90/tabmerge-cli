const fs = require('fs');
const os = require('os');
const path = require('path');
const { main } = require('./bookmark-comments.cli');

function writeTmp(data) {
  const file = path.join(os.tmpdir(), `bc-test-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify(data));
  return file;
}

const base = [
  { url: 'https://a.com', title: 'A' },
  { url: 'https://b.com', title: 'B' },
];

test('add writes comment to correct bookmark', () => {
  const file = writeTmp([...base]);
  main(['add', file, '0', 'hello world']);
  const result = JSON.parse(fs.readFileSync(file, 'utf8'));
  expect(result[0].comments).toHaveLength(1);
  expect(result[0].comments[0].text).toBe('hello world');
  expect(result[1].comments).toBeUndefined();
});

test('remove deletes specified comment', () => {
  const bm = [{ ...base[0], comments: [{ text: 'x', addedAt: 't1' }, { text: 'y', addedAt: 't2' }] }];
  const file = writeTmp(bm);
  main(['remove', file, '0', '0']);
  const result = JSON.parse(fs.readFileSync(file, 'utf8'));
  expect(result[0].comments).toHaveLength(1);
  expect(result[0].comments[0].text).toBe('y');
});

test('clear removes all comments', () => {
  const bm = [{ ...base[0], comments: [{ text: 'a', addedAt: 't' }] }];
  const file = writeTmp(bm);
  main(['clear', file, '0']);
  const result = JSON.parse(fs.readFileSync(file, 'utf8'));
  expect(result[0].comments).toEqual([]);
});

test('list prints no comments message', () => {
  const file = writeTmp([...base]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  main(['list', file, '0']);
  expect(spy).toHaveBeenCalledWith('No comments.');
  spy.mockRestore();
});

test('search prints matching bookmark urls', () => {
  const bm = [
    { ...base[0], comments: [{ text: 'important', addedAt: 't' }] },
    { ...base[1] },
  ];
  const file = writeTmp(bm);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  main(['search', file, 'important']);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('https://a.com'));
  spy.mockRestore();
});
