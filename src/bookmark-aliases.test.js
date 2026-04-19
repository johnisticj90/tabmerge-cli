'use strict';

const {
  setAlias, clearAlias, hasAlias, findByAlias,
  resolveAlias, listAliases, renameAlias,
} = require('./bookmark-aliases');

const bm = (url, title, alias) => ({ url, title, ...(alias ? { alias } : {}) });

test('setAlias attaches alias', () => {
  const b = setAlias(bm('https://example.com', 'Ex'), 'ex');
  expect(b.alias).toBe('ex');
});

test('setAlias trims whitespace', () => {
  const b = setAlias(bm('https://a.com', 'A'), '  a  ');
  expect(b.alias).toBe('a');
});

test('clearAlias removes alias', () => {
  const b = clearAlias(bm('https://a.com', 'A', 'a'));
  expect(b.alias).toBeUndefined();
});

test('hasAlias returns true when alias present', () => {
  expect(hasAlias(bm('https://a.com', 'A', 'a'))).toBe(true);
  expect(hasAlias(bm('https://a.com', 'A'))).toBe(false);
});

test('findByAlias returns matching bookmark', () => {
  const list = [bm('https://a.com', 'A', 'a'), bm('https://b.com', 'B', 'b')];
  expect(findByAlias(list, 'b').url).toBe('https://b.com');
  expect(findByAlias(list, 'z')).toBeNull();
});

test('resolveAlias finds by alias then by url', () => {
  const list = [bm('https://a.com', 'A', 'a'), bm('https://b.com', 'B')];
  expect(resolveAlias(list, 'a').url).toBe('https://a.com');
  expect(resolveAlias(list, 'https://b.com').url).toBe('https://b.com');
  expect(resolveAlias(list, 'nope')).toBeNull();
});

test('listAliases returns only aliased bookmarks', () => {
  const list = [bm('https://a.com', 'A', 'a'), bm('https://b.com', 'B')];
  const aliases = listAliases(list);
  expect(aliases).toHaveLength(1);
  expect(aliases[0]).toEqual({ alias: 'a', url: 'https://a.com', title: 'A' });
});

test('renameAlias updates matching alias', () => {
  const list = [bm('https://a.com', 'A', 'old'), bm('https://b.com', 'B', 'b')];
  const updated = renameAlias(list, 'old', 'new');
  expect(updated[0].alias).toBe('new');
  expect(updated[1].alias).toBe('b');
});
