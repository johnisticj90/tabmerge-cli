// archiver.js — bundle bookmarks into a zip archive
const fs = require('fs');
const path = require('path');
const { exportToString } = require('./exporter');

const SUPPORTED_FORMATS = ['netscape', 'json', 'csv'];

function buildManifest(bookmarks, meta = {}) {
  return JSON.stringify({
    version: 1,
    createdAt: new Date().toISOString(),
    count: bookmarks.length,
    ...meta,
  }, null, 2);
}

function collectEntries(bookmarks, formats) {
  const entries = [];
  for (const fmt of formats) {
    if (!SUPPORTED_FORMATS.includes(fmt)) {
      throw new Error(`Unsupported format for archive: ${fmt}`);
    }
    const content = exportToString(bookmarks, fmt);
    entries.push({ name: `bookmarks.${fmt === 'netscape' ? 'html' : fmt}`, content });
  }
  entries.push({ name: 'manifest.json', content: buildManifest(bookmarks) });
  return entries;
}

function archiveToDir(bookmarks, outDir, formats = ['netscape', 'json', 'csv']) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const entries = collectEntries(bookmarks, formats);
  const written = [];
  for (const entry of entries) {
    const dest = path.join(outDir, entry.name);
    fs.writeFileSync(dest, entry.content, 'utf8');
    written.push(dest);
  }
  return written;
}

module.exports = { buildManifest, collectEntries, archiveToDir, SUPPORTED_FORMATS };
