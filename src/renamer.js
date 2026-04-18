/**
 * renamer.js — utilities for cleaning and renaming bookmark titles
 */

'use strict';

/**
 * Trim whitespace and collapse internal whitespace in a title.
 * @param {string} title
 * @returns {string}
 */
function normalizeTitle(title) {
  if (typeof title !== 'string') return '';
  return title.trim().replace(/\s+/g, ' ');
}

/**
 * Capitalize the first letter of a title.
 * @param {string} title
 * @returns {string}
 */
function capitalizeTitle(title) {
  const t = normalizeTitle(title);
  if (!t) return t;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/**
 * Strip common URL-derived noise from a title (e.g. " - SiteName").
 * Removes trailing " - Something" or " | Something" patterns.
 * @param {string} title
 * @returns {string}
 */
function stripSuffix(title) {
  const t = normalizeTitle(title);
  return t.replace(/\s[\-|]\s[^\-|]+$/, '').trim();
}

/**
 * Rename a single bookmark's title using a transform function.
 * @param {object} bookmark
 * @param {function} fn
 * @returns {object}
 */
function renameOne(bookmark, fn) {
  return { ...bookmark, title: fn(bookmark.title || '') };
}

/**
 * Apply a rename transform to all bookmarks.
 * @param {object[]} bookmarks
 * @param {function} fn
 * @returns {object[]}
 */
function renameAll(bookmarks, fn) {
  return bookmarks.map(b => renameOne(b, fn));
}

/**
 * Built-in rename strategies.
 */
const strategies = {
  normalize: normalizeTitle,
  capitalize: capitalizeTitle,
  stripSuffix: stripSuffix,
};

/**
 * Apply a named strategy to all bookmarks.
 * @param {object[]} bookmarks
 * @param {string} strategy
 * @returns {object[]}
 */
function rename(bookmarks, strategy) {
  const fn = strategies[strategy];
  if (!fn) throw new Error(`Unknown rename strategy: ${strategy}`);
  return renameAll(bookmarks, fn);
}

module.exports = { normalizeTitle, capitalizeTitle, stripSuffix, renameOne, renameAll, rename };
