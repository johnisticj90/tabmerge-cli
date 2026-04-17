/**
 * Validates bookmark objects and collections.
 */

const VALID_URL_SCHEMES = ['http:', 'https:', 'ftp:', 'file:'];

function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return VALID_URL_SCHEMES.includes(parsed.protocol);
  } catch {
    return false;
  }
}

function validateBookmark(bookmark) {
  const errors = [];

  if (!bookmark || typeof bookmark !== 'object') {
    return ['bookmark must be an object'];
  }

  if (!bookmark.url) {
    errors.push('missing required field: url');
  } else if (!isValidUrl(bookmark.url)) {
    errors.push(`invalid url: ${bookmark.url}`);
  }

  if (bookmark.title !== undefined && typeof bookmark.title !== 'string') {
    errors.push('title must be a string');
  }

  if (bookmark.tags !== undefined) {
    if (!Array.isArray(bookmark.tags)) {
      errors.push('tags must be an array');
    } else if (bookmark.tags.some(t => typeof t !== 'string')) {
      errors.push('all tags must be strings');
    }
  }

  if (bookmark.addDate !== undefined && isNaN(Number(bookmark.addDate))) {
    errors.push('addDate must be a numeric timestamp');
  }

  return errors;
}

function validate(bookmarks) {
  if (!Array.isArray(bookmarks)) {
    return { valid: false, errors: [{ index: null, errors: ['input must be an array'] }] };
  }

  const errorList = [];
  for (let i = 0; i < bookmarks.length; i++) {
    const errs = validateBookmark(bookmarks[i]);
    if (errs.length > 0) {
      errorList.push({ index: i, errors: errs });
    }
  }

  return { valid: errorList.length === 0, errors: errorList };
}

module.exports = { isValidUrl, validateBookmark, validate };
