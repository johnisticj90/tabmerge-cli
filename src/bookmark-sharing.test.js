const {
  isShared,
  shareOne,
  unshareOne,
  getShareInfo,
  isExpiredShare,
  shareAll,
  unshareAll,
  filterShared,
  filterUnshared,
  findByToken,
} = require('./bookmark-sharing');

const base = { url: 'https://example.com', title: 'Example' };

describe('isShared', () => {
  test('returns false for plain bookmark', () => {
    expect(isShared(base)).toBe(false);
  });

  test('returns true after sharing', () => {
    expect(isShared(shareOne(base))).toBe(true);
  });
});

describe('shareOne', () => {
  test('adds _sharing metadata', () => {
    const shared = shareOne(base, { sharedBy: 'alice' });
    const info = shared._sharing;
    expect(info.enabled).toBe(true);
    expect(info.sharedBy).toBe('alice');
    expect(typeof info.token).toBe('string');
    expect(info.token.length).toBeGreaterThan(0);
  });

  test('respects provided token', () => {
    const shared = shareOne(base, { token: 'abc123' });
    expect(shared._sharing.token).toBe('abc123');
  });

  test('does not mutate original', () => {
    shareOne(base);
    expect(base._sharing).toBeUndefined();
  });
});

describe('unshareOne', () => {
  test('removes _sharing key', () => {
    const shared = shareOne(base);
    const unshared = unshareOne(shared);
    expect(unshared._sharing).toBeUndefined();
    expect(unshared.url).toBe(base.url);
  });
});

describe('isExpiredShare', () => {
  test('returns false when no expiry', () => {
    expect(isExpiredShare(shareOne(base))).toBe(false);
  });

  test('returns true for past expiry', () => {
    const shared = shareOne(base, { expiresAt: '2000-01-01T00:00:00.000Z' });
    expect(isExpiredShare(shared)).toBe(true);
  });

  test('returns false for future expiry', () => {
    const shared = shareOne(base, { expiresAt: '2099-01-01T00:00:00.000Z' });
    expect(isExpiredShare(shared)).toBe(false);
  });
});

describe('filterShared / filterUnshared', () => {
  const b1 = shareOne({ url: 'https://a.com', title: 'A' });
  const b2 = shareOne({ url: 'https://b.com', title: 'B' }, { expiresAt: '2000-01-01T00:00:00.000Z' });
  const b3 = { url: 'https://c.com', title: 'C' };
  const list = [b1, b2, b3];

  test('filterShared returns only active shared', () => {
    expect(filterShared(list)).toHaveLength(1);
    expect(filterShared(list)[0].url).toBe('https://a.com');
  });

  test('filterUnshared returns non-shared bookmarks', () => {
    expect(filterUnshared(list)).toHaveLength(1);
    expect(filterUnshared(list)[0].url).toBe('https://c.com');
  });
});

describe('findByToken', () => {
  test('finds bookmark by token', () => {
    const shared = shareOne(base, { token: 'tok42' });
    expect(findByToken([shared], 'tok42')).toBe(shared);
  });

  test('returns null when not found', () => {
    expect(findByToken([base], 'missing')).toBeNull();
  });
});

describe('shareAll / unshareAll', () => {
  test('shares all bookmarks', () => {
    const result = shareAll([base, base]);
    expect(result.every(isShared)).toBe(true);
  });

  test('unshares all bookmarks', () => {
    const shared = shareAll([base, base]);
    const result = unshareAll(shared);
    expect(result.every((b) => !isShared(b))).toBe(true);
  });
});
