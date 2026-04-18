const { report } = require('./reporter');

const bookmarks = [
  { url: 'https://github.com/a', title: 'A', tags: ['code'] },
  { url: 'https://github.com/b', title: 'B', tags: [] },
  { url: 'https://mozilla.org', title: 'Mozilla', tags: ['web', 'code'] },
];

function makeStream() {
  const chunks = [];
  return {
    write(chunk) { chunks.push(chunk); },
    get output() { return chunks.join(''); },
  };
}

describe('report', () => {
  test('writes human-readable stats to stream', () => {
    const stream = makeStream();
    report(bookmarks, { stream });
    expect(stream.output).toContain('Total bookmarks');
    expect(stream.output).toContain('github.com');
  });

  test('writes JSON when json option is true', () => {
    const stream = makeStream();
    report(bookmarks, { stream, json: true });
    const parsed = JSON.parse(stream.output);
    expect(parsed.total).toBe(3);
    expect(Array.isArray(parsed.topDomains)).toBe(true);
  });

  test('returns the stats object', () => {
    const stream = makeStream();
    const stats = report(bookmarks, { stream });
    expect(stats.total).toBe(3);
    expect(stats.uniqueDomains).toBe(2);
  });

  test('handles empty bookmarks', () => {
    const stream = makeStream();
    const stats = report([], { stream });
    expect(stats.total).toBe(0);
    expect(stream.output).toContain('0');
  });

  test('topDomains are sorted by count descending', () => {
    const stream = makeStream();
    const stats = report(bookmarks, { stream });
    const counts = stats.topDomains.map(d => d.count);
    for (let i = 1; i < counts.length; i++) {
      expect(counts[i - 1]).toBeGreaterThanOrEqual(counts[i]);
    }
  });
});
