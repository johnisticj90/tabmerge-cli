const {
  setField,
  getField,
  removeField,
  hasField,
  clearFields,
  listFields,
  filterByField,
  filterHavingField,
  applyFieldToAll,
} = require('./bookmark-custom-fields');

const base = { url: 'https://example.com', title: 'Example' };

describe('setField / getField', () => {
  test('sets and retrieves a custom field', () => {
    const b = setField(base, 'source', 'pocket');
    expect(getField(b, 'source')).toBe('pocket');
  });

  test('does not mutate the original bookmark', () => {
    setField(base, 'x', 1);
    expect(base.customFields).toBeUndefined();
  });

  test('overwrites existing field value', () => {
    const b = setField(setField(base, 'k', 'old'), 'k', 'new');
    expect(getField(b, 'k')).toBe('new');
  });

  test('throws on empty key', () => {
    expect(() => setField(base, '', 'v')).toThrow();
  });
});

describe('hasField / removeField', () => {
  test('hasField returns true when field exists', () => {
    const b = setField(base, 'foo', 42);
    expect(hasField(b, 'foo')).toBe(true);
  });

  test('hasField returns false when field missing', () => {
    expect(hasField(base, 'foo')).toBe(false);
  });

  test('removeField deletes the key', () => {
    const b = removeField(setField(base, 'foo', 1), 'foo');
    expect(hasField(b, 'foo')).toBe(false);
  });

  test('removeField on bookmark with no customFields is safe', () => {
    expect(() => removeField(base, 'foo')).not.toThrow();
  });
});

describe('clearFields / listFields', () => {
  test('clearFields removes all custom fields', () => {
    const b = clearFields(setField(setField(base, 'a', 1), 'b', 2));
    expect(b.customFields).toBeUndefined();
  });

  test('listFields returns all keys', () => {
    const b = setField(setField(base, 'a', 1), 'b', 2);
    expect(listFields(b).sort()).toEqual(['a', 'b']);
  });

  test('listFields returns empty array when no fields', () => {
    expect(listFields(base)).toEqual([]);
  });
});

describe('filterByField / filterHavingField / applyFieldToAll', () => {
  const bookmarks = [
    setField(base, 'source', 'pocket'),
    setField(base, 'source', 'instapaper'),
    { ...base, title: 'No fields' },
  ];

  test('filterByField returns matching bookmarks', () => {
    expect(filterByField(bookmarks, 'source', 'pocket')).toHaveLength(1);
  });

  test('filterHavingField returns bookmarks with key', () => {
    expect(filterHavingField(bookmarks, 'source')).toHaveLength(2);
  });

  test('applyFieldToAll sets field on every bookmark', () => {
    const result = applyFieldToAll(bookmarks, 'reviewed', true);
    expect(result.every(b => getField(b, 'reviewed') === true)).toBe(true);
  });
});
