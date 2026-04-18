const fs = require('fs');
const path = require('path');
const { parse } = require('./parsers/index');
const { validate } = require('./validator');

function readFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function importFile(filePath, options = {}) {
  const content = readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const bookmarks = parse(content, ext);
  if (options.validate) {
    return validate(bookmarks);
  }
  return bookmarks;
}

function importMany(filePaths, options = {}) {
  const results = [];
  const errors = [];
  for (const filePath of filePaths) {
    try {
      const bookmarks = importFile(filePath, options);
      results.push({ filePath, bookmarks, ok: true });
    } catch (err) {
      errors.push({ filePath, error: err.message, ok: false });
      if (options.strict) throw err;
    }
  }
  return { results, errors };
}

function collectBookmarks(filePaths, options = {}) {
  const { results } = importMany(filePaths, options);
  return results.flatMap(r => r.bookmarks);
}

module.exports = { readFile, importFile, importMany, collectBookmarks };
