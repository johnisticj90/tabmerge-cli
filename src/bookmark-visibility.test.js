const {
  isHidden,
  isVisible,
  hideOne,
  showOne,
  hideAll,
  showAll,
  filterVisible,
  filterHidden,
  toggleVisibility,
  hideByDomain,
} = require('./bookmark-visibility');

const b1 = { url: 'https://example.com', title: 'Example' };
const b2 = { url: 'https://hidden.com', title: 'Hidden', hidden: true };

test('isHidden returns true for hidden bookmarks', () => {
  expect(isHidden(b2)).toBe(true);
  expect(isHidden(b1)).toBe(false);
});

test('isVisible is inverse of isHidden', () => {
  expect(isVisible(b1)).toBe(true);
  expect(isVisible(b2)).toBe(false);
});

test('hideOne sets hidden flag', () => {
  const result = hideOne(b1);
  expect(result.hidden).toBe(true);
  expect(b1.hidden).toBeUndefined();
});

test('showOne removes hidden flag', () => {
  const result = showOne(b2);
  expect(result.hidden).toBeUndefined();
  expect(b2.hidden).toBe(true);
});

test('hideAll hides all bookmarks', () => {
  const results = hideAll([b1, b2]);
  expect(results.every(b => b.hidden === true)).toBe(true);
});

test('showAll shows all bookmarks', () => {
  const results = showAll([b1, b2]);
  expect(results.every(b => !b.hidden)).toBe(true);
});

test('filterVisible returns only visible', () => {
  expect(filterVisible([b1, b2])).toEqual([b1]);
});

test('filterHidden returns only hidden', () => {
  expect(filterHidden([b1, b2])).toEqual([b2]);
});

test('toggleVisibility flips hidden state', () => {
  expect(toggleVisibility(b1).hidden).toBe(true);
  expect(toggleVisibility(b2).hidden).toBeUndefined();
});

test('hideByDomain hides matching bookmarks', () => {
  const results = hideByDomain([b1, b2], 'example.com');
  expect(results[0].hidden).toBe(true);
  expect(results[1].hidden).toBe(true);
});
