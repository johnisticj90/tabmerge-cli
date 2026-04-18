// duplicates.js — find and report duplicate bookmarks without removing them
'use strict';

const { normalizeUrl } = require('./deduplicator');

/**
 * Group bookmarks by normalized URL, returning only groups with duplicates.
 * @param {Array} bookmarks
 * @returns {Map<string, Array>} map of normalizedUrl -> [bookmark, ...]
 */
function findDuplicates(bookmarks) {
  const map = new Map();
  for (const bm of bookmarks) {
    const key = normalizeUrl(bm.url);
    if (!key) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(bm);
  }
  // keep only entries with more than one bookmark
  for (const [key, group] of map) {
    if (group.length < 2) map.delete(key);
  }
  return map;
}

/**
 * Return a flat summary array of duplicate groups.
 * @param {Map} duplicateMap
 * @returns {Array<{url: string, count: number, bookmarks: Array}>}
 */
function summarizeDuplicates(duplicateMap) {
  const result = [];
  for (const [url, bookmarks] of duplicateMap) {
    result.push({ url, count: bookmarks.length, bookmarks });
  }
  return result.sort((a, b) => b.count - a.count);
}

/**
 * Format duplicate summary as human-readable text.
 * @param {Array} summary
 * @returns {string}
 */
function formatDuplicates(summary) {
  if (summary.length === 0) return 'No duplicates found.\n';
  const lines = [`Found ${summary.length} duplicate URL(s):\n`];
  for (const { url, count, bookmarks } of summary) {
    lines.push(`  [${count}x] ${url}`);
    for (const bm of bookmarks) {
      const title = bm.title || '(no title)';
      const date = bm.addDate ? ` (${new Date(bm.addDate * 1000).toISOString().slice(0, 10)})` : '';
      lines.push(`       - ${title}${date}`);
    }
  }
  return lines.join('\n') + '\n';
}

module.exports = { findDuplicates, summarizeDuplicates, formatDuplicates };
