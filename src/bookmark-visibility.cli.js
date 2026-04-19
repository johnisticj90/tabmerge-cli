#!/usr/bin/env node
// CLI for bookmark visibility management

const fs = require('fs');
const { hideOne, showOne, filterVisible, filterHidden, hideByDomain } = require('./bookmark-visibility');

function usage() {
  console.log(`Usage: bookmark-visibility <command> [options] <file>

Commands:
  hide-all          Hide all bookmarks
  show-all          Show all bookmarks
  filter-visible    Output only visible bookmarks
  filter-hidden     Output only hidden bookmarks
  hide-domain <d>   Hide bookmarks matching domain

Options:
  --out <file>      Output file (default: stdout)
`);
}

function main(argv = process.argv.slice(2)) {
  if (!argv.length || argv[0] === '--help') return usage();

  const [command, ...rest] = argv;
  const file = rest[rest.length - 1];

  if (!file || !fs.existsSync(file)) {
    console.error('Error: input file not found');
    process.exit(1);
  }

  let bookmarks;
  try {
    bookmarks = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    console.error('Error: failed to parse JSON');
    process.exit(1);
  }

  let result;
  if (command === 'hide-all') {
    result = bookmarks.map(hideOne);
  } else if (command === 'show-all') {
    result = bookmarks.map(showOne);
  } else if (command === 'filter-visible') {
    result = filterVisible(bookmarks);
  } else if (command === 'filter-hidden') {
    result = filterHidden(bookmarks);
  } else if (command === 'hide-domain') {
    const domain = rest[0];
    if (!domain) { console.error('Error: domain required'); process.exit(1); }
    result = hideByDomain(bookmarks, domain);
  } else {
    console.error(`Unknown command: ${command}`);
    usage();
    process.exit(1);
  }

  console.log(JSON.stringify(result, null, 2));
}

main();
module.exports = { main };
