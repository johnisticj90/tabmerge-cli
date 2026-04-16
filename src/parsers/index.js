const { parseNetscape } = require('./netscape');
const { parseJson } = require('./json');

/**
 * Supported format identifiers
 */
const FORMATS = {
  NETSCAPE: 'netscape',
  JSON: 'json',
};

/**
 * Auto-detect the format of a bookmark export string.
 * @param {string} input
 * @returns {string} format identifier
 */
function detectFormat(input) {
  const trimmed = input.trimStart();
  if (trimmed.startsWith('<!DOCTYPE NETSCAPE-Bookmark-file-1>') ||
      trimmed.startsWith('<! DOCTYPE NETSCAPE')) {
    return FORMATS.NETSCAPE;
  }
  if (trimmed.startsWith('{')) {
    try data = JSON.parse(trimmed);
      if (data.roots) return FORMATS.JSON;
    } catch (_) {
      // fall through
    }
  }
  throw new Error('Unable to detect bookmark format');
}

/**
 * Parse a bookmark export string using auto-detection or a specified format.
 * @param {string} input
 * @param {string} [format] - optional format override
 * @returns {Array<{title: string, url: string, addDate: number|null}>}
 */
function parse(input, format) {
  const resolved = format || detectFormat(input);

  switch (resolved) {
    case FORMATS.NETSCAPE:
      return parseNetscape(input);
    case FORMATS.JSON:
      return parseJson(input);
    default:
      throw new Error(`Unsupported format: ${resolved}`);
  }
}

module.exports = { parse, detectFormat, FORMATS };
