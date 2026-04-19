'use strict';

const fs = require('fs');
const path = require('path');
const { importFile } = require('./importer');
const { pinAll, unpinAll, getPinned, sortWithPinnedFirst } = require('./pinner');
const { exportToFile } = require('./exporter');

function usage() {
  console.log(`Usage: pinner <command> [options] <input>

Commands:
  pin --domain <domain> -o <output>   Pin bookmarks matching domain
  unpin -o <output>                   Remove all pins
  list                                Print pinned bookmarks

Options:
  --format <fmt>   Output format: netscape|json|csv (default: netscape)
  -o <file>        Output file
`);
}

async function main(argv) {
  const args = argv.slice(2);
  const cmd = args[0];
  if (!cmd || cmd === '--help') { usage(); return; }

  const inputFile = args[args.length - 1];
  const domainIdx = args.indexOf('--domain');
  const domain = domainIdx !== -1 ? args[domainIdx + 1] : null;
  const outIdx = args.indexOf('-o');
  const outFile = outIdx !== -1 ? args[outIdx + 1] : null;
  const fmtIdx = args.indexOf('--format');
  const fmt = fmtIdx !== -1 ? args[fmtIdx + 1] : 'netscape';

  let bookmarks;
  try {
    bookmarks = await importFile(inputFile);
  } catch (e) {
    console.error('Error reading input:', e.message);
    process.exit(1);
  }

  let result;
  if (cmd === 'pin') {
    if (!domain) { console.error('--domain required for pin'); process.exit(1); }
    result = sortWithPinnedFirst(pinAll(bookmarks, b => b.url.includes(domain)));
  } else if (cmd === 'unpin') {
    result = unpinAll(bookmarks);
  } else if (cmd === 'list') {
    getPinned(bookmarks).forEach(b => console.log(b.url, b.title || ''));
    return;
  } else {
    console.error('Unknown command:', cmd); usage(); process.exit(1);
  }

  if (outFile) {
    await exportToFile(result, outFile, fmt);
    console.log(`Wrote ${result.length} bookmarks to ${outFile}`);
  } else {
    const { exportToString } = require('./exporter');
    console.log(exportToString(result, fmt));
  }
}

main(process.argv).catch(e => { console.error(e.message); process.exit(1); });
