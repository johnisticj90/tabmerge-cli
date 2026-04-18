const { inferLabel, labelOne, labelAll, groupByLabel } = require('./labeler');

const bm = (url, title = '') => ({ url, title });

describe('inferLabel', () => {
  test('labels github as Development', () => {
    expect(inferLabel(bm('https://github.com/user/repo'))).toBe('Development');
  });

  test('labels youtube as Video', () => {
    expect(inferLabel(bm('https://youtube.com/watch?v=abc'))).toBe('Video');
  });

  test('labels reddit as Social', () => {
    expect(inferLabel(bm('https://reddit.com/r/programming'))).toBe('Social');
  });

  test('labels wikipedia as Reference', () => {
    expect(inferLabel(bm('https://en.wikipedia.org/wiki/Node.js'))).toBe('Reference');
  });

  test('returns Uncategorized for unknown', () => {
    expect(inferLabel(bm('https://example.com'))).toBe('Uncategorized');
  });

  test('matches title if url does not match', () => {
    expect(inferLabel(bm('https://example.com', 'documentation for stuff'))).toBe('Docs');
  });

  test('uses custom rules', () => {
    const rules = [{ pattern: /example\.com/, label: 'Custom' }];
    expect(inferLabel(bm('https://example.com'), rules)).toBe('Custom');
  });
});

describe('labelOne', () => {
  test('adds label field', () => {
    const result = labelOne(bm('https://github.com/x'));
    expect(result.label).toBe('Development');
    expect(result.url).toBe('https://github.com/x');
  });

  test('does not mutate original', () => {
    const orig = bm('https://github.com/x');
    labelOne(orig);
    expect(orig.label).toBeUndefined();
  });
});

describe('labelAll', () => {
  test('labels all bookmarks', () => {
    const list = [bm('https://github.com'), bm('https://example.com')];
    const result = labelAll(list);
    expect(result[0].label).toBe('Development');
    expect(result[1].label).toBe('Uncategorized');
  });
});

describe('groupByLabel', () => {
  test('groups bookmarks by label', () => {
    const list = labelAll([bm('https://github.com'), bm('https://reddit.com'), bm('https://github.com/y')]);
    const groups = groupByLabel(list);
    expect(groups['Development']).toHaveLength(2);
    expect(groups['Social']).toHaveLength(1);
  });

  test('handles empty array', () => {
    expect(groupByLabel([])).toEqual({});
  });
});
