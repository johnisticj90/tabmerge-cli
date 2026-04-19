#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { parse } = require('./parsers/index');
const {
  addVisit,
  filterNeverVisited,
  filterVisitedAfter,
  sortByLastVisited,
} = require('./bookmark-history');
const { exportToString } = require('./exporter');

function usage() {
  console.error([
    'Usage: bookmark-history <command> [options] <file>',
    '',
    'Commands:',
    '  add-visit <file>             Record a visit (now) for all bookmarks',
    '  never-visited <file>         List bookmarks never visited',
    '  visited-after <date> <file>  List bookmarks visited after date',
    '  sort <file>                  Sort by last visited (desc)',
    '',
    'Options:',
    '  --format <fmt>   Output format: netscape|json|csv (default: json)',
  ].join('\n'));
  process.exit(1);
}

async function main(argv = process.argv.slice(2)) {
  if (argv.length < 2) usage();

  const fmtIdx = argv.indexOf('--format');
  const format = fmtIdx !== -1 ? argv.splice(fmtIdx, 2)[1] : 'json';

  const [command, ...rest] = argv;

  let filePath, dateArg;
  if (command === 'visited-after') {
    [dateArg, filePath] = rest;
  } else {
    [filePath] = rest;
  }

  if (!filePath || !fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  let bookmarks = parse(raw);

  if (command === 'add-visit') {
    bookmarks = bookmarks.map(b => addVisit(b));
  } else if (command === 'never-visited') {
    bookmarks = filterNeverVisited(bookmarks);
  } else if (command === 'visited-after') {
    if (!dateArg) usage();
    bookmarks = filterVisitedAfter(bookmarks, dateArg);
  } else if (command === 'sort') {
    bookmarks = sortByLastVisited(bookmarks);
  } else {
    usage();
  }

  process.stdout.write(exportToString(bookmarks, format) + '\n');
}

main().catch(e => { console.error(e.message); process.exit(1); });
