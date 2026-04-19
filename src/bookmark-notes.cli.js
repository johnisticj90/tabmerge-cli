#!/usr/bin/env node
// bookmark-notes.cli.js — CLI for adding/removing/exporting notes

const fs = require('fs');
const path = require('path');
const { importFile } = require('./importer');
const { addNote, removeNote, filterWithNotes, exportNotes } = require('./bookmark-notes');
const { formatJson } = require('./formatter');

function usage() {
  console.error([
    'Usage: bookmark-notes <command> [options] <input>',
    '',
    'Commands:',
    '  add <url> <note> <input>   Add a note to a bookmark by URL',
    '  remove <url> <input>       Remove note from a bookmark by URL',
    '  list <input>               List bookmarks that have notes',
    '  export <input>             Export url+note pairs as JSON',
  ].join('\n'));
  process.exit(1);
}

async function main(argv = process.argv.slice(2)) {
  const [cmd, ...rest] = argv;
  if (!cmd) usage();

  if (cmd === 'add') {
    const [url, note, inputPath] = rest;
    if (!url || !note || !inputPath) usage();
    const bookmarks = await importFile(inputPath);
    const updated = bookmarks.map(b => b.url === url ? addNote(b, note) : b);
    console.log(formatJson(updated));

  } else if (cmd === 'remove') {
    const [url, inputPath] = rest;
    if (!url || !inputPath) usage();
    const bookmarks = await importFile(inputPath);
    const updated = bookmarks.map(b => b.url === url ? removeNote(b) : b);
    console.log(formatJson(updated));

  } else if (cmd === 'list') {
    const [inputPath] = rest;
    if (!inputPath) usage();
    const bookmarks = await importFile(inputPath);
    const noted = filterWithNotes(bookmarks);
    noted.forEach(b => console.log(`${b.url}\t${b.note}`));

  } else if (cmd === 'export') {
    const [inputPath] = rest;
    if (!inputPath) usage();
    const bookmarks = await importFile(inputPath);
    console.log(JSON.stringify(exportNotes(bookmarks), null, 2));

  } else {
    usage();
  }
}

if (require.main === module) main();
module.exports = { main };
