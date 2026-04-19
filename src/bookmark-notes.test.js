const {
  addNote, removeNote, hasNote,
  filterWithNotes, filterWithoutNotes,
  updateNote, applyNotes, exportNotes,
} = require('./bookmark-notes');

const bk = (url, title, note) => ({ url, title, ...(note !== undefined ? { note } : {}) });

test('addNote attaches note', () => {
  const b = addNote(bk('https://a.com', 'A'), 'my note');
  expect(b.note).toBe('my note');
});

test('addNote trims whitespace', () => {
  const b = addNote(bk('https://a.com', 'A'), '  hi  ');
  expect(b.note).toBe('hi');
});

test('removeNote deletes note', () => {
  const b = removeNote(bk('https://a.com', 'A', 'note'));
  expect(b.note).toBeUndefined();
});

test('hasNote returns true when note present', () => {
  expect(hasNote(bk('https://a.com', 'A', 'yes'))).toBe(true);
});

test('hasNote returns false when missing', () => {
  expect(hasNote(bk('https://a.com', 'A'))).toBe(false);
});

test('hasNote returns false for empty string', () => {
  expect(hasNote(bk('https://a.com', 'A', ''))).toBe(false);
});

test('filterWithNotes keeps only noted bookmarks', () => {
  const list = [bk('https://a.com', 'A', 'n'), bk('https://b.com', 'B')];
  expect(filterWithNotes(list)).toHaveLength(1);
});

test('filterWithoutNotes keeps only unnoted bookmarks', () => {
  const list = [bk('https://a.com', 'A', 'n'), bk('https://b.com', 'B')];
  expect(filterWithoutNotes(list)).toHaveLength(1);
});

test('updateNote transforms note text', () => {
  const b = updateNote(bk('https://a.com', 'A', 'hello'), s => s.toUpperCase());
  expect(b.note).toBe('HELLO');
});

test('updateNote is noop when no note', () => {
  const b = bk('https://a.com', 'A');
  expect(updateNote(b, s => s + '!')).toEqual(b);
});

test('applyNotes maps notes by url', () => {
  const list = [bk('https://a.com', 'A'), bk('https://b.com', 'B')];
  const result = applyNotes(list, { 'https://a.com': 'note for a' });
  expect(result[0].note).toBe('note for a');
  expect(result[1].note).toBeUndefined();
});

test('exportNotes returns url+note pairs', () => {
  const list = [bk('https://a.com', 'A', 'n1'), bk('https://b.com', 'B')];
  const exp = exportNotes(list);
  expect(exp).toEqual([{ url: 'https://a.com', note: 'n1' }]);
});
