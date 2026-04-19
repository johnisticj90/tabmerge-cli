#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { parse } = require('./parsers/index');
const { markAllRead, markAllUnread, filterRead, filterUnread, summarizeStatus } = require('./bookmark-status');
const { formatJson } = require('./formatter');

function usage() {
  console.log(`Usage: bookmark-status <command> <file>

Commands:
  mark-read     Mark all bookmarks as read
  mark-unread   Mark all bookmarks as unread
  filter-read   Output only read bookmarks
  filter-unread Output only unread bookmarks
  summary       Print read/unread counts
`);
}

function main(argv = process.argv.slice(2)) {
  const [cmd, filePath] = argv;
  if (!cmd || !filePath) { usage(); process.exit(1); }

  let raw;
  try { raw = fs.readFileSync(filePath, 'utf8'); }
  catch (e) { console.error('Cannot read file:', e.message); process.exit(1); }

  const bookmarks = parse(raw);

  switch (cmd) {
    case 'mark-read':
      console.log(formatJson(markAllRead(bookmarks)));
      break;
    case 'mark-unread':
      console.log(formatJson(markAllUnread(bookmarks)));
      break;
    case 'filter-read':
      console.log(formatJson(filterRead(bookmarks)));
      break;
    case 'filter-unread':
      console.log(formatJson(filterUnread(bookmarks)));
      break;
    case 'summary': {
      const s = summarizeStatus(bookmarks);
      console.log(`Total: ${s.total}  Read: ${s.read}  Unread: ${s.unread}`);
      break;
    }
    default:
      console.error('Unknown command:', cmd);
      usage();
      process.exit(1);
  }
}

if (require.main === module) main();
module.exports = { usage, main };
