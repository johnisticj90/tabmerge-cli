const {
  addRelationship,
  removeRelationship,
  findRelated,
  buildRelationshipMap,
  clearRelationships,
} = require('./bookmark-relationships');

function makeBookmarks() {
  return [
    { url: 'https://a.com', title: 'A' },
    { url: 'https://b.com', title: 'B' },
    { url: 'https://c.com', title: 'C' },
  ];
}

test('full lifecycle: add, find, remove, clear', () => {
  const [a, b, c] = makeBookmarks();
  addRelationship(a, 'related', b.url);
  addRelationship(a, 'related', c.url);
  addRelationship(b, 'parent', a.url);

  const related = findRelated([a, b, c], a, 'related');
  expect(related.map(x => x.url)).toEqual([b.url, c.url]);

  removeRelationship(a, 'related', c.url);
  const afterRemove = findRelated([a, b, c], a, 'related');
  expect(afterRemove.map(x => x.url)).toEqual([b.url]);

  clearRelationships(a);
  expect(a.relationships).toBeUndefined();
});

test('buildRelationshipMap covers all bookmarks with relationships', () => {
  const [a, b] = makeBookmarks();
  addRelationship(a, 'child', b.url);
  addRelationship(b, 'parent', a.url);
  const map = buildRelationshipMap([a, b]);
  expect(Object.keys(map)).toContain(a.url);
  expect(Object.keys(map)).toContain(b.url);
  expect(map[a.url].child).toContain(b.url);
  expect(map[b.url].parent).toContain(a.url);
});

test('findRelated with no relationships returns empty array', () => {
  const [a, b] = makeBookmarks();
  expect(findRelated([a, b], a, 'related')).toEqual([]);
});
