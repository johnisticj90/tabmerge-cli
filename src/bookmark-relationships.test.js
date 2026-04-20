const {
  addRelationship,
  removeRelationship,
  hasRelationship,
  getRelationships,
  clearRelationships,
  findRelated,
  buildRelationshipMap,
} = require('./bookmark-relationships');

function makeBookmark(url) {
  return { url, title: url };
}

test('addRelationship adds a url under a type', () => {
  const b = makeBookmark('https://a.com');
  addRelationship(b, 'related', 'https://b.com');
  expect(b.relationships.related).toContain('https://b.com');
});

test('addRelationship does not duplicate', () => {
  const b = makeBookmark('https://a.com');
  addRelationship(b, 'related', 'https://b.com');
  addRelationship(b, 'related', 'https://b.com');
  expect(b.relationships.related.length).toBe(1);
});

test('removeRelationship removes a url', () => {
  const b = makeBookmark('https://a.com');
  addRelationship(b, 'related', 'https://b.com');
  removeRelationship(b, 'related', 'https://b.com');
  expect(b.relationships).not.toHaveProperty('related');
});

test('hasRelationship returns true when present', () => {
  const b = makeBookmark('https://a.com');
  addRelationship(b, 'parent', 'https://root.com');
  expect(hasRelationship(b, 'parent', 'https://root.com')).toBe(true);
});

test('hasRelationship returns false when absent', () => {
  const b = makeBookmark('https://a.com');
  expect(hasRelationship(b, 'parent', 'https://root.com')).toBe(false);
});

test('getRelationships returns urls for a type', () => {
  const b = makeBookmark('https://a.com');
  addRelationship(b, 'related', 'https://b.com');
  expect(getRelationships(b, 'related')).toEqual(['https://b.com']);
});

test('clearRelationships removes all relationships', () => {
  const b = makeBookmark('https://a.com');
  addRelationship(b, 'related', 'https://b.com');
  clearRelationships(b);
  expect(b.relationships).toBeUndefined();
});

test('findRelated returns matching bookmarks', () => {
  const a = makeBookmark('https://a.com');
  const b = makeBookmark('https://b.com');
  const c = makeBookmark('https://c.com');
  addRelationship(a, 'related', 'https://b.com');
  const result = findRelated([a, b, c], a, 'related');
  expect(result).toEqual([b]);
});

test('buildRelationshipMap builds url-keyed map', () => {
  const a = makeBookmark('https://a.com');
  addRelationship(a, 'related', 'https://b.com');
  const map = buildRelationshipMap([a]);
  expect(map['https://a.com'].related).toContain('https://b.com');
});
