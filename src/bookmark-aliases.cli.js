'use strict';

const fs = require('fs');
const { importFile } = require('./importer');
const { setAlias, clearAlias, findByAlias, listAliases, renameAlias } = require('./bookmark-aliases');

function usage() {
  console.error([
    'Usage: bookmark-aliases <command> [options] <file>',
    '',
    'Commands:',
    '  set <alias> <url>   Set alias for bookmark with given url',
    '  clear <alias>       Remove alias',
    '  list                List all aliases',
    '  rename <old> <new>  Rename alias',
    '',
    'Options:',
    '  -o <file>  Output file (default: stdout)',
  ].join('\n'));
  process.exit(1);
}

async function main(argv = process.argv.slice(2)) {
  if (argv.length < 2) usage();

  const outIdx = argv.indexOf('-o');
  let outFile = null;
  if (outIdx !== -1) { outFile = argv[outIdx + 1]; argv.splice(outIdx, 2); }

  const [cmd, ...rest] = argv;
  const inputFile = rest[rest.length - 1];
  let bookmarks = await importFile(inputFile);

  if (cmd === 'set') {
    const [alias, url] = rest;
    bookmarks = bookmarks.map(b => b.url === url ? setAlias(b, alias) : b);
  } else if (cmd === 'clear') {
    const [alias] = rest;
    bookmarks = bookmarks.map(b => b.alias === alias ? clearAlias(b) : b);
  } else if (cmd === 'list') {
    const aliases = listAliases(bookmarks);
    aliases.forEach(a => console.log(`${a.alias}\t${a.url}\t${a.title}`));
    return;
  } else if (cmd === 'rename') {
    const [oldAlias, newAlias] = rest;
    bookmarks = renameAlias(bookmarks, oldAlias, newAlias);
  } else {
    usage();
  }

  const out = JSON.stringify(bookmarks, null, 2);
  if (outFile) fs.writeFileSync(outFile, out);
  else process.stdout.write(out + '\n');
}

module.exports = { usage, main };
