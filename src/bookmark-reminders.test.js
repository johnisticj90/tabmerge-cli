'use strict';

const {
  setReminder, clearReminder, hasReminder, isDue,
  filterDue, filterUpcoming, sortByReminder, formatReminder,
} = require('./bookmark-reminders');

const past = new Date('2020-01-01T00:00:00Z').toISOString();
const future = new Date('2099-01-01T00:00:00Z').toISOString();
const now = new Date('2023-06-01T00:00:00Z');

const base = { url: 'https://example.com', title: 'Example' };

test('setReminder attaches ISO date', () => {
  const b = setReminder(base, past);
  expect(b.reminder).toBe(past);
  expect(b.url).toBe(base.url);
});

test('clearReminder removes reminder', () => {
  const b = clearReminder(setReminder(base, past));
  expect(b.reminder).toBeUndefined();
});

test('hasReminder returns correct bool', () => {
  expect(hasReminder(setReminder(base, past))).toBe(true);
  expect(hasReminder(base)).toBe(false);
});

test('isDue returns true for past date', () => {
  expect(isDue(setReminder(base, past), now)).toBe(true);
});

test('isDue returns false for future date', () => {
  expect(isDue(setReminder(base, future), now)).toBe(false);
});

test('filterDue returns only due bookmarks', () => {
  const bs = [setReminder(base, past), setReminder(base, future), base];
  expect(filterDue(bs, now)).toHaveLength(1);
});

test('filterUpcoming returns future reminders', () => {
  const bs = [setReminder(base, past), setReminder(base, future)];
  expect(filterUpcoming(bs, now)).toHaveLength(1);
});

test('sortByReminder orders ascending', () => {
  const a = setReminder({ ...base, title: 'A' }, future);
  const b = setReminder({ ...base, title: 'B' }, past);
  const sorted = sortByReminder([a, b]);
  expect(sorted[0].title).toBe('B');
});

test('formatReminder returns null when no reminder', () => {
  expect(formatReminder(base)).toBeNull();
});

test('formatReminder returns string when reminder set', () => {
  const result = formatReminder(setReminder(base, past));
  expect(typeof result).toBe('string');
  expect(result).toContain('Example');
});
