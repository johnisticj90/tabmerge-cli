const {
  addComment,
  removeComment,
  clearComments,
  hasComments,
  getComments,
  filterWithComments,
  filterWithoutComments,
  searchComments,
} = require('./bookmark-comments');

const base = { url: 'https://example.com', title: 'Example' };

test('addComment adds entry with text and addedAt', () => {
  const b = addComment(base, 'nice site');
  expect(b.comments).toHaveLength(1);
  expect(b.comments[0].text).toBe('nice site');
  expect(b.comments[0].addedAt).toBeDefined();
});

test('addComment appends to existing comments', () => {
  const b1 = addComment(base, 'first');
  const b2 = addComment(b1, 'second');
  expect(b2.comments).toHaveLength(2);
});

test('removeComment removes by index', () => {
  const b = addComment(addComment(base, 'a'), 'b');
  const result = removeComment(b, 0);
  expect(result.comments).toHaveLength(1);
  expect(result.comments[0].text).toBe('b');
});

test('removeComment on bookmark without comments returns unchanged', () => {
  const result = removeComment(base, 0);
  expect(result.comments).toBeUndefined();
});

test('clearComments empties comments array', () => {
  const b = addComment(base, 'x');
  expect(clearComments(b).comments).toEqual([]);
});

test('hasComments returns true/false correctly', () => {
  expect(hasComments(base)).toBe(false);
  expect(hasComments(addComment(base, 'hi'))).toBe(true);
});

test('getComments returns empty array when none', () => {
  expect(getComments(base)).toEqual([]);
});

test('filterWithComments keeps only bookmarks with comments', () => {
  const b1 = addComment(base, 'note');
  const result = filterWithComments([base, b1]);
  expect(result).toHaveLength(1);
});

test('filterWithoutComments keeps only bookmarks without comments', () => {
  const b1 = addComment(base, 'note');
  const result = filterWithoutComments([base, b1]);
  expect(result).toHaveLength(1);
  expect(result[0]).toBe(base);
});

test('searchComments finds matching text case-insensitively', () => {
  const b1 = addComment(base, 'Great Resource');
  const b2 = addComment({ ...base, url: 'https://other.com' }, 'meh');
  const result = searchComments([b1, b2], 'great');
  expect(result).toHaveLength(1);
  expect(result[0].comments[0].text).toBe('Great Resource');
});
