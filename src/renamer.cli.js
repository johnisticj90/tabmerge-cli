'use strict';

/**
 * renamer.cli.js — CLI wrapper for the renamer module
 * Usage: node src/renamer.cli.js --strategy <normalize|capitalize|stripSuffix> <input> [output]
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('./parsers/index');
const { rename } = require('./renamer');
const { exportToString } = require('./exporter');

function usage() {
  console.error('Usage: renamer.cli.js --strategy <normalize|capitalize|stripSuffix> <input> [output]');
  console.error('Strategies: normalize, capitalize, stripSuffix');
  process.exit(1);
}

function main(argv) {
  const args = argv.slice(2);
  const stratIdx = args.indexOf('--strategy');
  if (stratIdx === -1 || !args[stratIdx + 1]) usage();

  const strategy = args[stratIdx + 1];
  const rest = args.filter((_, i) => i !== stratIdx && i !== stratIdx + 1);

  if (rest.length < 1) usage();

  const inputFile = rest[0];
  const outputFile = rest[1] || null;

  let raw;
  try {
    raw = fs.readFileSync(inputFile, 'utf8');
  } catch (e) {
    console.error(`Error reading file: ${inputFile}`);
    process.exit(1);
  }

  let bookmarks;
  try {
    bookmarks = parse(raw);
  } catch (e) {
    console.error(`Error parsing file: ${e.message}`);
    process.exit(1);
  }

  let renamed;
  try {
    renamed = rename(bookmarks, strategy);
  } catch (e) {
    console.error(`Error renaming: ${e.message}`);
    process.exit(1);
  }

  const ext = outputFile ? path.extname(outputFile).slice(1) : 'json';
  const format = ext === 'html' ? 'netscape' : ext === 'csv' ? 'csv' : 'json';
  const output = exportToString(renamed, format);

  if (outputFile) {
    fs.writeFileSync(outputFile, output, 'utf8');
    console.log(`Wrote ${renamed.length} bookmarks to ${outputFile}`);
  } else {
    process.stdout.write(output);
  }
}

main(process.argv);
