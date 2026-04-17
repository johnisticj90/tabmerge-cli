/**
 * High-level pipeline: parse inputs -> merge -> transform -> format.
 */

'use strict';

const { parse } = require('./parsers/index');
const { merge } = require('./merger');
const { transform } = require('./transformer');
const { formatNetscape, formatJson, formatCsv } = require('./formatter');

const FORMATTERS = {
  netscape: formatNetscape,
  json: formatJson,
  csv: formatCsv,
};

/**
 * Run the full pipeline.
 * @param {Array<{content: string, path: string}>} inputs  raw file descriptors
 * @param {object} opts  pipeline options
 * @param {string} [opts.format]   output format (netscape|json|csv)
 * @param {boolean} [opts.dedup]
 * @param {string}  [opts.domain]
 * @param {string}  [opts.tag]
 * @param {string}  [opts.after]
 * @param {string}  [opts.query]
 * @param {string}  [opts.sort]
 * @param {string}  [opts.sortDir]
 * @returns {{ output: string, bookmarks: Array }}
 */
function run(inputs, opts = {}) {
  const collections = inputs.map(({ content, path }) => {
    return parse(content, path);
  });

  const merged = merge(collections);
  const processed = transform(merged, opts);

  const fmt = opts.format || 'netscape';
  const formatter = FORMATTERS[fmt];
  if (!formatter) {
    throw new Error(`Unknown output format: ${fmt}`);
  }

  return {
    output: formatter(processed),
    bookmarks: processed,
  };
}

module.exports = { run };
