// Reminder support for bookmarks

'use strict';

function setReminder(bookmark, date) {
  return { ...bookmark, reminder: new Date(date).toISOString() };
}

function clearReminder(bookmark) {
  const b = { ...bookmark };
  delete b.reminder;
  return b;
}

function hasReminder(bookmark) {
  return Boolean(bookmark.reminder);
}

function isDue(bookmark, now = new Date()) {
  if (!hasReminder(bookmark)) return false;
  return new Date(bookmark.reminder) <= now;
}

function filterDue(bookmarks, now = new Date()) {
  return bookmarks.filter(b => isDue(b, now));
}

function filterUpcoming(bookmarks, now = new Date()) {
  return bookmarks.filter(b => hasReminder(b) && !isDue(b, now));
}

function sortByReminder(bookmarks) {
  return [...bookmarks]
    .filter(hasReminder)
    .sort((a, b) => new Date(a.reminder) - new Date(b.reminder));
}

function formatReminder(bookmark) {
  if (!hasReminder(bookmark)) return null;
  const d = new Date(bookmark.reminder);
  return `[${bookmark.title}] due ${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

module.exports = {
  setReminder,
  clearReminder,
  hasReminder,
  isDue,
  filterDue,
  filterUpcoming,
  sortByReminder,
  formatReminder,
};
