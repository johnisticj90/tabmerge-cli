const fs = require('fs');
const os = require('os');
const path = require('path');
const { get, set, clear, CACHE_FILE } = require('./cache');

const tmpFile = path.join(os.tmpdir(), `tabmerge-test-${Date.now()}.html`);

beforeAll(() => {
  fs.writeFileSync(tmpFile, '<html>test</html>', 'utf8');
});

afterAll(() => {
  try { fs.unlinkSync(tmpFile); } catch {}
  clear();
});

beforeEach(() => {
  clear();
});

describe('cache', () => {
  test('returns null for unknown file', () => {
    expect(get('/nonexistent/file.html')).toBeNull();
  });

  test('returns null when cache is empty', () => {
    expect(get(tmpFile)).toBeNull();
  });

  test('stores and retrieves bookmarks', () => {
    const bookmarks = [{ url: 'https://example.com', title: 'Example' }];
    set(tmpFile, bookmarks);
    const result = get(tmpFile);
    expect(result).toEqual(bookmarks);
  });

  test('returns null after clear', () => {
    const bookmarks = [{ url: 'https://example.com', title: 'Example' }];
    set(tmpFile, bookmarks);
    clear();
    expect(get(tmpFile)).toBeNull();
  });

  test('handles multiple files independently', () => {
    const tmp2 = path.join(os.tmpdir(), `tabmerge-test2-${Date.now()}.html`);
    fs.writeFileSync(tmp2, '<html>b</html>', 'utf8');
    const a = [{ url: 'https://a.com', title: 'A' }];
    const b = [{ url: 'https://b.com', title: 'B' }];
    set(tmpFile, a);
    set(tmp2, b);
    expect(get(tmpFile)).toEqual(a);
    expect(get(tmp2)).toEqual(b);
    try { fs.unlinkSync(tmp2); } catch {}
  });

  test('cache file is written to disk', () => {
    set(tmpFile, [{ url: 'https://x.com', title: 'X' }]);
    expect(fs.existsSync(CACHE_FILE)).toBe(true);
  });
});
