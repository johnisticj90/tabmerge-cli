// Track read/unread status for bookmarks

function isRead(bookmark) {
  return bookmark.status === 'read';
}

function isUnread(bookmark) {
  return !isRead(bookmark);
}

function markRead(bookmark) {
  return { ...bookmark, status: 'read', readAt: bookmark.readAt || new Date().toISOString() };
}

function markUnread(bookmark) {
  const { readAt, ...rest } = bookmark;
  return { ...rest, status: 'unread' };
}

function markAllRead(bookmarks) {
  return bookmarks.map(markRead);
}

function markAllUnread(bookmarks) {
  return bookmarks.map(markUnread);
}

function filterRead(bookmarks) {
  return bookmarks.filter(isRead);
}

function filterUnread(bookmarks) {
  return bookmarks.filter(isUnread);
}

function summarizeStatus(bookmarks) {
  const read = bookmarks.filter(isRead).length;
  const unread = bookmarks.length - read;
  return { total: bookmarks.length, read, unread };
}

module.exports = {
  isRead,
  isUnread,
  markRead,
  markUnread,
  markAllRead,
  markAllUnread,
  filterRead,
  filterUnread,
  summarizeStatus,
};
