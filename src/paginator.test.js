const { paginate, getPage } = require('./paginator');

function makeBookmarks(n) {
  return Array.from({ length: n }, (_, i) => ({
    url: `https://example.com/${i}`,
    title: `Bookmark ${i}`,
  }));
}

describe('paginate', () => {
  test('splits into correct number of pages', () => {
    const result = paginate(makeBookmarks(10), 3);
    expect(result.totalPages).toBe(4);
    expect(result.pages[0]).toHaveLength(3);
    expect(result.pages[3]).toHaveLength(1);
  });

  test('single page when items <= pageSize', () => {
    const result = paginate(makeBookmarks(5), 10);
    expect(result.totalPages).toBe(1);
    expect(result.totalItems).toBe(5);
  });

  test('empty array returns one empty page', () => {
    const result = paginate([], 10);
    expect(result.pages).toHaveLength(1);
    expect(result.pages[0]).toHaveLength(0);
  });

  test('throws on non-array', () => {
    expect(() => paginate('nope', 10)).toThrow(TypeError);
  });

  test('throws on pageSize < 1', () => {
    expect(() => paginate([], 0)).toThrow(RangeError);
  });
});

describe('getPage', () => {
  const items = makeBookmarks(25);

  test('returns correct slice for page 1', () => {
    const result = getPage(items, 1, 10);
    expect(result.items).toHaveLength(10);
    expect(result.items[0].title).toBe('Bookmark 0');
  });

  test('returns correct slice for last page', () => {
    const result = getPage(items, 3, 10);
    expect(result.items).toHaveLength(5);
    expect(result.totalPages).toBe(3);
  });

  test('throws on out-of-range page', () => {
    expect(() => getPage(items, 0, 10)).toThrow(RangeError);
    expect(() => getPage(items, 4, 10)).toThrow(RangeError);
  });

  test('metadata is correct', () => {
    const result = getPage(items, 2, 10);
    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(10);
    expect(result.totalItems).toBe(25);
  });
});
