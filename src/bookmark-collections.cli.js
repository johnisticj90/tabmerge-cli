#!/usr/bin/env node
// CLI for managing bookmark collections

const fs = require('fs');
const { createCollection, addToCollection, removeFromCollection, collectionSize } = require('./bookmark-collections');
const { parse } = require('./parsers/index');

function usage() {
  console.log(`Usage: bookmark-collections <command> [options]

Commands:
  create <name> <input>   Create a collection from a bookmark file
  add <col.json> <input>  Add bookmarks from file to existing collection
  remove <col.json> <url> Remove a bookmark by URL
  info <col.json>         Show collection info

Options:
  --out <file>  Output file (default: stdout)
`);
}

function main(argv = process.argv.slice(2)) {
  const [cmd, ...args] = argv;

  if (!cmd || cmd === '--help') {
    usage();
    return;
  }

  if (cmd === 'create') {
    const [name, inputFile] = args;
    if (!name || !inputFile) { usage(); process.exit(1); }
    const raw = fs.readFileSync(inputFile, 'utf8');
    const bookmarks = parse(raw);
    const col = bookmarks.reduce((c, b) => addToCollection(c, b), createCollection(name));
    console.log(JSON.stringify(col, null, 2));
    return;
  }

  if (cmd === 'add') {
    const [colFile, inputFile] = args;
    if (!colFile || !inputFile) { usage(); process.exit(1); }
    let col = JSON.parse(fs.readFileSync(colFile, 'utf8'));
    const raw = fs.readFileSync(inputFile, 'utf8');
    const bookmarks = parse(raw);
    col = bookmarks.reduce((c, b) => addToCollection(c, b), col);
    console.log(JSON.stringify(col, null, 2));
    return;
  }

  if (cmd === 'remove') {
    const [colFile, url] = args;
    if (!colFile || !url) { usage(); process.exit(1); }
    let col = JSON.parse(fs.readFileSync(colFile, 'utf8'));
    col = removeFromCollection(col, url);
    console.log(JSON.stringify(col, null, 2));
    return;
  }

  if (cmd === 'info') {
    const [colFile] = args;
    if (!colFile) { usage(); process.exit(1); }
    const col = JSON.parse(fs.readFileSync(colFile, 'utf8'));
    console.log(`Name: ${col.name}`);
    console.log(`Created: ${col.createdAt}`);
    console.log(`Bookmarks: ${collectionSize(col)}`);
    return;
  }

  console.error(`Unknown command: ${cmd}`);
  process.exit(1);
}

if (require.main === module) main();
module.exports = { main };
