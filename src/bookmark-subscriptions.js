// bookmark-subscriptions.js — manage feed/newsletter subscriptions on bookmarks

const SUBSCRIPTION_KEY = 'subscription';

function setSubscription(bookmark, sub) {
  if (!sub || typeof sub.url !== 'string') {
    throw new Error('subscription must have a url string');
  }
  return {
    ...bookmark,
    [SUBSCRIPTION_KEY]: {
      url: sub.url,
      label: sub.label || '',
      frequency: sub.frequency || 'weekly',
      active: sub.active !== undefined ? Boolean(sub.active) : true,
      subscribedAt: sub.subscribedAt || new Date().toISOString(),
    },
  };
}

function clearSubscription(bookmark) {
  const copy = { ...bookmark };
  delete copy[SUBSCRIPTION_KEY];
  return copy;
}

function hasSubscription(bookmark) {
  return Boolean(bookmark[SUBSCRIPTION_KEY]);
}

function getSubscription(bookmark) {
  return bookmark[SUBSCRIPTION_KEY] || null;
}

function isActive(bookmark) {
  const sub = getSubscription(bookmark);
  return sub ? sub.active === true : false;
}

function pauseSubscription(bookmark) {
  if (!hasSubscription(bookmark)) return bookmark;
  return { ...bookmark, [SUBSCRIPTION_KEY]: { ...bookmark[SUBSCRIPTION_KEY], active: false } };
}

function resumeSubscription(bookmark) {
  if (!hasSubscription(bookmark)) return bookmark;
  return { ...bookmark, [SUBSCRIPTION_KEY]: { ...bookmark[SUBSCRIPTION_KEY], active: true } };
}

function filterSubscribed(bookmarks) {
  return bookmarks.filter(hasSubscription);
}

function filterActive(bookmarks) {
  return bookmarks.filter(isActive);
}

function filterByFrequency(bookmarks, frequency) {
  return bookmarks.filter(b => {
    const sub = getSubscription(b);
    return sub && sub.frequency === frequency;
  });
}

module.exports = {
  setSubscription,
  clearSubscription,
  hasSubscription,
  getSubscription,
  isActive,
  pauseSubscription,
  resumeSubscription,
  filterSubscribed,
  filterActive,
  filterByFrequency,
};
