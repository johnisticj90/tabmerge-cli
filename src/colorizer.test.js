const { isColorSupported, colorize, colorizeBookmark, colorizeStats } = require('./colorizer');

beforeEach(() => {
  delete process.env.NO_COLOR;
  // force color off in tests
  process.env.NO_COLOR = '1';
});

test('colorize returns plain text when color disabled', () => {
  expect(colorize('hello', 'red')).toBe('hello');
});

test('colorize applies codes when color enabled', () => {
  delete process.env.NO_COLOR;
  const original = process.stdout.isTTY;
  Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true });
  const result = colorize('hi', 'green');
  expect(result).toContain('hi');
  expect(result).toContain('\x1b[32m');
  Object.defineProperty(process.stdout, 'isTTY', { value: original, configurable: true });
});

test('colorizeBookmark includes title and url', () => {
  const bm = { title: 'Example', url: 'https://example.com', tags: ['news'] };
  const out = colorizeBookmark(bm);
  expect(out).toContain('Example');
  expect(out).toContain('https://example.com');
  expect(out).toContain('#news');
});

test('colorizeBookmark handles missing title', () => {
  const bm = { url: 'https://example.com', tags: [] };
  const out = colorizeBookmark(bm);
  expect(out).toContain('(no title)');
});

test('colorizeStats shows total and unique', () => {
  const out = colorizeStats({ total: 10, unique: 8, duplicates: 2, invalid: 0 });
  expect(out).toContain('Total: 10');
  expect(out).toContain('Unique: 8');
  expect(out).toContain('Duplicates removed: 2');
  expect(out).not.toContain('Invalid');
});

test('colorizeStats shows invalid when nonzero', () => {
  const out = colorizeStats({ total: 5, unique: 3, duplicates: 1, invalid: 1 });
  expect(out).toContain('Invalid skipped: 1');
});
