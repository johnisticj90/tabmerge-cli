'use strict';

const {
  groupDuplicates,
  summarize,
  formatReport,
  generateReport,
} = require('./bookmark-duplicates-report');

const bm = (url, title, addDate = 1700000000) => ({ url, title, addDate });

const bookmarks = [
  bm('https://example.com/', 'Example A', 1700000000),
  bm('https://example.com',  'Example B', 1700001000),
  bm('https://foo.com/bar',  'Foo',       1700002000),
  bm('https://unique.io',    'Unique',    1700003000),
  bm('https://foo.com/bar/', 'Foo Dupe',  1700004000),
];

describe('groupDuplicates', () => {
  it('groups bookmarks sharing the same normalized URL', () => {
    const groups = groupDuplicates(bookmarks);
    expect(groups).toHaveLength(2);
  });

  it('each group has at least 2 bookmarks', () => {
    const groups = groupDuplicates(bookmarks);
    for (const g of groups) {
      expect(g.bookmarks.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('returns empty array when no duplicates exist', () => {
    const unique = [bm('https://a.com', 'A'), bm('https://b.com', 'B')];
    expect(groupDuplicates(unique)).toHaveLength(0);
  });
});

describe('summarize', () => {
  it('correctly counts totals', () => {
    const groups = groupDuplicates(bookmarks);
    const summary = summarize(bookmarks, groups);
    expect(summary.total).toBe(5);
    expect(summary.duplicates).toBe(2);
    expect(summary.unique).toBe(3);
    expect(summary.groups).toBe(2);
  });
});

describe('formatReport', () => {
  it('includes header and summary lines', () => {
    const groups = groupDuplicates(bookmarks);
    const summary = summarize(bookmarks, groups);
    const text = formatReport(groups, summary);
    expect(text).toMatch(/Duplicate Bookmark Report/);
    expect(text).toMatch(/Total bookmarks/);
    expect(text).toMatch(/Duplicate groups: 2/);
  });

  it('lists each group URL', () => {
    const groups = groupDuplicates(bookmarks);
    const summary = summarize(bookmarks, groups);
    const text = formatReport(groups, summary);
    expect(text).toMatch(/https:\/\/example.com/);
    expect(text).toMatch(/https:\/\/foo.com\/bar/);
  });
});

describe('generateReport', () => {
  it('returns summary, groups, and text', () => {
    const report = generateReport(bookmarks);
    expect(report).toHaveProperty('summary');
    expect(report).toHaveProperty('groups');
    expect(report).toHaveProperty('text');
    expect(typeof report.text).toBe('string');
  });

  it('handles empty input gracefully', () => {
    const report = generateReport([]);
    expect(report.summary.total).toBe(0);
    expect(report.groups).toHaveLength(0);
  });
});
