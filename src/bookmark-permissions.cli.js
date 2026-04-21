#!/usr/bin/env node
// bookmark-permissions.cli.js — CLI for managing bookmark permissions

const fs = require('fs');
const {
  setPermission,
  removePermission,
  listPermissions,
  clearPermissions,
} = require('./bookmark-permissions');

function usage() {
  console.log(`Usage: bookmark-permissions <command> <file.json> [options]

Commands:
  set <url> <user> <role>   Set a user's role on a bookmark (owner|editor|viewer)
  remove <url> <user>       Remove a user's permission from a bookmark
  list <url>                List all permissions for a bookmark
  clear <url>               Clear all permissions for a bookmark
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

  if (cmd === 'set') {
    const [url, user, role] = rest;
    if (!url || !user || !role) { usage(); process.exit(1); }
    const updated = bookmarks.map(b => b.url === url ? setPermission(b, user, role) : b);
    save(file, updated);
    console.log(`Set ${user}=${role} on ${url}`);

  } else if (cmd === 'remove') {
    const [url, user] = rest;
    if (!url || !user) { usage(); process.exit(1); }
    const updated = bookmarks.map(b => b.url === url ? removePermission(b, user) : b);
    save(file, updated);
    console.log(`Removed ${user} from ${url}`);

  } else if (cmd === 'list') {
    const [url] = rest;
    const b = bookmarks.find(x => x.url === url);
    if (!b) { console.error('Bookmark not found'); process.exit(1); }
    listPermissions(b).forEach(({ user, role }) => console.log(`${user}: ${role}`));

  } else if (cmd === 'clear') {
    const [url] = rest;
    const updated = bookmarks.map(b => b.url === url ? clearPermissions(b) : b);
    save(file, updated);
    console.log(`Cleared permissions on ${url}`);

  } else {
    usage();
    process.exit(1);
  }
}

if (require.main === module) main();
module.exports = { main };
