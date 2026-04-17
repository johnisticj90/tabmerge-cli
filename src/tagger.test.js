const { inferTags, applyTags } = require('./tagger');

const make = (url, title = '', tags = []) => ({ url, title, tags });

describe('inferTags', () => {
  test('tags github urls as dev', () => {
    const b = make('https://github.com/user/repo');
    expect(inferTags(b)).toContain('dev');
  });

  test('tags youtube as video', () => {
    const b = make('https://www.youtube.com/watch?v=abc');
    expect(inferTags(b)).toContain('video');
  });

  test('tags tutorial titles', () => {
    const b = make('https://example.com', 'How to use Node.js - A Guide');
    expect(inferTags(b)).toContain('tutorial');
  });

  test('tags wikipedia as reference', () => {
    const b = make('https://en.wikipedia.org/wiki/Foo');
    expect(inferTags(b)).toContain('reference');
  });

  test('preserves existing tags', () => {
    const b = make('https://example.com', '', ['mytag']);
    expect(inferTags(b)).toContain('mytag');
  });

  test('returns unique tags', () => {
    const b = make('https://youtube.com', 'Watch this video', ['video']);
    const tags = inferTags(b);
    expect(tags.filter(t => t === 'video').length).toBe(1);
  });
});

describe('applyTags', () => {
  test('adds inferred tags to all bookmarks', () => {
    const bookmarks = [
      make('https://github.com/x/y', 'some repo'),
      make('https://reddit.com/r/js', 'js subreddit'),
    ];
    const result = applyTags(bookmarks);
    expect(result[0].tags).toContain('dev');
    expect(result[1].tags).toContain('social');
  });

  test('merges with existing tags by default', () => {
    const bookmarks = [make('https://github.com/x', 'repo', ['favorite'])];
    const result = applyTags(bookmarks);
    expect(result[0].tags).toContain('favorite');
    expect(result[0].tags).toContain('dev');
  });

  test('overwrite mode drops existing tags', () => {
    const bookmarks = [make('https://github.com/x', 'repo', ['favorite'])];
    const result = applyTags(bookmarks, { overwrite: true });
    expect(result[0].tags).not.toContain('favorite');
    expect(result[0].tags).toContain('dev');
  });

  test('does not mutate original bookmarks', () => {
    const bookmarks = [make('https://github.com/x', 'repo', ['a'])];
    applyTags(bookmarks);
    expect(bookmarks[0].tags).toEqual(['a']);
  });
});
