const {
  createCollection,
  addToCollection,
  removeFromCollection,
  mergeCollections,
  renameCollection,
  filterCollection,
  collectionSize,
  hasBookmark,
} = require('./bookmark-collections');

const bm1 = { url: 'https://example.com', title: 'Example' };
const bm2 = { url: 'https://foo.com', title: 'Foo' };
const bm3 = { url: 'https://bar.com', title: 'Bar' };

test('createCollection returns empty collection', () => {
  const c = createCollection('test');
  expect(c.name).toBe('test');
  expect(c.bookmarks).toEqual([]);
  expect(c.createdAt).toBeDefined();
});

test('addToCollection adds bookmark', () => {
  const c = addToCollection(createCollection('c'), bm1);
  expect(c.bookmarks).toHaveLength(1);
});

test('addToCollection skips duplicate url', () => {
  let c = addToCollection(createCollection('c'), bm1);
  c = addToCollection(c, bm1);
  expect(c.bookmarks).toHaveLength(1);
});

test('removeFromCollection removes by url', () => {
  let c = addToCollection(createCollection('c'), bm1);
  c = addToCollection(c, bm2);
  c = removeFromCollection(c, bm1.url);
  expect(c.bookmarks).toHaveLength(1);
  expect(c.bookmarks[0].url).toBe(bm2.url);
});

test('mergeCollections combines without duplicates', () => {
  const a = { name: 'a', bookmarks: [bm1, bm2], createdAt: '' };
  const b = { name: 'b', bookmarks: [bm2, bm3], createdAt: '' };
  const merged = mergeCollections(a, b);
  expect(merged.bookmarks).toHaveLength(3);
});

test('renameCollection updates name', () => {
  const c = renameCollection(createCollection('old'), 'new');
  expect(c.name).toBe('new');
});

test('filterCollection filters bookmarks', () => {
  let c = addToCollection(addToCollection(createCollection('c'), bm1), bm2);
  c = filterCollection(c, b => b.url.includes('example'));
  expect(c.bookmarks).toHaveLength(1);
});

test('collectionSize returns count', () => {
  const c = addToCollection(createCollection('c'), bm1);
  expect(collectionSize(c)).toBe(1);
});

test('hasBookmark checks url presence', () => {
  const c = addToCollection(createCollection('c'), bm1);
  expect(hasBookmark(c, bm1.url)).toBe(true);
  expect(hasBookmark(c, bm2.url)).toBe(false);
});
