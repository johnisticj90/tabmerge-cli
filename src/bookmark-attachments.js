// bookmark-attachments.js — attach arbitrary file references to bookmarks

function addAttachment(bookmark, attachment) {
  const attachments = bookmark.attachments ? [...bookmark.attachments] : [];
  if (attachments.find(a => a.id === attachment.id)) return bookmark;
  return { ...bookmark, attachments: [...attachments, { ...attachment, addedAt: attachment.addedAt || Date.now() }] };
}

function removeAttachment(bookmark, id) {
  if (!bookmark.attachments) return bookmark;
  return { ...bookmark, attachments: bookmark.attachments.filter(a => a.id !== id) };
}

function clearAttachments(bookmark) {
  return { ...bookmark, attachments: [] };
}

function hasAttachment(bookmark, id) {
  return !!(bookmark.attachments && bookmark.attachments.find(a => a.id === id));
}

function getAttachments(bookmark) {
  return bookmark.attachments || [];
}

function findAttachment(bookmark, id) {
  return (bookmark.attachments || []).find(a => a.id === id) || null;
}

function filterWithAttachments(bookmarks) {
  return bookmarks.filter(b => b.attachments && b.attachments.length > 0);
}

function filterWithoutAttachments(bookmarks) {
  return bookmarks.filter(b => !b.attachments || b.attachments.length === 0);
}

function countAttachments(bookmark) {
  return (bookmark.attachments || []).length;
}

module.exports = {
  addAttachment,
  removeAttachment,
  clearAttachments,
  hasAttachment,
  getAttachments,
  findAttachment,
  filterWithAttachments,
  filterWithoutAttachments,
  countAttachments,
};
