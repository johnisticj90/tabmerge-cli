#!/usr/bin/env node
'use strict';
const fs = require('fs');
const { importFile } = require('./importer');
const { exportToFile } = require('./exporter');
const { rateOne, unrateOne, filterByRating, topRated, averageRating } = require('./bookmark-ratings');

function usage() {
  console.log(`Usage: bookmark-ratings <command> [options] <file>

Commands:
  rate <n> <file>         Set rating 1-5 for all bookmarks
  unrate <file>           Remove ratings from all bookmarks
  filter <min> [max] <f>  Filter by rating range
  top [n] <file>          Show top-rated bookmarks
  avg <file>              Print average rating

Options:
  --out <file>   Output file (default: stdout)
  --format <f>   Output format (netscape|json|csv)
`);
}

async function main(argv) {
  const args = argv.slice(2);
  const cmd = args[0];
  if (!cmd || cmd === '--help') { usage(); return; }

  const outIdx = args.indexOf('--out');
  const outFile = outIdx !== -1 ? args.splice(outIdx, 2)[1] : null;
  const fmtIdx = args.indexOf('--format');
  const format = fmtIdx !== -1 ? args.splice(fmtIdx, 2)[1] : 'json';

  if (cmd === 'rate') {
    const rating = parseInt(args[1], 10);
    const bookmarks = await importFile(args[2]);
    const result = bookmarks.map(b => rateOne(b, rating));
    if (outFile) await exportToFile(result, outFile, format);
    else console.log(JSON.stringify(result, null, 2));
  } else if (cmd === 'unrate') {
    const bookmarks = await importFile(args[1]);
    const result = bookmarks.map(unrateOne);
    if (outFile) await exportToFile(result, outFile, format);
    else console.log(JSON.stringify(result, null, 2));
  } else if (cmd === 'filter') {
    const min = parseInt(args[1], 10);
    const hasMax = !isNaN(parseInt(args[2], 10));
    const max = hasMax ? parseInt(args[2], 10) : 5;
    const file = hasMax ? args[3] : args[2];
    const bookmarks = await importFile(file);
    const result = filterByRating(bookmarks, min, max);
    if (outFile) await exportToFile(result, outFile, format);
    else console.log(JSON.stringify(result, null, 2));
  } else if (cmd === 'top') {
    const hasN = !isNaN(parseInt(args[1], 10));
    const n = hasN ? parseInt(args[1], 10) : 10;
    const file = hasN ? args[2] : args[1];
    const bookmarks = await importFile(file);
    const result = topRated(bookmarks, n);
    if (outFile) await exportToFile(result, outFile, format);
    else console.log(JSON.stringify(result, null, 2));
  } else if (cmd === 'avg') {
    const bookmarks = await importFile(args[1]);
    const avg = averageRating(bookmarks);
    console.log(avg !== null ? avg.toFixed(2) : 'No rated bookmarks');
  } else {
    console.error(`Unknown command: ${cmd}`);
    usage();
    process.exit(1);
  }
}

main(process.argv).catch(e => { console.error(e.message); process.exit(1); });
