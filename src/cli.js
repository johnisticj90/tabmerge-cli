#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { extname } from 'path';
import { parse } from './parsers/index.js';
import { deduplicate } from './deduplicator.js';
import { merge } from './merger.js';
import { formatNetscape, formatJson, formatCsv } from './formatter.js';

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
tabmerge-cli — merge and deduplicate browser bookmark exports

Usage:
  tabmerge [options] <file1> <file2> ...

Options:
  -o, --output <file>       output file (default: stdout)
  -f, --format <format>     output format: netscape | json | csv (default: netscape)
  --no-dedup                skip deduplication
  -h, --help                show this help
`);
}

function parseArgs(args) {
  const opts = { inputs: [], output: null, format: 'netscape', dedup: true };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-h' || arg === '--help') { printHelp(); process.exit(0); }
    else if (arg === '-o' || arg === '--output') { opts.output = args[++i]; }
    else if (arg === '-f' || arg === '--format') { opts.format = args[++i]; }
    else if (arg === '--no-dedup') { opts.dedup = false; }
    else { opts.inputs.push(arg); }
  }
  return opts;
}

function getFormatter(format) {
  switch (format) {
    case 'json': return formatJson;
    case 'csv': return formatCsv;
    case 'netscape': return formatNetscape;
    default: throw new Error(`Unknown format: ${format}`);
  }
}

function main() {
  const opts = parseArgs(args);
  if (opts.inputs.length === 0) { printHelp(); process.exit(1); }

  const collections = opts.inputs.map(file => {
    const content = readFileSync(file, 'utf-8');
    return parse(content);
  });

  let bookmarks = merge(collections);
  if (opts.dedup) bookmarks = deduplicate(bookmarks);

  const formatter = getFormatter(opts.format);
  const output = formatter(bookmarks);

  if (opts.output) {
    writeFileSync(opts.output, output, 'utf-8');
    console.error(`Wrote ${bookmarks.length} bookmarks to ${opts.output}`);
  } else {
    process.stdout.write(output);
  }
}

main();
