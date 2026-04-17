const { applyTags } = require('./tagger');
const { deduplicate } = require('./deduplicator');
const { merge } = require('./merger');

describe('tagger integration', () => {
  const setA = [
    { url: 'https://github.com/foo/bar', title: 'foo/bar', tags: [], addedAt: null },
    { url: 'https://www.youtube.com/watch?v=1', title: 'Cool video', tags: [], addedAt: null },
  ];

  const setB = [
    { url: 'https://stackoverflow.com/q/123', title: 'How to do X', tags: [], addedAt: null },
    { url: 'https://github.com/foo/bar', title: 'foo/bar mirror', tags: ['oss'], addedAt: null },
  ];

  test('merge then tag pipeline produces expected tags', () => {
    const merged = merge([setA, setB]);
    const deduped = deduplicate(merged);
    const tagged = applyTags(deduped);

    const gh = tagged.find(b => b.url.includes('github'));
    expect(gh).toBeDefined();
    expect(gh.tags).toContain('dev');

    const yt = tagged.find(b => b.url.includes('youtube'));
    expect(yt.tags).toContain('video');

    const so = tagged.find(b => b.url.includes('stackoverflow'));
    expect(so.tags).toContain('dev');
    expect(so.tags).toContain('tutorial');
  });

  test('overwrite mode still infers correctly after merge', () => {
    const merged = merge([setA, setB]);
    const tagged = applyTags(merged, { overwrite: true });
    tagged.forEach(b => {
      expect(Array.isArray(b.tags)).toBe(true);
    });
    const gh = tagged.find(b => b.url.includes('github'));
    expect(gh.tags).not.toContain('oss');
  });
});
