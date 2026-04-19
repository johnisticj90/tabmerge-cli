#!/usr/bin/env node
// bookmark-comments.cli.js — CLI for managing bookmark comments

const fs = require('fs');
const {
  addComment,
  removeComment,
  clearComments,
  getComments,
  searchComments,
} = require('./bookmark-comments');

function usage() {
  console.log(`Usage: bookmark-comments <command> [options]

Commands:
  add <file> <index> <text>   Add a comment to bookmark at index
  remove <file> <index> <ci>  Remove comment ci from bookmark at index
  clear <file> <index>        Clear all comments from bookmark at index
  list <file> <index>         List comments on bookmark at index
  search <file> <query>       Search bookmarks by comment text
`);
}

function load(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function main(argv = process.argv.slice(2)) {
  const [cmd, file, ...rest] = argv;
  if (!cmd || !file) { usage(); process.exit(1); }

  const bookmarks = load(file);

  if (cmd === 'add') {
    const [idx, ...words] = rest;
    const text = words.join(' ');
    bookmarks[Number(idx)] = addComment(bookmarks[Number(idx)], text);
    save(file, bookmarks);
    console.log('Comment added.');
  } else if (cmd === 'remove') {
    const [idx, ci] = rest;
    bookmarks[Number(idx)] = removeComment(bookmarks[Number(idx)], Number(ci));
    save(file, bookmarks);
    console.log('Comment removed.');
  } else if (cmd === 'clear') {
    const [idx] = rest;
    bookmarks[Number(idx)] = clearComments(bookmarks[Number(idx)]);
    save(file, bookmarks);
    console.log('Comments cleared.');
  } else if (cmd === 'list') {
    const [idx] = rest;
    const comments = getComments(bookmarks[Number(idx)]);
    if (comments.length === 0) console.log('No comments.');
    else comments.forEach((c, i) => console.log(`[${i}] ${c.addedAt}: ${c.text}`));
  } else if (cmd === 'search') {
    const results = searchComments(bookmarks, rest.join(' '));
    results.forEach(b => console.log(`${b.url} — ${b.title}`));
  } else {
    usage(); process.exit(1);
  }
}

if (require.main === module) main();
module.exports = { usage, main };
