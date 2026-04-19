const {
  isRead, isUnread, markRead, markUnread,
  markAllRead, markAllUnread, filterRead, filterUnread, summarizeStatus,
} = require('./bookmark-status');

const b = (url, status) => ({ url, title: url, status });

describe('isRead / isUnread', () => {
  test('isRead returns true for read bookmarks', () => {
    expect(isRead(b('http://a.com', 'read'))).toBe(true);
  });
  test('isUnread returns true when status is not read', () => {
    expect(isUnread(b('http://a.com', 'unread'))).toBe(true);
    expect(isUnread(b('http://a.com', undefined))).toBe(true);
  });
});

describe('markRead / markUnread', () => {
  test('markRead sets status to read and adds readAt', () => {
    const result = markRead(b('http://a.com', 'unread'));
    expect(result.status).toBe('read');
    expect(result.readAt).toBeDefined();
  });
  test('markRead preserves existing readAt', () => {
    const bk = { url: 'http://a.com', status: 'unread', readAt: '2024-01-01' };
    expect(markRead(bk).readAt).toBe('2024-01-01');
  });
  test('markUnread removes readAt', () => {
    const bk = { url: 'http://a.com', status: 'read', readAt: '2024-01-01' };
    const result = markUnread(bk);
    expect(result.status).toBe('unread');
    expect(result.readAt).toBeUndefined();
  });
});

describe('markAllRead / markAllUnread', () => {
  test('marks all bookmarks read', () => {
    const list = [b('http://a.com', 'unread'), b('http://b.com', 'unread')];
    expect(markAllRead(list).every(x => x.status === 'read')).toBe(true);
  });
  test('marks all bookmarks unread', () => {
    const list = [b('http://a.com', 'read'), b('http://b.com', 'read')];
    expect(markAllUnread(list).every(x => x.status === 'unread')).toBe(true);
  });
});

describe('filterRead / filterUnread', () => {
  const list = [b('http://a.com', 'read'), b('http://b.com', 'unread'), b('http://c.com', 'read')];
  test('filterRead returns only read', () => {
    expect(filterRead(list)).toHaveLength(2);
  });
  test('filterUnread returns only unread', () => {
    expect(filterUnread(list)).toHaveLength(1);
  });
});

describe('summarizeStatus', () => {
  test('returns correct counts', () => {
    const list = [b('http://a.com', 'read'), b('http://b.com', 'unread'), b('http://c.com', 'read')];
    expect(summarizeStatus(list)).toEqual({ total: 3, read: 2, unread: 1 });
  });
});
