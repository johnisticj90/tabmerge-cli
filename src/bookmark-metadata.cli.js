#!/usr/bin/env node
'use strict';
const fs = require('fs');
const { parse } = require('./parsers/index');
const { setMetaAll, clearMetaAll, filterByMeta } = require('./bookmark-metadata');
const { formatJson } = require('./formatter');

function usage() {
  console.error('Usage: bookmark-metadata <file> <set|clear|filter> <key> [value]');
  process.exit(1);
}

function main(argv = process.argv.slice(2)) {
  if (argv.length < 3) usage();
  const [file, cmd, key, value] = argv;

  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch (e) {
    console.error('Could not read file:', e.message);
    process.exit(1);
  }

  let bookmarks;
  try {
    bookmarks = parse(raw);
  } catch (e) {
    console.error('Parse error:', e.message);
    process.exit(1);
  }

  let result;
  if (cmd === 'set') {
    if (!key || value === undefined) usage();
    result = setMetaAll(bookmarks, key, value);
  } else if (cmd === 'clear') {
    if (!key) usage();
    result = clearMetaAll(bookmarks, key);
  } else if (cmd === 'filter') {
    if (!key) usage();
    result = filterByMeta(bookmarks, key, value);
  } else {
    console.error('Unknown command:', cmd);
    usage();
  }

  console.log(formatJson(result));
}

if (require.main === module) main();
module.exports = { usage, main };
