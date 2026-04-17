const { paginate, getPage } = require('./paginator');
const { deduplicate } = require('./deduplicator');
const { sort } = require('./sorter');

describe('paginator integration', () => {
  const raw = [
    { url: 'https://b.com', title: 'B' },
    { url: 'https://a.com', title: 'A' },
    { url: 'https://b.com', title: 'B duplicate' },
    { url: 'https://c.com', title: 'C' },
    { url: 'https://d.com', title: 'D' },
  ];

  test('dedup -> sort -> paginate pipeline', () => {
    const deduped = deduplicate(raw);
    const sorted = sort(deduped, 'title');
    const { pages, totalItems } = paginate(sorted, 2);

    expect(totalItems).toBe(4);
    expect(pages).toHaveLength(2);
    expect(pages[0][0].title).toBe('A');
    expect(pages[0][1].title).toBe('B');
    expect(pages[1][0].title).toBe('C');
  });

  test('getPage on sorted+deduped list', () => {
    const deduped = deduplicate(raw);
    const sorted = sort(deduped, 'title');
    const result = getPage(sorted, 2, 2);

    expect(result.page).toBe(2);
    expect(result.items[0].title).toBe('C');
    expect(result.totalPages).toBe(2);
  });
});
