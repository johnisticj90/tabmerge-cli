const {
  isValidRole,
  setPermission,
  removePermission,
  getPermission,
  hasPermission,
  clearPermissions,
  listPermissions,
  applyPermissions,
} = require('./bookmark-permissions');

const base = { url: 'https://example.com', title: 'Example' };

test('isValidRole accepts known roles', () => {
  expect(isValidRole('owner')).toBe(true);
  expect(isValidRole('editor')).toBe(true);
  expect(isValidRole('viewer')).toBe(true);
  expect(isValidRole('admin')).toBe(false);
});

test('setPermission adds a user role', () => {
  const b = setPermission(base, 'alice', 'editor');
  expect(b.permissions).toEqual({ alice: 'editor' });
});

test('setPermission throws on invalid role', () => {
  expect(() => setPermission(base, 'alice', 'superuser')).toThrow('Invalid role');
});

test('setPermission does not mutate original', () => {
  setPermission(base, 'alice', 'viewer');
  expect(base.permissions).toBeUndefined();
});

test('removePermission removes a user', () => {
  const b = setPermission(base, 'alice', 'owner');
  const b2 = removePermission(b, 'alice');
  expect(b2.permissions).toEqual({});
});

test('removePermission is safe when no permissions', () => {
  expect(removePermission(base, 'alice')).toEqual(base);
});

test('getPermission returns role or null', () => {
  const b = setPermission(base, 'bob', 'viewer');
  expect(getPermission(b, 'bob')).toBe('viewer');
  expect(getPermission(b, 'carol')).toBeNull();
});

test('hasPermission checks role hierarchy', () => {
  const b = setPermission(base, 'alice', 'editor');
  expect(hasPermission(b, 'alice', 'viewer')).toBe(true);
  expect(hasPermission(b, 'alice', 'editor')).toBe(true);
  expect(hasPermission(b, 'alice', 'owner')).toBe(false);
});

test('clearPermissions removes permissions field', () => {
  const b = setPermission(base, 'alice', 'owner');
  expect(clearPermissions(b).permissions).toBeUndefined();
});

test('listPermissions returns array of entries', () => {
  let b = setPermission(base, 'alice', 'owner');
  b = setPermission(b, 'bob', 'viewer');
  const list = listPermissions(b);
  expect(list).toContainEqual({ user: 'alice', role: 'owner' });
  expect(list).toContainEqual({ user: 'bob', role: 'viewer' });
});

test('applyPermissions sets role on all bookmarks', () => {
  const bookmarks = [base, { url: 'https://other.com', title: 'Other' }];
  const result = applyPermissions(bookmarks, 'team', 'viewer');
  result.forEach(b => expect(b.permissions.team).toBe('viewer'));
});
