// bookmark-notes.js — attach, remove, and query notes on bookmarks

function addNote(bookmark, note) {
  return { ...bookmark, note: note.trim() };
}

function removeNote(bookmark) {
  const b = { ...bookmark };
  delete b.note;
  return b;
}

function hasNote(bookmark) {
  return typeof bookmark.note === 'string' && bookmark.note.length > 0;
}

function filterWithNotes(bookmarks) {
  return bookmarks.filter(hasNote);
}

function filterWithoutNotes(bookmarks) {
  return bookmarks.filter(b => !hasNote(b));
}

function updateNote(bookmark, fn) {
  if (!hasNote(bookmark)) return bookmark;
  return { ...bookmark, note: fn(bookmark.note).trim() };
}

function applyNotes(bookmarks, noteMap) {
  // noteMap: { [url]: noteString }
  return bookmarks.map(b => {
    const note = noteMap[b.url];
    if (note !== undefined) return addNote(b, note);
    return b;
  });
}

function exportNotes(bookmarks) {
  return bookmarks
    .filter(hasNote)
    .map(b => ({ url: b.url, note: b.note }));
}

module.exports = {
  addNote,
  removeNote,
  hasNote,
  filterWithNotes,
  filterWithoutNotes,
  updateNote,
  applyNotes,
  exportNotes,
};
