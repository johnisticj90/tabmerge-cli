#!/usr/bin/env node
'use strict';
const fs = require('fs');
const {
  addRelationship,
  removeRelationship,
  getRelationships,
  clearRelationships,
  findRelated,
} = require('./bookmark-relationships');

function usage() {
  console.log(`Usage: bookmark-relationships <command> [options]

Commands:
  add    <file> <url> <type> <targetUrl>   Add a relationship
  remove <file> <url> <type> <targetUrl>   Remove a relationship
  list   <file> <url> [type]               List relationships
  clear  <file> <url> [type]               Clear relationships
  find   <file> <url> <type>               Find related bookmarks
`);
}

function load(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function main(argv) {
  const [cmd, file, url, typeOrArg, targetUrl] = argv;
  if (!cmd || !file) { usage(); process.exit(1); }
  const bookmarks = load(file);
  const b = bookmarks.find(x => x.url === url);
  if (!b && cmd !== 'find') { console.error('Bookmark not found: ' + url); process.exit(1); }

  if (cmd === 'add') {
    addRelationship(b, typeOrArg, targetUrl);
    save(file, bookmarks);
    console.log(`Added ${typeOrArg} -> ${targetUrl}`);
  } else if (cmd === 'remove') {
    removeRelationship(b, typeOrArg, targetUrl);
    save(file, bookmarks);
    console.log(`Removed ${typeOrArg} -> ${targetUrl}`);
  } else if (cmd === 'list') {
    const rels = getRelationships(b, typeOrArg);
    console.log(JSON.stringify(rels, null, 2));
  } else if (cmd === 'clear') {
    clearRelationships(b, typeOrArg);
    save(file, bookmarks);
    console.log('Cleared relationships');
  } else if (cmd === 'find') {
    const related = findRelated(bookmarks, b, typeOrArg);
    console.log(JSON.stringify(related, null, 2));
  } else {
    usage();
    process.exit(1);
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = { usage, main };
