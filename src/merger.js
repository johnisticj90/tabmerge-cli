const { parse } = require('./parsers/index');
const { deduplicate } = require('./deduplicator');

/**
 * Merge bookmarks from multiple input sources.
 * Each source: { content: string, filename: string }
 *
 * @param {Array<{ content: string, filename: string }>} sources
 * @param {{ mergeTags?: boolean }} options
 * @returns {{ bookmarks: Array<object>, stats: object }}
 */
function merge(sources, options = {}) {
  if (!sources || sources.length === 0) {
    throw new Error('No sources provided to merge');
  }

  const allBookmarks = [];
  const parseErrors = [];
  const sourceCounts = [];

  for (const source of sources) {
    try {
      const parsed = parse(source.content, source.filename);
      sourceCounts.push({ filename: source.filename, count: parsed.length });
      allBookmarks.push(...parsed);
    } catch (err) {
      parseErrors.push({ filename: source.filename, error: err.message });
    }
  }

  const { bookmarks, duplicatesRemoved } = deduplicate(allBookmarks, options);

  return {
    bookmarks,
    stats: {
      totalInput: allBookmarks.length,
      totalOutput: bookmarks.length,
      duplicatesRemoved,
      sourceCounts,
      parseErrors,
    },
  };
}

module.exports = { merge };
