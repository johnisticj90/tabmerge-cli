/**
 * Transformer: apply a pipeline of transformations to bookmarks.
 */

'use strict';

const { filterByDomain, filterByTag, filterByDateAfter, filterByQuery } = require('./filter');
const { sort } = require('./sorter');
const { deduplicate } = require('./deduplicator');

/**
 * Build a transformation pipeline from options.
 * @param {object} opts
 * @returns {Function} transform(bookmarks) => bookmarks
 */
function buildPipeline(opts = {}) {
  const steps = [];

  if (opts.dedup !== false) {
    steps.push(bs => deduplicate(bs));
  }
  if (opts.domain) {
    steps.push(bs => filterByDomain(bs, opts.domain));
  }
  if (opts.tag) {
    steps.push(bs => filterByTag(bs, opts.tag));
  }
  if (opts.after) {
    steps.push(bs => filterByDateAfter(bs, opts.after));
  }
  if (opts.query) {
    steps.push(bs => filterByQuery(bs, opts.query));
  }
  if (opts.sort) {
    steps.push(bs => sort(bs, opts.sort, opts.sortDir));
  }

  return function transform(bookmarks) {
    return steps.reduce((acc, fn) => fn(acc), bookmarks);
  };
}

/**
 * Apply transformation pipeline directly.
 * @param {Array} bookmarks
 * @param {object} opts
 * @returns {Array}
 */
function transform(bookmarks, opts = {}) {
  return buildPipeline(opts)(bookmarks);
}

module.exports = { buildPipeline, transform };
