/**
 * bookmark-scoring-rules.js
 * Define and apply custom scoring rules to bookmarks.
 */

const DEFAULT_RULES = [
  { name: 'has-title', points: 5, test: b => typeof b.title === 'string' && b.title.trim().length > 0 },
  { name: 'has-tags', points: 10, test: b => Array.isArray(b.tags) && b.tags.length > 0 },
  { name: 'has-description', points: 8, test: b => typeof b.description === 'string' && b.description.trim().length > 0 },
  { name: 'is-favorite', points: 15, test: b => b.favorite === true },
  { name: 'is-pinned', points: 12, test: b => b.pinned === true },
  { name: 'has-note', points: 6, test: b => typeof b.note === 'string' && b.note.trim().length > 0 },
  { name: 'recent', points: 10, test: b => {
    if (!b.addedAt) return false;
    const age = Date.now() - new Date(b.addedAt).getTime();
    return age < 30 * 24 * 60 * 60 * 1000; // 30 days
  }},
];

function createRule(name, points, test) {
  if (typeof name !== 'string' || !name) throw new Error('Rule name required');
  if (typeof points !== 'number') throw new Error('Rule points must be a number');
  if (typeof test !== 'function') throw new Error('Rule test must be a function');
  return { name, points, test };
}

function applyRules(bookmark, rules = DEFAULT_RULES) {
  let score = 0;
  const matched = [];
  for (const rule of rules) {
    if (rule.test(bookmark)) {
      score += rule.points;
      matched.push(rule.name);
    }
  }
  return { score, matched };
}

function scoreWithRules(bookmarks, rules = DEFAULT_RULES) {
  return bookmarks.map(b => ({
    ...b,
    ruleScore: applyRules(b, rules).score,
    matchedRules: applyRules(b, rules).matched,
  }));
}

function topByRules(bookmarks, n = 10, rules = DEFAULT_RULES) {
  return scoreWithRules(bookmarks, rules)
    .sort((a, b) => b.ruleScore - a.ruleScore)
    .slice(0, n);
}

module.exports = { DEFAULT_RULES, createRule, applyRules, scoreWithRules, topByRules };
