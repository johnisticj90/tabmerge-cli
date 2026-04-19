const {
  setPriority,
  filterAtLeast,
  sortByPriority,
  filterByPriority,
} = require('./bookmark-priority');

const { deduplicate } = require('./deduplicator');

function makeBookmarks() {
  return [
    { url: 'https://example.com/', title: 'Example', priority: 'low' },
    { url: 'https://example.com', title: 'Example Dupe', priority: 'high' },
    { url: 'https://news.ycombinator.com', title: 'HN', priority: 'normal' },
    { url: 'https://github.com', title: 'GitHub', priority: 'critical' },
    { url: 'https://github.com/', title: 'GitHub Dupe', priority: 'high' },
  ];
}

test('deduplicate then filter high priority', () => {
  const bms = makeBookmarks();
  const deduped = deduplicate(bms);
  const high = filterAtLeast(deduped, 'high');
  expect(high.length).toBeGreaterThan(0);
  high.forEach(b => {
    expect(['high', 'critical'].includes(b.priority || 'normal')).toBe(true);
  });
});

test('sort after set priority', () => {
  const bms = makeBookmarks().map(b => setPriority(b, 'normal'));
  const updated = bms.map((b, i) => i % 2 === 0 ? setPriority(b, 'high') : b);
  const sorted = sortByPriority(updated);
  expect(sorted[0].priority).toBe('high');
});

test('filter exact level returns subset', () => {
  const bms = makeBookmarks();
  const critical = filterByPriority(bms, 'critical');
  expect(critical).toHaveLength(1);
  expect(critical[0].title).toBe('GitHub');
});
