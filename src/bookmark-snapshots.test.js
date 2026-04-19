const {
  createSnapshot,
  restoreSnapshot,
  diffSnapshot,
  listSnapshots,
  findSnapshot,
  deleteSnapshot,
} = require('./bookmark-snapshots');

const bm = (url, title) => ({ url, title });

const bookmarks = [
  bm('https://example.com', 'Example'),
  bm('https://github.com', 'GitHub'),
];

test('createSnapshot stores bookmarks with metadata', () => {
  const snap = createSnapshot(bookmarks, 'my snap');
  expect(snap.label).toBe('my snap');
  expect(snap.bookmarks).toHaveLength(2);
  expect(snap.id).toBeTruthy();
  expect(snap.createdAt).toBeTruthy();
});

test('createSnapshot uses ISO date as default label', () => {
  const snap = createSnapshot(bookmarks);
  expect(snap.label).toMatch(/\d{4}-\d{2}-\d{2}/);
});

test('restoreSnapshot returns copy of bookmarks', () => {
  const snap = createSnapshot(bookmarks);
  const restored = restoreSnapshot(snap);
  expect(restored).toHaveLength(2);
  expect(restored[0]).not.toBe(snap.bookmarks[0]);
});

test('diffSnapshot finds added and removed', () => {
  const snapA = createSnapshot([bm('https://a.com', 'A'), bm('https://b.com', 'B')]);
  const snapB = createSnapshot([bm('https://b.com', 'B'), bm('https://c.com', 'C')]);
  const { added, removed } = diffSnapshot(snapA, snapB);
  expect(added.map(b => b.url)).toEqual(['https://c.com']);
  expect(removed.map(b => b.url)).toEqual(['https://a.com']);
});

test('listSnapshots returns summary objects', () => {
  const snaps = [createSnapshot(bookmarks, 'first'), createSnapshot([], 'empty')];
  const list = listSnapshots(snaps);
  expect(list[0].count).toBe(2);
  expect(list[1].count).toBe(0);
  expect(list[0]).not.toHaveProperty('bookmarks');
});

test('findSnapshot returns correct snapshot', () => {
  const snaps = [createSnapshot(bookmarks, 'a'), createSnapshot(bookmarks, 'b')];
  const found = findSnapshot(snaps, snaps[1].id);
  expect(found.label).toBe('b');
});

test('findSnapshot returns null if not found', () => {
  expect(findSnapshot([], 'nope')).toBeNull();
});

test('deleteSnapshot removes by id', () => {
  const snaps = [createSnapshot(bookmarks, 'a'), createSnapshot(bookmarks, 'b')];
  const result = deleteSnapshot(snaps, snaps[0].id);
  expect(result).toHaveLength(1);
  expect(result[0].label).toBe('b');
});
