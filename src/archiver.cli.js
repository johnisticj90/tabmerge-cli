#!/usr/bin/env node
// archiver.cli.js — standalone CLI entry for archive subcommand
const fs = require('fs');
const path = require('path');
const { parse } = require('./parsers/index');
const { archiveToDir } = require('./archiver');

function usage() {
  console.error('Usage: archiver-cli <input> <outDir> [formats...]');
  console.error('  formats: netscape json csv (default: all)');
  process.exit(1);
}

function main(argv = process.argv.slice(2)) {
  if (argv.length < 2) usage();
  const [input, outDir, ...fmts] = argv;
  const formats = fmts.length ? fmts : ['netscape', 'json', 'csv'];

  if (!fs.existsSync(input)) {
    console.error(`File not found: ${input}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(input, 'utf8');
  const ext = path.extname(input).replace('.', '');
  let fmt = ext === 'html' ? 'netscape' : ext;

  let bookmarks;
  try {
    bookmarks = parse(raw, fmt);
  } catch (e) {
    console.error(`Parse error: ${e.message}`);
    process.exit(1);
  }

  const written = archiveToDir(bookmarks, outDir, formats);
  console.log(`Archived ${bookmarks.length} bookmarks to ${outDir}`);
  written.forEach(f => console.log(' -', f));
}

if (require.main === module) main();
module.exports = { main };
