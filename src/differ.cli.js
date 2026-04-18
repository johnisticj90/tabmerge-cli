#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { parse } = require('./parsers/index');
const { diffBookmarks, formatDiff } = require('./differ');

function usage() {
  console.error('Usage: differ <file1> <file2> [--json]');
  console.error('  Compare two bookmark files and show what changed.');
  process.exit(1);
}

async function main(argv) {
  const args = argv.slice(2);
  if (args.length < 2) usage();

  const jsonOut = args.includes('--json');
  const [f1, f2] = args.filter(a => !a.startsWith('--'));

  if (!f1 || !f2) usage();

  let src1, src2;
  try {
    src1 = fs.readFileSync(f1, 'utf8');
    src2 = fs.readFileSync(f2, 'utf8');
  } catch (e) {
    console.error('Error reading files:', e.message);
    process.exit(1);
  }

  const oldList = parse(src1);
  const newList = parse(src2);
  const diff = diffBookmarks(oldList, newList);

  if (jsonOut) {
    console.log(JSON.stringify(diff, null, 2));
  } else {
    console.log(formatDiff(diff));
  }
}

main(process.argv);
