const {
  addAttachment,
  removeAttachment,
  clearAttachments,
  hasAttachment,
  getAttachments,
  findAttachment,
  filterWithAttachments,
  filterWithoutAttachments,
  countAttachments,
} = require('./bookmark-attachments');

const base = { url: 'https://example.com', title: 'Example' };
const att1 = { id: 'a1', name: 'screenshot.png', type: 'image/png' };
const att2 = { id: 'a2', name: 'notes.txt', type: 'text/plain' };

test('addAttachment adds to empty list', () => {
  const b = addAttachment(base, att1);
  expect(b.attachments).toHaveLength(1);
  expect(b.attachments[0].id).toBe('a1');
});

test('addAttachment does not duplicate', () => {
  const b = addAttachment(addAttachment(base, att1), att1);
  expect(b.attachments).toHaveLength(1);
});

test('addAttachment sets addedAt if missing', () => {
  const b = addAttachment(base, att1);
  expect(b.attachments[0].addedAt).toBeDefined();
});

test('removeAttachment removes by id', () => {
  const b = addAttachment(addAttachment(base, att1), att2);
  const r = removeAttachment(b, 'a1');
  expect(r.attachments).toHaveLength(1);
  expect(r.attachments[0].id).toBe('a2');
});

test('clearAttachments empties list', () => {
  const b = addAttachment(base, att1);
  expect(clearAttachments(b).attachments).toHaveLength(0);
});

test('hasAttachment returns true/false', () => {
  const b = addAttachment(base, att1);
  expect(hasAttachment(b, 'a1')).toBe(true);
  expect(hasAttachment(b, 'a2')).toBe(false);
});

test('getAttachments returns empty array when none', () => {
  expect(getAttachments(base)).toEqual([]);
});

test('findAttachment returns correct attachment', () => {
  const b = addAttachment(addAttachment(base, att1), att2);
  expect(findAttachment(b, 'a2').name).toBe('notes.txt');
  expect(findAttachment(b, 'x')).toBeNull();
});

test('filterWithAttachments / filterWithoutAttachments', () => {
  const b1 = addAttachment(base, att1);
  const b2 = { ...base, url: 'https://other.com' };
  expect(filterWithAttachments([b1, b2])).toHaveLength(1);
  expect(filterWithoutAttachments([b1, b2])).toHaveLength(1);
});

test('countAttachments', () => {
  const b = addAttachment(addAttachment(base, att1), att2);
  expect(countAttachments(b)).toBe(2);
  expect(countAttachments(base)).toBe(0);
});
