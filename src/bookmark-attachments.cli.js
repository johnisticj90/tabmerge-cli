#!/usr/bin/env node
// bookmark-attachments.cli.js — CLI for managing bookmark attachments

const fs = require('fs');
const path = require('path');
const { addAttachment, removeAttachment, clearAttachments, getAttachments } = require('./bookmark-attachments');

function usage() {
  console.log(`Usage: bookmark-attachments <command> [options]

Commands:
  add <file> --bookmark <url> --id <id> --name <name> --type <mime>
  remove <file> --bookmark <url> --id <id>
  clear <file> --bookmark <url>
  list <file> --bookmark <url>

Options:
  --bookmark  URL of the bookmark to modify
  --id        Attachment identifier
  --name      Attachment display name
  --type      MIME type of the attachment
  --out       Output file (default: overwrite input)
`);
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      args[argv[i].slice(2)] = argv[i + 1];
      i++;
    } else {
      args._.push(argv[i]);
    }
  }
  return args;
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const [cmd, file] = args._;
  if (!cmd || !file) { usage(); process.exit(1); }

  const bookmarks = JSON.parse(fs.readFileSync(file, 'utf8'));
  const out = args.out || file;
  const url = args.bookmark;

  const updated = bookmarks.map(b => {
    if (b.url !== url) return b;
    if (cmd === 'add') return addAttachment(b, { id: args.id, name: args.name, type: args.type });
    if (cmd === 'remove') return removeAttachment(b, args.id);
    if (cmd === 'clear') return clearAttachments(b);
    return b;
  });

  if (cmd === 'list') {
    const bm = bookmarks.find(b => b.url === url);
    const atts = bm ? getAttachments(bm) : [];
    atts.forEach(a => console.log(`${a.id}\t${a.name}\t${a.type}`));
    return;
  }

  fs.writeFileSync(out, JSON.stringify(updated, null, 2));
  console.log(`Done. Written to ${out}`);
}

if (require.main === module) main();
module.exports = { usage, parseArgs, main };
