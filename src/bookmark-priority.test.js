const {
  isValidPriority,
  setPriority,
  clearPriority,
  getPriority,
  filterByPriority,
  filterAtLeast,
  sortByPriority,
  setPriorityAll,
} = require('./bookmark-priority');

const bm = (url, priority) => ({ url, title: url, ...(priority ? { priority } : {}) });

test('isValidPriority', () => {
  expect(isValidPriority('high')).toBe(true);
  expect(isValidPriority('urgent')).toBe(false);
});

test('setPriority sets level', () => {
  const b = setPriority(bm('http://a.com'), 'high');
  expect(b.priority).toBe('high');
});

test('setPriority throws on invalid', () => {
  expect(() => setPriority(bm('http://a.com'), 'mega')).toThrow();
});

test('clearPriority removes field', () => {
  const b = clearPriority(bm('http://a.com', 'high'));
  expect(b.priority).toBeUndefined();
});

test('getPriority defaults to normal', () => {
  expect(getPriority(bm('http://a.com'))).toBe('normal');
  expect(getPriority(bm('http://a.com', 'critical'))).toBe('critical');
});

test('filterByPriority', () => {
  const list = [bm('a', 'high'), bm('b', 'low'), bm('c', 'high')];
  expect(filterByPriority(list, 'high')).toHaveLength(2);
});

test('filterAtLeast', () => {
  const list = [bm('a', 'low'), bm('b', 'normal'), bm('c', 'high'), bm('d', 'critical')];
  expect(filterAtLeast(list, 'high')).toHaveLength(2);
});

test('sortByPriority desc', () => {
  const list = [bm('a', 'low'), bm('b', 'critical'), bm('c', 'normal')];
  const sorted = sortByPriority(list);
  expect(sorted[0].priority).toBe('critical');
  expect(sorted[2].priority).toBe('low');
});

test('sortByPriority asc', () => {
  const list = [bm('a', 'critical'), bm('b', 'low')];
  const sorted = sortByPriority(list, 'asc');
  expect(sorted[0].priority).toBe('low');
});

test('setPriorityAll', () => {
  const list = [bm('a'), bm('b')];
  const result = setPriorityAll(list, 'high');
  expect(result.every(b => b.priority === 'high')).toBe(true);
});
