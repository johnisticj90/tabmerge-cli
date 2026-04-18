/**
 * Truncates bookmark titles and URLs for display purposes.
 */

const DEFAULT_TITLE_LENGTH = 60;
const DEFAULT_URL_LENGTH = 80;
const ELLIPSIS = '...';

function truncateString(str, maxLength) {
  if (typeof str !== 'string') return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - ELLIPSIS.length) + ELLIPSIS;
}

function truncateTitle(bookmark, maxLength = DEFAULT_TITLE_LENGTH) {
  return {
    ...bookmark,
    title: truncateString(bookmark.title || '', maxLength),
  };
}

function truncateUrl(bookmark, maxLength = DEFAULT_URL_LENGTH) {
  return {
    ...bookmark,
    url: truncateString(bookmark.url || '', maxLength),
  };
}

function truncate(bookmark, options = {}) {
  const titleMax = options.titleLength ?? DEFAULT_TITLE_LENGTH;
  const urlMax = options.urlLength ?? DEFAULT_URL_LENGTH;
  let result = bookmark;
  if (options.title !== false) result = truncateTitle(result, titleMax);
  if (options.url !== false) result = truncateUrl(result, urlMax);
  return result;
}

function truncateAll(bookmarks, options = {}) {
  if (!Array.isArray(bookmarks)) return [];
  return bookmarks.map((b) => truncate(b, options));
}

module.exports = { truncateString, truncateTitle, truncateUrl, truncate, truncateAll };
