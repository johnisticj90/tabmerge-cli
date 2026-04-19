#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { createSnapshot, listSnapshots, findSnapshot, deleteSnapshot, diffSnapshot } = require('./bookmark-snapshots');
const { parse } = require('./parsers/index');

function usage() {
  console.log(`Usage: bookmark-snapshots <command> [options]

Commands:
  create <bookmarks-file> [--label <label>] --store <snapshots-file>
  list --store <snapshots-file>
  diff <id1> <id2> --store <snapshots-file>
  delete <id> --store <snapshots-file>
`);
}

function loadStore(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveStore(file, snapshots) {
  fs.writeFileSync(file, JSON.stringify(snapshots, null, 2));
}

function main(argv = process.argv.slice(2)) {
  const args = argv.slice();
  const cmd = args.shift();
  const storeIdx = args.indexOf('--store');
  const storeFile = storeIdx !== -1 ? args[storeIdx + 1] : null;

  if (!cmd || !storeFile) { usage(); process.exit(1); }

  const snapshots = loadStore(storeFile);

  if (cmd === 'create') {
    const bookmarksFile = args[0];
    const labelIdx = args.indexOf('--label');
    const label = labelIdx !== -1 ? args[labelIdx + 1] : '';
    const raw = fs.readFileSync(bookmarksFile, 'utf8');
    const bookmarks = parse(raw);
    const snap = createSnapshot(bookmarks, label);
    snapshots.push(snap);
    saveStore(storeFile, snapshots);
    console.log(`Snapshot created: ${snap.id} (${snap.bookmarks.length} bookmarks)`);
  } else if (cmd === 'list') {
    const list = listSnapshots(snapshots);
    list.forEach(s => console.log(`${s.id}  ${s.createdAt}  ${s.label}  (${s.count})`));
  } else if (cmd === 'diff') {
    const [id1, id2] = args;
    const a = findSnapshot(snapshots, id1);
    const b = findSnapshot(snapshots, id2);
    if (!a || !b) { console.error('Snapshot not found'); process.exit(1); }
    const { added, removed } = diffSnapshot(a, b);
    console.log(`Added (${added.length}):`);
    added.forEach(bk => console.log('  + ' + bk.url));
    console.log(`Removed (${removed.length}):`);
    removed.forEach(bk => console.log('  - ' + bk.url));
  } else if (cmd === 'delete') {
    const id = args[0];
    const updated = deleteSnapshot(snapshots, id);
    saveStore(storeFile, updated);
    console.log(`Deleted snapshot ${id}`);
  } else {
    usage(); process.exit(1);
  }
}

if (require.main === module) main();
module.exports = { main };
