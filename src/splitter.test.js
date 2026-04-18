const { chunkBySize, splitIntoParts, splitByPredicate } = require('./splitter');

function makeBookmarks(n) {
  return Array.from({ length: n }, (_, i) => ({
    url: `https://example.com/${i}`,
    title: `Bookmark ${i}`,
    tags: i % 2 === 0 ? ['even'] : ['odd'],
  }));
}

describe('chunkBySize', () => {
  test('splits evenly', () => {
    const bm = makeBookmarks(6);
    const chunks = chunkBySize(bm, 2);
    expect(chunks).toHaveLength(3);
    chunks.forEach(c => expect(c).toHaveLength(2));
  });

  test('last chunk may be smaller', () => {
    const bm = makeBookmarks(5);
    const chunks = chunkBySize(bm, 2);
    expect(chunks).toHaveLength(3);
    expect(chunks[2]).toHaveLength(1);
  });

  test('empty input returns empty array', () => {
    expect(chunkBySize([], 3)).toEqual([]);
  });

  test('throws on invalid chunkSize', () => {
    expect(() => chunkBySize(makeBookmarks(3), 0)).toThrow();
    expect(() => chunkBySize(makeBookmarks(3), -1)).toThrow();
  });
});

describe('splitIntoParts', () => {
  test('splits into equal parts', () => {
    const bm = makeBookmarks(9);
    const parts = splitIntoParts(bm, 3);
    expect(parts).toHaveLength(3);
    parts.forEach(p => expect(p).toHaveLength(3));
  });

  test('handles uneven split', () => {
    const bm = makeBookmarks(7);
    const parts = splitIntoParts(bm, 3);
    const total = parts.reduce((s, p) => s + p.length, 0);
    expect(total).toBe(7);
    expect(parts.length).toBeLessThanOrEqual(3);
  });

  test('n larger than length returns fewer parts', () => {
    const bm = makeBookmarks(2);
    const parts = splitIntoParts(bm, 5);
    expect(parts.length).toBe(2);
  });

  test('throws on invalid n', () => {
    expect(() => splitIntoParts(makeBookmarks(3), 0)).toThrow();
  });
});

describe('splitByPredicate', () => {
  test('separates matched from rest', () => {
    const bm = makeBookmarks(6);
    const { matched, rest } = splitByPredicate(bm, b => b.tags.includes('even'));
    expect(matched).toHaveLength(3);
    expect(rest).toHaveLength(3);
  });

  test('all match', () => {
    const bm = makeBookmarks(4);
    const { matched, rest } = splitByPredicate(bm, () => true);
    expect(matched).toHaveLength(4);
    expect(rest).toHaveLength(0);
  });

  test('none match', () => {
    const bm = makeBookmarks(4);
    const { matched, rest } = splitByPredicate(bm, () => false);
    expect(matched).toHaveLength(0);
    expect(rest).toHaveLength(4);
  });
});
