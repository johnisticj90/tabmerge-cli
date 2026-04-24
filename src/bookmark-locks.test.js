const {
  isLocked,
  lockOne,
  unlockOne,
  lockAll,
  unlockAll,
  filterLocked,
  filterUnlocked,
  assertUnlocked,
  applyIfUnlocked,
} = require('./bookmark-locks');

const make = (url, locked) => ({
  url,
  title: url,
  ...(locked !== undefined ? { locked } : {}),
});

describe('isLocked', () => {
  test('returns true when locked flag is true', () => {
    expect(isLocked(make('https://a.com', true))).toBe(true);
  });
  test('returns false when locked flag is absent', () => {
    expect(isLocked(make('https://a.com'))).toBe(false);
  });
  test('returns false when locked flag is false', () => {
    expect(isLocked(make('https://a.com', false))).toBe(false);
  });
});

describe('lockOne / unlockOne', () => {
  test('lockOne sets locked to true', () => {
    const b = lockOne(make('https://a.com'));
    expect(b.locked).toBe(true);
  });
  test('unlockOne removes locked property', () => {
    const b = unlockOne(make('https://a.com', true));
    expect(b.locked).toBeUndefined();
  });
  test('lockOne does not mutate original', () => {
    const orig = make('https://a.com');
    lockOne(orig);
    expect(orig.locked).toBeUndefined();
  });
});

describe('lockAll / unlockAll', () => {
  test('lockAll locks every bookmark', () => {
    const result = lockAll([make('https://a.com'), make('https://b.com')]);
    expect(result.every(b => b.locked === true)).toBe(true);
  });
  test('unlockAll unlocks every bookmark', () => {
    const result = unlockAll([make('https://a.com', true), make('https://b.com', true)]);
    expect(result.every(b => b.locked === undefined)).toBe(true);
  });
});

describe('filterLocked / filterUnlocked', () => {
  const list = [make('https://a.com', true), make('https://b.com'), make('https://c.com', true)];
  test('filterLocked returns only locked', () => {
    expect(filterLocked(list)).toHaveLength(2);
  });
  test('filterUnlocked returns only unlocked', () => {
    expect(filterUnlocked(list)).toHaveLength(1);
    expect(filterUnlocked(list)[0].url).toBe('https://b.com');
  });
});

describe('assertUnlocked', () => {
  test('does not throw for unlocked bookmarks', () => {
    expect(() => assertUnlocked([make('https://a.com')])).not.toThrow();
  });
  test('throws when a locked bookmark is present', () => {
    expect(() => assertUnlocked([make('https://a.com', true)])).toThrow(/locked/);
  });
  test('includes url in error message', () => {
    expect(() => assertUnlocked(make('https://locked.com', true))).toThrow('https://locked.com');
  });
});

describe('applyIfUnlocked', () => {
  test('transforms only unlocked bookmarks', () => {
    const list = [make('https://a.com', true), make('https://b.com')];
    const result = applyIfUnlocked(list, b => ({ ...b, title: 'changed' }));
    expect(result[0].title).toBe('https://a.com');
    expect(result[1].title).toBe('changed');
  });
});
