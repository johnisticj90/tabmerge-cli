const { parseCsv, parseCsvLine } = require('./csv');

describe('parseCsvLine', () => {
  test('splits simple line', () => {
    expect(parseCsvLine('a,b,c')).toEqual(['a', 'b', 'c']);
  });

  test('handles quoted fields with commas', () => {
    expect(parseCsvLine('"hello, world",foo,bar')).toEqual(['hello, world', 'foo', 'bar']);
  });

  test('handles escaped quotes', () => {
    expect(parseCsvLine('"say ""hi""",ok')).toEqual(['say "hi"', 'ok']);
  });

  test('handles empty fields', () => {
    expect(parseCsvLine('a,,c')).toEqual(['a', '', 'c']);
  });

  test('handles single field', () => {
    expect(parseCsvLine('hello')).toEqual(['hello']);
  });
});

describe('parseCsv', () => {
  const basic = `url,title,tags,description\nhttps://example.com,Example,news;tech,A site\nhttps://foo.io,Foo,,`;

  test('parses basic csv', () => {
    const result = parseCsv(basic);
    expect(result).toHaveLength(2);
    expect(result[0].url).toBe('https://example.com');
    expect(result[0].title).toBe('Example');
    expect(result[0].tags).toEqual(['news', 'tech']);
    expect(result[0].description).toBe('A site');
  });

  test('second entry has empty tags', () => {
    const result = parseCsv(basic);
    expect(result[1].tags).toEqual([]);
  });

  test('throws if no url column', () => {
    expect(() => parseCsv('title,tags\nFoo,bar')).toThrow('CSV missing url column');
  });

  test('skips empty lines', () => {
    const content = `url,title\nhttps://a.com,A\n\nhttps://b.com,B`;
    expect(parseCsv(content)).toHaveLength(2);
  });

  test('accepts alternative column names', () => {
    const content = `href,name\nhttps://x.com,X`;
    const result = parseCsv(content);
    expect(result[0].url).toBe('https://x.com');
    expect(result[0].title).toBe('X');
  });

  test('parses pipe-separated tags', () => {
    const content = `url,tags\nhttps://x.com,foo|bar|baz`;
    const result = parseCsv(content);
    expect(result[0].tags).toEqual(['foo', 'bar', 'baz']);
  });

  test('returns empty array for header-only csv', () => {
    expect(parseCsv('url,title')).toEqual([]);
  });

  test('throws on empty string input', () => {
    expect(() => parseCsv('')).toThrow();
  });
});
