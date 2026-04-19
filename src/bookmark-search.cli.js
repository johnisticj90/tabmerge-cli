#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { parse } = require('./parsers/index');
const { search, searchAll, searchAny } = require('./bookmark-search');
const { formatNetscape } = require('./formatter');

function usage() {
  console.log(`
Usage: bookmark-search [options] <query> <file...>

Options:
  --any       Match ANY term (OR logic, default is AND)
  --format    Output format: netscape|json|csv (default: netscape)
  --help      Show this help

Example:
  bookmark-search dev docs bookmarks.html
  bookmark-search --any github google bookmarks.html
`.trim());
}

function main(argv = process.argv.slice(2)) {
  if (argv.includes('--help') || argv.length === 0) {
    usage();
    return;
  }

  const useAny = argv.includes('--any');
  const args = argv.filter(a => !a.startsWith('--'));

  const fmtIdx = argv.indexOf('--format');
  const format = fmtIdx !== -1 ? argv[fmtIdx + 1] : 'netscape';

  if (args.length < 2) {
    console.error('Error: provide at least one query term and one file.');
    process.exit(1);
  }

  const files = args.filter(a => fs.existsSync(a));
  const terms = args.filter(a => !fs.existsSync(a));

  let bookmarks = [];
  for (const f of files) {
    const raw = fs.readFileSync(f, 'utf8');
    bookmarks = bookmarks.concat(parse(raw));
  }

  const results = useAny ? searchAny(bookmarks, terms) : searchAll(bookmarks, terms);

  if (format === 'json') {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log(formatNetscape(results));
  }
}

if (require.main === module) main();
module.exports = { main };
