const { parseJson } = require('./json');

const sampleExport = JSON.stringify({
  roots: {
    bookmark_bar: {
      children: [
        {
          type: 'url',
          name: 'GitHub',
          url: 'https://github.com',
          date_added: '13000000000000000',
        },
        {
          type: 'folder',
          name: 'Dev',
          children: [
            {
              type: 'url',
              name: 'MDN',
              url: 'https://developer.mozilla.org',
              date_added: '13100000000000000',
            },
          ],
        },
      ],
    },
    other: {
      children: [
        {
          type: 'url',
          name: 'Example',
          url: 'https://example.com',
          date_added: null,
        },
      ],
    },
  },
});

test('parses top-level bookmarks', () => {
  const results = parseJson(sampleExport);
  const github = results.find((b) => b.url === 'https://github.com');
  expect(github).toBeDefined();
  expect(github.title).toBe('GitHub');
});

test('parses nested bookmarks in folders', () => {
  const results = parseJson(sampleExport);
  const mdn = results.find((b) => b.url === 'https://developer.mozilla.org');
  expect(mdn).toBeDefined();
  expect(mdn.title).toBe('MDN');
});

test('parses bookmarks from multiple roots', () => {
  const results = parseJson(sampleExport);
  expect(results).toHaveLength(3);
});

test('handles missing date_added gracefully', () => {
  const results = parseJson(sampleExport);
  const example = results.find((b) => b.url === 'https://example.com');
  expect(example.addDate).toBeNull();
});

test('throws on invalid JSON', () => {
  expect(() => parseJson('not json')).toThrow('Invalid JSON bookmark file');
});

test('throws on unrecognized format', () => {
  expect(() => parseJson(JSON.stringify({ foo: 'bar' }))).toThrow('Unrecognized JSON bookmark format');
});
