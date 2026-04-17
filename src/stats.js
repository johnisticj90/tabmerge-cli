/**
 * Generates statistics about a collection of bookmarks.
 */

/**
 * @param {Array} bookmarks
 * @returns {Object}
 */
function computeStats(bookmarks) {
  const total = bookmarks.length;

  const domainCounts = {};
  for (const b of bookmarks) {
    try {
      const url = new URL(b.url);
      const domain = url.hostname.replace(/^www\./, '');
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    } catch {
      // skip invalid urls
    }
  }

  const topDomains = Object.entries(domainCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([domain, count]) => ({ domain, count }));

  const withTags = bookmarks.filter(b => b.tags && b.tags.length > 0).length;
  const withTitle = bookmarks.filter(b => b.title && b.title.trim()).length;

  const tagCounts = {};
  for (const b of bookmarks) {
    for (const tag of (b.tags || [])) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  return {
    total,
    withTags,
    withTitle,
    uniqueDomains: Object.keys(domainCounts).length,
    topDomains,
    topTags,
  };
}

/**
 * Formats stats as a human-readable string.
 * @param {Object} stats
 * @returns {string}
 */
function formatStats(stats) {
  const lines = [
    `Total bookmarks : ${stats.total}`,
    `Unique domains  : ${stats.uniqueDomains}`,
    `With title      : ${stats.withTitle}`,
    `With tags       : ${stats.withTags}`,
  ];

  if (stats.topDomains.length) {
    lines.push('\nTop domains:');
    for (const { domain, count } of stats.topDomains) {
      lines.push(`  ${domain.padEnd(40)} ${count}`);
    }
  }

  if (stats.topTags.length) {
    lines.push('\nTop tags:');
    for (const { tag, count } of stats.topTags) {
      lines.push(`  ${tag.padEnd(40)} ${count}`);
    }
  }

  return lines.join('\n');
}

module.exports = { computeStats, formatStats };
