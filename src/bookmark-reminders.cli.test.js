'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { main } = require('./bookmark-reminders.cli');

function writeTmp(data) {
  const p = path.join(os.tmpdir(), `reminders-test-${Date.now()}.json`);
  fs.writeFileSync(p, JSON.stringify(data));
  return p;
}

const past = '2020-01-01T00:00:00.000Z';
const future = '2099-01-01T00:00:00.000Z';

test('set writes reminder to file', () => {
  const f = writeTmp([{ url: 'https://a.com', title: 'A' }]);
  main(['set', 'https://a.com', past, f]);
  const result = JSON.parse(fs.readFileSync(f, 'utf8'));
  expect(result[0].reminder).toBe(past);
});

test('clear removes reminder from file', () => {
  const f = writeTmp([{ url: 'https://a.com', title: 'A', reminder: past }]);
  main(['clear', 'https://a.com', f]);
  const result = JSON.parse(fs.readFileSync(f, 'utf8'));
  expect(result[0].reminder).toBeUndefined();
});

test('due prints due bookmarks', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const f = writeTmp([
    { url: 'https://a.com', title: 'A', reminder: past },
    { url: 'https://b.com', title: 'B', reminder: future },
  ]);
  main(['due', f]);
  expect(spy).toHaveBeenCalledTimes(1);
  spy.mockRestore();
});

test('upcoming prints future bookmarks', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const f = writeTmp([
    { url: 'https://a.com', title: 'A', reminder: past },
    { url: 'https://b.com', title: 'B', reminder: future },
  ]);
  main(['upcoming', f]);
  expect(spy).toHaveBeenCalledTimes(1);
  spy.mockRestore();
});
