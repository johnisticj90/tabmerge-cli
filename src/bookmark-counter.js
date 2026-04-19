// bookmark-counter.js — count bookmarks by various dimensions

'use strict';

function countByDomain(bookmarks) {
  const counts = {};
  for (const b of bookmarks) {
    try {
      const host = new URL(b.url).hostname.replace(/^www\./, '');
      counts[host] = (counts[host] || 0) + 1;
    } catch {
      counts['invalid'] = (counts['invalid'] || 0) + 1;
    }
  }
  return counts;
}

function countByTag(bookmarks) {
  const counts = {};
  for (const b of bookmarks) {
    const tags = Array.isArray(b.tags) ? b.tags : [];
    if (tags.length === 0) {
      counts['untagged'] = (counts['untagged'] || 0) + 1;
    } else {
      for (const tag of tags) {
        counts[tag] = (counts[tag] || 0) + 1;
      }
    }
  }
  return counts;
}

function countByYear(bookmarks) {
  const counts = {};
  for (const b of bookmarks) {
    if (!b.addDate) {
      counts['unknown'] = (counts['unknown'] || 0) + 1;
      continue;
    }
    const year = new Date(typeof b.addDate === 'number' ? b.addDate * 1000 : b.addDate)
      .getFullYear();
    const key = isNaN(year) ? 'unknown' : String(year);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function topN(counts, n = 10) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key, count]) => ({ key, count }));
}

function count(bookmarks, dimension = 'domain', n = 10) {
  const fns = { domain: countByDomain, tag: countByTag, year: countByYear };
  const fn = fns[dimension];
  if (!fn) throw new Error(`Unknown dimension: ${dimension}`);
  return topN(fn(bookmarks), n);
}

module.exports = { countByDomain, countByTag, countByYear, topN, count };
