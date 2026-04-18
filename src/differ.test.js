const { diffBookmarks, formatDiff } = require('./differ');

const a = { url: 'https://example.com', title: 'Example', tags: ['foo'] };
const b = { url: 'https://new.com', title: 'New Site', tags: [] };
const aChanged = { url: 'https://example.com', title: 'Example Updated', tags: ['foo'] };

describe('diffBookmarks', () => {
  test('detects added bookmarks', () => {
    const diff = diffBookmarks([a], [a, b]);
    expect(diff.added).toHaveLength(1);
    expect(diff.added[0].url).toBe('https://new.com');
    expect(diff.removed).toHaveLength(0);
    expect(diff.changed).toHaveLength(0);
  });

  test('detects removed bookmarks', () => {
    const diff = diffBookmarks([a, b], [a]);
    expect(diff.removed).toHaveLength(1);
    expect(diff.removed[0].url).toBe('https://new.com');
    expect(diff.added).toHaveLength(0);
  });

  test('detects changed bookmarks', () => {
    const diff = diffBookmarks([a], [aChanged]);
    expect(diff.changed).toHaveLength(1);
    expect(diff.changed[0].old.title).toBe('Example');
    expect(diff.changed[0].new.title).toBe('Example Updated');
  });

  test('no diff on identical lists', () => {
    const diff = diffBookmarks([a, b], [a, b]);
    expect(diff.added).toHaveLength(0);
    expect(diff.removed).toHaveLength(0);
    expect(diff.changed).toHaveLength(0);
  });

  test('handles empty old list', () => {
    const diff = diffBookmarks([], [a, b]);
    expect(diff.added).toHaveLength(2);
  });
});

describe('formatDiff', () => {
  test('returns summary line', () => {
    const diff = diffBookmarks([a], [a, b]);
    const out = formatDiff(diff);
    expect(out).toContain('+ 1 added');
    expect(out).toContain('- 0 removed');
  });

  test('lists added urls', () => {
    const diff = diffBookmarks([], [a]);
    const out = formatDiff(diff);
    expect(out).toContain('https://example.com');
  });
});
