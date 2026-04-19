#!/usr/bin/env node
// bookmark-priority.cli.js — CLI for managing bookmark priorities

const fs = require('fs');
const { setPriority, clearPriority, filterByPriority, filterAtLeast, sortByPriority, LEVELS } = require('./bookmark-priority');

function usage() {
  console.error([
    'Usage: bookmark-priority <command> [options] <file>',
    'Commands:',
    '  set <level> <file>       Set priority for all bookmarks',
    '  filter <level> <file>    Filter bookmarks by exact priority',
    '  atleast <level> <file>   Filter bookmarks at or above priority',
    '  sort [asc|desc] <file>   Sort bookmarks by priority',
    '  clear <file>             Clear priority from all bookmarks',
    `Levels: ${LEVELS.join(', ')}`,
  ].join('\n'));
  process.exit(1);
}

function load(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function main(argv = process.argv.slice(2)) {
  const [cmd, ...rest] = argv;
  if (!cmd) usage();

  if (cmd === 'set') {
    const [level, file] = rest;
    if (!level || !file) usage();
    const bms = load(file);
    const result = bms.map(b => setPriority(b, level));
    console.log(JSON.stringify(result, null, 2));
  } else if (cmd === 'filter') {
    const [level, file] = rest;
    if (!level || !file) usage();
    const bms = load(file);
    console.log(JSON.stringify(filterByPriority(bms, level), null, 2));
  } else if (cmd === 'atleast') {
    const [level, file] = rest;
    if (!level || !file) usage();
    const bms = load(file);
    console.log(JSON.stringify(filterAtLeast(bms, level), null, 2));
  } else if (cmd === 'sort') {
    const maybeDir = ['asc', 'desc'].includes(rest[0]) ? rest[0] : 'desc';
    const file = ['asc', 'desc'].includes(rest[0]) ? rest[1] : rest[0];
    if (!file) usage();
    const bms = load(file);
    console.log(JSON.stringify(sortByPriority(bms, maybeDir), null, 2));
  } else if (cmd === 'clear') {
    const [file] = rest;
    if (!file) usage();
    const bms = load(file);
    console.log(JSON.stringify(bms.map(clearPriority), null, 2));
  } else {
    usage();
  }
}

if (require.main === module) main();
module.exports = { main };
