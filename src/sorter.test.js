const { sortByTitle, sortByDate, sortByUrl, sort } = require('./sorter');

const bookmarks = [
  { title: 'Zebra', url: 'https://zebra.com', addDate: '1700000300' },
  { title: 'apple', url: 'https://apple.com', addDate: '1700000100' },
  { title: 'Mango', url: 'https://mango.org', addDate: '1700000200' },
];

describe('sortByTitle', () => {
  test('sorts ascending by default', () => {
    const result = sortByTitle(bookmarks);
    expect(result.map(b => b.title)).toEqual(['apple', 'Mango', 'Zebra']);
  });

  test('sorts descending', () => {
    const result = sortByTitle(bookmarks, 'desc');
    expect(result.map(b => b.title)).toEqual(['Zebra', 'Mango', 'apple']);
  });

  test('does not mutate original array', () => {
    const copy = [...bookmarks];
    sortByTitle(bookmarks);
    expect(bookmarks).toEqual(copy);
  });
});

describe('sortByDate', () => {
  test('sorts ascending', () => {
    const result = sortByDate(bookmarks);
    expect(result.map(b => b.title)).toEqual(['apple', 'Mango', 'Zebra']);
  });

  test('sorts descending', () => {
    const result = sortByDate(bookmarks, 'desc');
    expect(result.map(b => b.title)).toEqual(['Zebra', 'Mango', 'apple']);
  });

  test('handles missing addDate as 0', () => {
    const bms = [{ title: 'No date', url: 'https://x.com' }, ...bookmarks];
    const result = sortByDate(bms);
    expect(result[0].title).toBe('No date');
  });
});

describe('sortByUrl', () => {
  test('sorts ascending', () => {
    const result = sortByUrl(bookmarks);
    expect(result.map(b => b.url)).toEqual([
      'https://apple.com',
      'https://mango.org',
      'https://zebra.com',
    ]);
  });
});

describe('sort', () => {
  test('defaults to title asc', () => {
    const result = sort(bookmarks);
    expect(result[0].title).toBe('apple');
  });

  test('routes to sortByDate', () => {
    const result = sort(bookmarks, 'date', 'desc');
    expect(result[0].title).toBe('Zebra');
  });

  test('routes to sortByUrl', () => {
    const result = sort(bookmarks, 'url');
    expect(result[0].url).toBe('https://apple.com');
  });
});
