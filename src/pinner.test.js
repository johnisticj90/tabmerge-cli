'use strict';

const { isPinned, pinOne, unpinOne, pinAll, unpinAll, getPinned, sortWithPinnedFirst, PIN_TAG } = require('./pinner');

const bk = (url, tags = []) => ({ url, title: url, tags });

test('isPinned returns false when no pin tag', () => {
  expect(isPinned(bk('http://a.com', ['news']))).toBe(false);
});

test('isPinned returns true when pin tag present', () => {
  expect(isPinned(bk('http://a.com', [PIN_TAG]))).toBe(true);
});

test('pinOne adds pin tag', () => {
  const result = pinOne(bk('http://a.com', ['foo']));
  expect(result.tags).toContain(PIN_TAG);
  expect(result.tags).toContain('foo');
});

test('pinOne is idempotent', () => {
  const b = pinOne(bk('http://a.com'));
  expect(pinOne(b).tags.filter(t => t === PIN_TAG)).toHaveLength(1);
});

test('unpinOne removes pin tag', () => {
  const b = pinOne(bk('http://a.com', ['foo']));
  const result = unpinOne(b);
  expect(result.tags).not.toContain(PIN_TAG);
  expect(result.tags).toContain('foo');
});

test('pinAll pins matching bookmarks only', () => {
  const list = [bk('http://a.com'), bk('http://b.com')];
  const result = pinAll(list, b => b.url.includes('a'));
  expect(isPinned(result[0])).toBe(true);
  expect(isPinned(result[1])).toBe(false);
});

test('unpinAll removes all pins', () => {
  const list = [pinOne(bk('http://a.com')), pinOne(bk('http://b.com'))];
  unpinAll(list).forEach(b => expect(isPinned(b)).toBe(false));
});

test('getPinned filters to pinned only', () => {
  const list = [pinOne(bk('http://a.com')), bk('http://b.com')];
  expect(getPinned(list)).toHaveLength(1);
});

test('sortWithPinnedFirst puts pinned at top', () => {
  const list = [bk('http://a.com'), pinOne(bk('http://b.com')), bk('http://c.com')];
  const sorted = sortWithPinnedFirst(list);
  expect(isPinned(sorted[0])).toBe(true);
});
