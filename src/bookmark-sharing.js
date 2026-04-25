/**
 * bookmark-sharing.js
 * Manage sharing state and shared-link metadata for bookmarks.
 */

const SHARE_KEY = '_sharing';

function isShared(bookmark) {
  return !!(bookmark[SHARE_KEY] && bookmark[SHARE_KEY].enabled);
}

function shareOne(bookmark, { sharedBy = null, expiresAt = null, token = null } = {}) {
  return {
    ...bookmark,
    [SHARE_KEY]: {
      enabled: true,
      sharedBy,
      sharedAt: new Date().toISOString(),
      expiresAt: expiresAt || null,
      token: token || _generateToken(),
    },
  };
}

function unshareOne(bookmark) {
  const copy = { ...bookmark };
  delete copy[SHARE_KEY];
  return copy;
}

function getShareInfo(bookmark) {
  return bookmark[SHARE_KEY] || null;
}

function isExpiredShare(bookmark) {
  const info = getShareInfo(bookmark);
  if (!info || !info.expiresAt) return false;
  return new Date(info.expiresAt) < new Date();
}

function shareAll(bookmarks, options = {}) {
  return bookmarks.map((b) => shareOne(b, options));
}

function unshareAll(bookmarks) {
  return bookmarks.map(unshareOne);
}

function filterShared(bookmarks) {
  return bookmarks.filter((b) => isShared(b) && !isExpiredShare(b));
}

function filterUnshared(bookmarks) {
  return bookmarks.filter((b) => !isShared(b));
}

function findByToken(bookmarks, token) {
  return bookmarks.find((b) => {
    const info = getShareInfo(b);
    return info && info.token === token;
  }) || null;
}

function _generateToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

module.exports = {
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
};
