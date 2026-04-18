'use strict';

const { findDuplicates, summarizeDuplicates, formatDuplicates } = require('./duplicates');

const bm = (url, title, addDate) => ({ url, title, addDate });

describe('findDuplicates', () => {
  test('returns empty map when no duplicates', () => {
    const bookmarks = [bm('https://a.com', 'A'), bm('https://b.com', 'B')];
    expect(findDuplicates(bookmarks).size).toBe(0);
  });

  test('groups exact duplicate URLs', () => {
    const bookmarks = [bm('https://a.com', 'A1'), bm('https://a.com', 'A2')];
    const map = findDuplicates(bookmarks);
    expect(map.size).toBe(1);
    const group = [...map.values()][0];
    expect(group).toHaveLength(2);
  });

  test('normalizes trailing slash differences', () => {
    const bookmarks = [bm('https://a.com/', 'A1'), bm('https://a.com', 'A2')];
    const map = findDuplicates(bookmarks);
    expect(map.size).toBe(1);
  });

  test('skips bookmarks with falsy url', () => {
    const bookmarks = [bm('', 'A'), bm(null, 'B'), bm('https://c.com', 'C')];
    expect(findDuplicates(bookmarks).size).toBe(0);
  });

  test('handles three duplicates', () => {
    const bookmarks = [
      bm('https://x.com', 'X1'),
      bm('https://x.com', 'X2'),
      bm('https://x.com', 'X3'),
    ];
    const map = findDuplicates(bookmarks);
    expect([...map.values()][0]).toHaveLength(3);
  });
});

describe('summarizeDuplicates', () => {
  test('returns sorted summary', () => {
    const bookmarks = [
      bm('https://a.com', 'A1'), bm('https://a.com', 'A2'), bm('https://a.com', 'A3'),
      bm('https://b.com', 'B1'), bm('https://b.com', 'B2'),
    ];
    const map = findDuplicates(bookmarks);
    const summary = summarizeDuplicates(map);
    expect(summary[0].count).toBeGreaterThanOrEqual(summary[1].count);
  });
});

describe('formatDuplicates', () => {
  test('reports no duplicates message', () => {
    expect(formatDuplicates([])).toMatch(/No duplicates/);
  });

  test('includes url and count in output', () => {
    const bookmarks = [bm('https://a.com', 'A1', 1700000000), bm('https://a.com', 'A2')];
    const summary = summarizeDuplicates(findDuplicates(bookmarks));
    const out = formatDuplicates(summary);
    expect(out).toMatch('https://a.com');
    expect(out).toMatch('[2x]');
    expect(out).toMatch('A1');
  });
});
