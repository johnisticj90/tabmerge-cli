// bookmark-permissions.js — per-bookmark access control

const VALID_ROLES = ['owner', 'editor', 'viewer'];

function isValidRole(role) {
  return VALID_ROLES.includes(role);
}

function setPermission(bookmark, user, role) {
  if (!isValidRole(role)) throw new Error(`Invalid role: ${role}`);
  const perms = bookmark.permissions ? { ...bookmark.permissions } : {};
  perms[user] = role;
  return { ...bookmark, permissions: perms };
}

function removePermission(bookmark, user) {
  if (!bookmark.permissions) return bookmark;
  const perms = { ...bookmark.permissions };
  delete perms[user];
  return { ...bookmark, permissions: perms };
}

function getPermission(bookmark, user) {
  return (bookmark.permissions && bookmark.permissions[user]) || null;
}

function hasPermission(bookmark, user, role) {
  const actual = getPermission(bookmark, user);
  if (!actual) return false;
  if (role === 'viewer') return true;
  if (role === 'editor') return actual === 'editor' || actual === 'owner';
  return actual === 'owner';
}

function clearPermissions(bookmark) {
  const b = { ...bookmark };
  delete b.permissions;
  return b;
}

function listPermissions(bookmark) {
  return bookmark.permissions ? Object.entries(bookmark.permissions).map(([user, role]) => ({ user, role })) : [];
}

function applyPermissions(bookmarks, user, role) {
  return bookmarks.map(b => setPermission(b, user, role));
}

module.exports = {
  VALID_ROLES,
  isValidRole,
  setPermission,
  removePermission,
  getPermission,
  hasPermission,
  clearPermissions,
  listPermissions,
  applyPermissions,
};
