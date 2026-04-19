const {
  addVisit,
  removeVisits,
  visitCount,
  lastVisited,
  firstVisited,
  filterVisitedAfter,
  filterNeverVisited,
  sortByLastVisited,
} = require('./bookmark-history');

const base = { url: 'https://example.com', title: 'Example' };

test('addVisit appends a date', () => {
  const b = addVisit(base, '2024-01-01');
  expect(b.visits).toEqual(['2024-01-01']);
});

test('addVisit accumulates visits', () => {
  const b1 = addVisit(base, '2024-01-01');
  const b2 = addVisit(b1, '2024-06-01');
  expect(b2.visits).toHaveLength(2);
});

test('removeVisits strips visits', () => {
  const b = addVisit(base, '2024-01-01');
  expect(removeVisits(b).visits).toBeUndefined();
});

test('visitCount returns 0 for no visits', () => {
  expect(visitCount(base)).toBe(0);
});

test('visitCount returns correct count', () => {
  const b = { ...base, visits: ['2024-01-01', '2024-02-01'] };
  expect(visitCount(b)).toBe(2);
});

test('lastVisited returns null when no visits', () => {
  expect(lastVisited(base)).toBeNull();
});

test('lastVisited returns last entry', () => {
  const b = { ...base, visits: ['2024-01-01', '2024-06-01'] };
  expect(lastVisited(b)).toBe('2024-06-01');
});

test('firstVisited returns first entry', () => {
  const b = { ...base, visits: ['2024-01-01', '2024-06-01'] };
  expect(firstVisited(b)).toBe('2024-01-01');
});

test('filterVisitedAfter filters correctly', () => {
  const bookmarks = [
    { ...base, visits: ['2024-03-01'] },
    { ...base, visits: ['2023-12-01'] },
    base,
  ];
  const result = filterVisitedAfter(bookmarks, '2024-01-01');
  expect(result).toHaveLength(1);
});

test('filterNeverVisited returns unvisited', () => {
  const bookmarks = [base, { ...base, visits: ['2024-01-01'] }];
  expect(filterNeverVisited(bookmarks)).toHaveLength(1);
});

test('sortByLastVisited sorts descending by default', () => {
  const bookmarks = [
    { ...base, visits: ['2024-01-01'] },
    { ...base, visits: ['2024-06-01'] },
  ];
  const sorted = sortByLastVisited(bookmarks);
  expect(lastVisited(sorted[0])).toBe('2024-06-01');
});
