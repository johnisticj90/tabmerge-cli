#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('./parsers/index');
const { labelAll, groupByLabel } = require('./labeler');

function usage() {
  console.log('Usage: labeler <input> [--group] [--format json|text]');
  console.log('  --group     Group output by label');
  console.log('  --format    Output format (default: text)');
}

function parseArgs(argv) {
  const args = { input: null, group: false, format: 'text' };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--group') args.group = true;
    else if (argv[i] === '--format') args.format = argv[++i];
    else if (!argv[i].startsWith('--')) args.input = argv[i];
  }
  return args;
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (!args.input) { usage(); process.exit(1); }

  const raw = fs.readFileSync(args.input, 'utf8');
  const ext = path.extname(args.input).slice(1);
  const bookmarks = parse(raw, ext);
  const labeled = labelAll(bookmarks);

  if (args.format === 'json') {
    if (args.group) {
      console.log(JSON.stringify(groupByLabel(labeled), null, 2));
    } else {
      console.log(JSON.stringify(labeled, null, 2));
    }
    return;
  }

  if (args.group) {
    const groups = groupByLabel(labeled);
    for (const [label, items] of Object.entries(groups)) {
      console.log(`\n[${label}] (${items.length})`);
      for (const b of items) console.log(`  ${b.title || b.url}  ${b.url}`);
    }
  } else {
    for (const b of labeled) {
      console.log(`[${b.label}] ${b.title || b.url}  ${b.url}`);
    }
  }
}

main();
