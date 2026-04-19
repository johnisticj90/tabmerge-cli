const { rateOne, filterByRating, topRated, averageRating, filterRated } = require('./bookmark-ratings');
const { deduplicate } = require('./deduplicator');

const sample = [
  { url: 'https://example.com', title: 'Example' },
  { url: 'https://github.com', title: 'GitHub' },
  { url: 'https://example.com', title: 'Example Dupe' },
  { url: 'https://news.ycombinator.com', title: 'HN' }
];

test('rate then deduplicate preserves ratings', () => {
  const rated = sample.map((b, i) => rateOne(b, (i % 5) + 1));
  const deduped = deduplicate(rated);
  expect(deduped.length).toBeLessThan(rated.length);
  expect(filterRated(deduped).length).toBeGreaterThan(0);
});

test('full pipeline: rate, dedup, filter, top', () => {
  const rated = [
    { url: 'https://a.com', title: 'A', rating: 5 },
    { url: 'https://b.com', title: 'B', rating: 2 },
    { url: 'https://a.com', title: 'A2', rating: 4 },
    { url: 'https://c.com', title: 'C', rating: 3 }
  ];
  const deduped = deduplicate(rated);
  const filtered = filterByRating(deduped, 3);
  const top = topRated(filtered, 2);
  expect(top[0].rating).toBeGreaterThanOrEqual(top[top.length - 1].rating);
});

test('averageRating after filtering', () => {
  const list = [
    { url: 'https://a.com', title: 'A', rating: 4 },
    { url: 'https://b.com', title: 'B', rating: 2 },
    { url: 'https://c.com', title: 'C' }
  ];
  const filtered = filterByRating(list, 3);
  expect(averageRating(filtered)).toBe(4);
});
