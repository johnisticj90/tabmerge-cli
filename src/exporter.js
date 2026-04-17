import { formatNetscape, formatJson, formatCsv } from './formatter.js';
import { writeFileSync } from 'fs';

/**
 * Map of supported export formats to their formatter functions and file extensions.
 */
const FORMATS = {
  netscape: { fn: formatNetscape, ext: 'html' },
  json:     { fn: formatJson,     ext: 'json' },
  csv:      { fn: formatCsv,      ext: 'csv'  },
};

/**
 * Returns list of supported export format names.
 * @returns {string[]}
 */
export function supportedFormats() {
  return Object.keys(FORMATS);
}

/**
 * Resolves the output file path, appending the correct extension if missing.
 * @param {string} filePath
 * @param {string} format
 * @returns {string}
 */
export function resolveOutputPath(filePath, format) {
  const entry = FORMATS[format];
  if (!entry) throw new Error(`Unsupported format: ${format}`);
  const ext = '.' + entry.ext;
  return filePath.endsWith(ext) ? filePath : filePath + ext;
}

/**
 * Exports bookmarks to a string in the given format.
 * @param {object[]} bookmarks
 * @param {string} format
 * @returns {string}
 */
export function exportToString(bookmarks, format) {
  const entry = FORMATS[format];
  if (!entry) throw new Error(`Unsupported format: ${format}`);
  return entry.fn(bookmarks);
}

/**
 * Exports bookmarks to a file.
 * @param {object[]} bookmarks
 * @param {string} filePath
 * @param {string} format
 * @returns {string} resolved file path
 */
export function exportToFile(bookmarks, filePath, format) {
  const resolved = resolveOutputPath(filePath, format);
  const content = exportToString(bookmarks, format);
  writeFileSync(resolved, content, 'utf8');
  return resolved;
}
