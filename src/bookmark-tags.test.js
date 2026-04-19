const { addTag, removeTag, hasTag, renameTags, mergeTags, listAllTags, countByTag } = require('./bookmark-tags');

const b = (tags) => ({ url: 'https://example.com', title: 'Ex', tags });

describe('addTag', () => {
  it('adds a new tag', () => {
    expect(addTag(b(['a']), 'b').tags).toEqual(['a', 'b']);
  });
  it('does not duplicate', () => {
    expect(addTag(b(['a']), 'a').tags).toEqual(['a']);
  });
  it('handles missing tags', () => {
    expect(addTag({ url: 'x' }, 'a').tags).toEqual(['a']);
  });
});

describe('removeTag', () => {
  it('removes existing tag', () => {
    expect(removeTag(b(['a', 'b']), 'a').tags).toEqual(['b']);
  });
  it('no-op if tag absent', () => {
    expect(removeTag(b(['a']), 'z').tags).toEqual(['a']);
  });
});

describe('hasTag', () => {
  it('returns true when present', () => expect(hasTag(b(['x']), 'x')).toBe(true));
  it('returns false when absent', () => expect(hasTag(b(['x']), 'y')).toBe(false));
});

describe('renameTags', () => {
  it('renames across bookmarks', () => {
    const result = renameTags([b(['old', 'keep']), b(['other'])], 'old', 'new');
    expect(result[0].tags).toEqual(['new', 'keep']);
    expect(result[1].tags).toEqual(['other']);
  });
});

describe('mergeTags', () => {
  it('merges multiple tags into one', () => {
    const result = mergeTags([b(['js', 'javascript'])], ['js', 'javascript'], 'javascript');
    expect(result[0].tags).toEqual(['javascript']);
  });
});

describe('listAllTags', () => {
  it('returns sorted unique tags', () => {
    expect(listAllTags([b(['b', 'a']), b(['a', 'c'])])).toEqual(['a', 'b', 'c']);
  });
});

describe('countByTag', () => {
  it('counts occurrences', () => {
    const counts = countByTag([b(['a', 'b']), b(['a'])]);
    expect(counts).toEqual({ a: 2, b: 1 });
  });
});
