#!/usr/bin/env node
// bookmark-links.cli.js — CLI for managing bookmark links

const fs = require('fs');
const { addLink, removeLink, getLinks, clearLinks, buildLinkGraph } = require('./bookmark-links');

function usage() {
  console.log(`Usage: bookmark-links <command> [options]

Commands:
  add <file> <url> <targetUrl> [label]   Add a link to a bookmark
  remove <file> <url> <targetUrl>        Remove a link from a bookmark
  list <file> <url>                      List links for a bookmark
  clear <file> <url>                     Clear all links for a bookmark
  graph <file>                           Print link graph as JSON
`);
}

function loadBookmarks(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveBookmarks(file, bookmarks) {
  fs.writeFileSync(file, JSON.stringify(bookmarks, null, 2));
}

function main(argv = process.argv.slice(2)) {
  const [cmd, file, url, second, label] = argv;
  if (!cmd || cmd === '--help') { usage(); return; }

  const bookmarks = loadBookmarks(file);

  if (cmd === 'add') {
    const updated = bookmarks.map(b => b.url === url ? addLink(b, second, label || '') : b);
    saveBookmarks(file, updated);
    console.log(`Link added to ${url}`);
  } else if (cmd === 'remove') {
    const updated = bookmarks.map(b => b.url === url ? removeLink(b, second) : b);
    saveBookmarks(file, updated);
    console.log(`Link removed from ${url}`);
  } else if (cmd === 'list') {
    const b = bookmarks.find(b => b.url === url);
    if (!b) { console.error('Bookmark not found'); process.exit(1); }
    const links = getLinks(b);
    if (links.length === 0) { console.log('No links.'); return; }
    links.forEach(l => console.log(`  ${l.url}${l.label ? ' — ' + l.label : ''}`));
  } else if (cmd === 'clear') {
    const updated = bookmarks.map(b => b.url === url ? clearLinks(b) : b);
    saveBookmarks(file, updated);
    console.log(`Links cleared for ${url}`);
  } else if (cmd === 'graph') {
    console.log(JSON.stringify(buildLinkGraph(bookmarks), null, 2));
  } else {
    console.error(`Unknown command: ${cmd}`);
    usage();
    process.exit(1);
  }
}

if (require.main === module) main();
module.exports = { main };
