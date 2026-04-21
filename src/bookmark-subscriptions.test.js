const {
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
} = require('./bookmark-subscriptions');

const base = { url: 'https://example.com', title: 'Example' };
const sub = { url: 'https://feeds.example.com/rss', label: 'Example Feed', frequency: 'daily' };

test('setSubscription attaches subscription with defaults', () => {
  const b = setSubscription(base, sub);
  expect(b.subscription.url).toBe(sub.url);
  expect(b.subscription.active).toBe(true);
  expect(b.subscription.frequency).toBe('daily');
  expect(b.subscription.subscribedAt).toBeTruthy();
});

test('setSubscription defaults frequency to weekly', () => {
  const b = setSubscription(base, { url: 'https://feeds.example.com/rss' });
  expect(b.subscription.frequency).toBe('weekly');
});

test('setSubscription throws without url', () => {
  expect(() => setSubscription(base, { label: 'no url' })).toThrow();
});

test('hasSubscription returns true when set', () => {
  const b = setSubscription(base, sub);
  expect(hasSubscription(b)).toBe(true);
});

test('hasSubscription returns false when not set', () => {
  expect(hasSubscription(base)).toBe(false);
});

test('clearSubscription removes subscription', () => {
  const b = clearSubscription(setSubscription(base, sub));
  expect(hasSubscription(b)).toBe(false);
});

test('getSubscription returns null when missing', () => {
  expect(getSubscription(base)).toBeNull();
});

test('isActive returns true for active subscription', () => {
  expect(isActive(setSubscription(base, sub))).toBe(true);
});

test('pauseSubscription sets active to false', () => {
  const b = pauseSubscription(setSubscription(base, sub));
  expect(b.subscription.active).toBe(false);
});

test('resumeSubscription sets active to true', () => {
  const paused = pauseSubscription(setSubscription(base, sub));
  const resumed = resumeSubscription(paused);
  expect(resumed.subscription.active).toBe(true);
});

test('filterSubscribed returns only bookmarks with subscriptions', () => {
  const a = setSubscription(base, sub);
  const result = filterSubscribed([base, a]);
  expect(result).toHaveLength(1);
  expect(result[0].subscription.url).toBe(sub.url);
});

test('filterActive returns only active subscriptions', () => {
  const a = setSubscription(base, sub);
  const b = pauseSubscription(setSubscription({ ...base, url: 'https://b.com' }, sub));
  expect(filterActive([a, b])).toHaveLength(1);
});

test('filterByFrequency filters by frequency', () => {
  const daily = setSubscription(base, { url: 'https://a.com/rss', frequency: 'daily' });
  const weekly = setSubscription({ ...base, url: 'https://b.com' }, { url: 'https://b.com/rss', frequency: 'weekly' });
  expect(filterByFrequency([daily, weekly], 'daily')).toHaveLength(1);
});
