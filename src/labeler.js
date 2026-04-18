// Assign labels (folders/categories) to bookmarks based on URL patterns

const DEFAULT_RULES = [
  { pattern: /github\.com/i, label: 'Development' },
  { pattern: /stackoverflow\.com|stackexchange\.com/i, label: 'Development' },
  { pattern: /reddit\.com/i, label: 'Social' },
  { pattern: /twitter\.com|x\.com/i, label: 'Social' },
  { pattern: /youtube\.com|vimeo\.com/i, label: 'Video' },
  { pattern: /medium\.com|dev\.to|substack\.com/i, label: 'Articles' },
  { pattern: /wikipedia\.org/i, label: 'Reference' },
  { pattern: /npmjs\.com|pypi\.org/i, label: 'Packages' },
  { pattern: /docs\.|documentation/i, label: 'Docs' },
];

function inferLabel(bookmark, rules = DEFAULT_RULES) {
  const url = bookmark.url || '';
  const title = bookmark.title || '';
  for (const rule of rules) {
    if (rule.pattern.test(url) || rule.pattern.test(title)) {
      return rule.label;
    }
  }
  return 'Uncategorized';
}

function labelOne(bookmark, rules = DEFAULT_RULES) {
  const label = inferLabel(bookmark, rules);
  return { ...bookmark, label };
}

function labelAll(bookmarks, rules = DEFAULT_RULES) {
  return bookmarks.map(b => labelOne(b, rules));
}

function groupByLabel(bookmarks) {
  const groups = {};
  for (const b of bookmarks) {
    const key = b.label || 'Uncategorized';
    if (!groups[key]) groups[key] = [];
    groups[key].push(b);
  }
  return groups;
}

module.exports = { inferLabel, labelOne, labelAll, groupByLabel, DEFAULT_RULES };
