/**
 * Orchestrates stats computation and output for the CLI --stats flag.
 */
const { computeStats, formatStats } = require('./stats');

/**
 * Prints stats for the given bookmark list to the given stream.
 * @param {Array} bookmarks
 * @param {{ stream?: NodeJS.WriteStream, json?: boolean }} options
 */
function report(bookmarks, options = {}) {
  const { stream = process.stdout, json = false } = options;
  const stats = computeStats(bookmarks);

  if (json) {
    stream.write(JSON.stringify(stats, null, 2) + '\n');
  } else {
    stream.write(formatStats(stats) + '\n');
  }

  return stats;
}

module.exports = { report };
