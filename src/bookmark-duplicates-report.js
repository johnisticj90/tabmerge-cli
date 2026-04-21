/**
 * bookmark-duplicates-report.js
 * Generates a detailed report of duplicate bookmarks with grouping and stats.
 */

'use strict';

const { findDuplicates } = require('./duplicates');

/**
 * Groups duplicates by their normalized URL key.
 * Returns an array of groups, each with a key and list of bookmarks.
 */
function groupDuplicates(bookmarks) {
  const seen = new Map();
  for (const bm of bookmarks) {
    const key = bm.url.toLowerCase().replace(/\/+$/, '');
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key).push(bm);
  }
  return Array.from(seen.entries())
    .filter(([, group]) => group.length > 1)
    .map(([key, group]) => ({ key, bookmarks: group }));
}

/**
 * Returns summary counts for the report.
 */
function summarize(bookmarks, groups) {
  const duplicateCount = groups.reduce((sum, g) => sum + g.bookmarks.length - 1, 0);
  return {
    total: bookmarks.length,
    unique: bookmarks.length - duplicateCount,
    duplicates: duplicateCount,
    groups: groups.length,
  };
}

/**
 * Formats the report as a plain-text string.
 */
function formatReport(groups, summary) {
  const lines = [];
  lines.push(`Duplicate Bookmark Report`);
  lines.push(`=========================`);
  lines.push(`Total bookmarks : ${summary.total}`);
  lines.push(`Unique          : ${summary.unique}`);
  lines.push(`Duplicates      : ${summary.duplicates}`);
  lines.push(`Duplicate groups: ${summary.groups}`);
  lines.push('');

  for (const group of groups) {
    lines.push(`URL: ${group.key}`);
    for (const bm of group.bookmarks) {
      const date = bm.addDate ? new Date(bm.addDate * 1000).toISOString().slice(0, 10) : 'unknown';
      lines.push(`  - [${date}] ${bm.title || '(no title)'}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Main entry: produce a full duplicates report object.
 */
function generateReport(bookmarks) {
  const groups = groupDuplicates(bookmarks);
  const summary = summarize(bookmarks, groups);
  const text = formatReport(groups, summary);
  return { summary, groups, text };
}

module.exports = { groupDuplicates, summarize, formatReport, generateReport };
