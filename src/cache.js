/**
 * Simple file-based cache for parsed bookmark files.
 * Keyed by file path + mtime to avoid redundant parsing.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const CACHE_DIR = path.join(os.tmpdir(), 'tabmerge-cli');
const CACHE_FILE = path.join(CACHE_DIR, 'parse-cache.json');

function loadCache() {
  try {
    const raw = fs.readFileSync(CACHE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveCache(cache) {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
  } catch {
    // cache write failures are non-fatal
  }
}

function getCacheKey(filePath) {
  try {
    const stat = fs.statSync(filePath);
    return `${path.resolve(filePath)}:${stat.mtimeMs}`;
  } catch {
    return null;
  }
}

function get(filePath) {
  const key = getCacheKey(filePath);
  if (!key) return null;
  const cache = loadCache();
  return cache[key] || null;
}

function set(filePath, bookmarks) {
  const key = getCacheKey(filePath);
  if (!key) return;
  const cache = loadCache();
  cache[key] = bookmarks;
  saveCache(cache);
}

function clear() {
  saveCache({});
}

module.exports = { get, set, clear, CACHE_FILE };
