const {
  DEFAULT_RULES,
  createRule,
  applyRules,
  scoreWithRules,
  topByRules,
} = require('./bookmark-scoring-rules');

const base = { url: 'https://example.com', title: 'Example' };

describe('createRule', () => {
  it('creates a valid rule', () => {
    const r = createRule('test-rule', 5, () => true);
    expect(r.name).toBe('test-rule');
    expect(r.points).toBe(5);
    expect(r.test({})).toBe(true);
  });

  it('throws on missing name', () => {
    expect(() => createRule('', 5, () => true)).toThrow('name required');
  });

  it('throws on non-function test', () => {
    expect(() => createRule('r', 5, 'bad')).toThrow('function');
  });
});

describe('applyRules', () => {
  it('returns zero score for empty bookmark', () => {
    const { score } = applyRules({ url: 'https://x.com' });
    expect(score).toBe(5); // has no title points only from has-title if title missing
  });

  it('awards points for matching rules', () => {
    const bm = { ...base, tags: ['js'], favorite: true };
    const { score, matched } = applyRules(bm);
    expect(matched).toContain('has-title');
    expect(matched).toContain('has-tags');
    expect(matched).toContain('is-favorite');
    expect(score).toBeGreaterThan(10);
  });

  it('uses custom rules when provided', () => {
    const rules = [createRule('always', 99, () => true)];
    const { score, matched } = applyRules(base, rules);
    expect(score).toBe(99);
    expect(matched).toEqual(['always']);
  });
});

describe('scoreWithRules', () => {
  it('attaches ruleScore and matchedRules to each bookmark', () => {
    const bms = [base, { ...base, tags: ['a'] }];
    const result = scoreWithRules(bms);
    expect(result[0]).toHaveProperty('ruleScore');
    expect(result[0]).toHaveProperty('matchedRules');
    expect(result[1].ruleScore).toBeGreaterThan(result[0].ruleScore);
  });
});

describe('topByRules', () => {
  it('returns top n bookmarks by rule score', () => {
    const bms = [
      { url: 'https://a.com', title: 'A' },
      { url: 'https://b.com', title: 'B', tags: ['x'], favorite: true },
      { url: 'https://c.com', title: 'C', pinned: true },
    ];
    const top = topByRules(bms, 2);
    expect(top).toHaveLength(2);
    expect(top[0].url).toBe('https://b.com');
  });

  it('returns all if n exceeds length', () => {
    const result = topByRules([base], 10);
    expect(result).toHaveLength(1);
  });
});
