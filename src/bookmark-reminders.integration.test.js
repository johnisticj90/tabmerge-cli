'use strict';

const {
  setReminder, clearReminder, filterDue, filterUpcoming, sortByReminder,
} = require('./bookmark-reminders');

const now = new Date('2023-06-01T12:00:00Z');

function makeBookmarks() {
  return [
    { url: 'https://a.com', title: 'A', reminder: '2023-01-01T00:00:00.000Z' },
    { url: 'https://b.com', title: 'B', reminder: '2099-01-01T00:00:00.000Z' },
    { url: 'https://c.com', title: 'C' },
    { url: 'https://d.com', title: 'D', reminder: '2022-06-01T00:00:00.000Z' },
  ];
}

test('full pipeline: filter due then sort', () => {
  const bs = makeBookmarks();
  const due = filterDue(bs, now);
  expect(due).toHaveLength(2);
  const sorted = sortByReminder(due);
  expect(sorted[0].title).toBe('D');
  expect(sorted[1].title).toBe('A');
});

test('set then clear round-trip', () => {
  const bs = makeBookmarks();
  const withReminder = bs.map(b =>
    b.url === 'https://c.com' ? setReminder(b, '2023-05-01T00:00:00Z') : b
  );
  const due = filterDue(withReminder, now);
  expect(due.some(b => b.url === 'https://c.com')).toBe(true);

  const cleared = withReminder.map(b =>
    b.url === 'https://c.com' ? clearReminder(b) : b
  );
  expect(filterDue(cleared, now).some(b => b.url === 'https://c.com')).toBe(false);
});

test('upcoming excludes past and no-reminder', () => {
  const bs = makeBookmarks();
  const upcoming = filterUpcoming(bs, now);
  expect(upcoming).toHaveLength(1);
  expect(upcoming[0].title).toBe('B');
});
