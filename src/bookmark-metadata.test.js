const { setMeta, getMeta, removeMeta, hasMeta, filterByMeta, setMetaAll, clearMetaAll } = require('./bookmark-metadata');

const b = (url, meta) => ({ url, title: url, meta });

test('setMeta adds key to bookmark', () => {
  const result = setMeta(b('http://a.com'), 'source', 'chrome');
  expect(result.meta.source).toBe('chrome');
});

test('setMeta does not mutate original', () => {
  const orig = b('http://a.com', { x: 1 });
  setMeta(orig, 'y', 2);
  expect(orig.meta.y).toBeUndefined();
});

test('getMeta returns value', () => {
  const bk = b('http://a.com', { foo: 'bar' });
  expect(getMeta(bk, 'foo')).toBe('bar');
});

test('getMeta returns undefined when missing', () => {
  expect(getMeta(b('http://a.com'), 'nope')).toBeUndefined();
});

test('removeMeta removes key', () => {
  const bk = b('http://a.com', { a: 1, b: 2 });
  const result = removeMeta(bk, 'a');
  expect(result.meta.a).toBeUndefined();
  expect(result.meta.b).toBe(2);
});

test('removeMeta handles missing meta', () => {
  const bk = b('http://a.com');
  expect(removeMeta(bk, 'x')).toEqual(bk);
});

test('hasMeta returns true when key present', () => {
  expect(hasMeta(b('http://a.com', { k: 0 }), 'k')).toBe(true);
});

test('hasMeta returns false when no meta', () => {
  expect(hasMeta(b('http://a.com'), 'k')).toBe(false);
});

test('filterByMeta filters by key existence', () => {
  const list = [b('http://a.com', { src: 'x' }), b('http://b.com')];
  expect(filterByMeta(list, 'src')).toHaveLength(1);
});

test('filterByMeta filters by key and value', () => {
  const list = [b('http://a.com', { src: 'x' }), b('http://b.com', { src: 'y' })];
  expect(filterByMeta(list, 'src', 'x')).toHaveLength(1);
});

test('setMetaAll sets key on all', () => {
  const list = [b('http://a.com'), b('http://b.com')];
  const result = setMetaAll(list, 'env', 'test');
  expect(result.every(bk => bk.meta.env === 'test')).toBe(true);
});

test('clearMetaAll removes key from all', () => {
  const list = [b('http://a.com', { env: 'test' }), b('http://b.com', { env: 'test' })];
  const result = clearMetaAll(list, 'env');
  expect(result.every(bk => !hasMeta(bk, 'env'))).toBe(true);
});
