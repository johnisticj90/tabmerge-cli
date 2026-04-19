const {
  DEFAULT_CATEGORY,
  setCategory,
  clearCategory,
  getCategory,
  hasCategory,
  filterByCategory,
  groupByCategory,
  listCategories,
  renameCategory,
  categorizeAll,
} = require('./bookmark-categories');

const b = (url, category) => ({ url, title: url, ...(category ? { category } : {}) });

test('setCategory assigns category', () => {
  expect(setCategory(b('http://a.com'), 'news').category).toBe('news');
});

test('setCategory defaults to uncategorized', () => {
  expect(setCategory(b('http://a.com'), '').category).toBe(DEFAULT_CATEGORY);
});

test('clearCategory removes category', () => {
  const bm = setCategory(b('http://a.com'), 'tech');
  expect(clearCategory(bm).category).toBeUndefined();
});

test('getCategory returns category or default', () => {
  expect(getCategory(b('http://a.com', 'dev'))).toBe('dev');
  expect(getCategory(b('http://a.com'))).toBe(DEFAULT_CATEGORY);
});

test('hasCategory checks category', () => {
  expect(hasCategory(b('http://a.com', 'news'), 'news')).toBe(true);
  expect(hasCategory(b('http://a.com', 'tech'), 'news')).toBe(false);
});

test('filterByCategory filters correctly', () => {
  const list = [b('http://a.com', 'news'), b('http://b.com', 'tech'), b('http://c.com', 'news')];
  expect(filterByCategory(list, 'news')).toHaveLength(2);
  expect(filterByCategory(list, 'tech')).toHaveLength(1);
});

test('groupByCategory groups bookmarks', () => {
  const list = [b('http://a.com', 'news'), b('http://b.com', 'tech'), b('http://c.com', 'news')];
  const groups = groupByCategory(list);
  expect(groups.news).toHaveLength(2);
  expect(groups.tech).toHaveLength(1);
});

test('listCategories returns sorted unique categories', () => {
  const list = [b('http://a.com', 'news'), b('http://b.com', 'tech'), b('http://c.com', 'news')];
  expect(listCategories(list)).toEqual(['news', 'tech']);
});

test('renameCategory renames across bookmarks', () => {
  const list = [b('http://a.com', 'news'), b('http://b.com', 'tech')];
  const renamed = renameCategory(list, 'news', 'media');
  expect(renamed[0].category).toBe('media');
  expect(renamed[1].category).toBe('tech');
});

test('categorizeAll sets category on all', () => {
  const list = [b('http://a.com'), b('http://b.com', 'tech')];
  const result = categorizeAll(list, 'archive');
  expect(result.every(bm => bm.category === 'archive')).toBe(true);
});
