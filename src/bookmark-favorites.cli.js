#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { importFile } = require('./importer');
const { filterFavorites, favoriteAll, unfavoriteAll } = require('./bookmark-favorites');
const { exportToString } = require('./exporter');

function usage() {
  console.error('Usage: bookmark-favorites <command> <file> [--format=netscape|json|csv]');
  console.error('Commands: list, mark-all, unmark-all');
  process.exit(1);
}

async function main(argv = process.argv.slice(2)) {
  const [cmd, file, ...flags] = argv;
  if (!cmd || !file) return usage();

  const fmt = (flags.find(f => f.startsWith('--format=')) || '--format=netscape').split('=')[1];

  let bookmarks;
  try {
    bookmarks = await importFile(file);
  } catch (e) {
    console.error('Error reading file:', e.message);
    process.exit(1);
  }

  let result;
  if (cmd === 'list') {
    result = filterFavorites(bookmarks);
  } else if (cmd === 'mark-all') {
    result = favoriteAll(bookmarks);
  } else if (cmd === 'unmark-all') {
    result = unfavoriteAll(bookmarks);
  } else {
    console.error('Unknown command:', cmd);
    return usage();
  }

  const out = exportToString(result, fmt);
  process.stdout.write(out);
}

if (require.main === module) main();
module.exports = { usage, main };
