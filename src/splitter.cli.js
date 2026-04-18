#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('./parsers/index');
const { chunkBySize, splitIntoParts } = require('./splitter');
const { exportToFile } = require('./exporter');

function usage() {
  console.error([
    'Usage: splitter-cli <input> [options]',
    '',
    'Options:',
    '  --size <n>      Split into chunks of n bookmarks each',
    '  --parts <n>     Split into exactly n parts',
    '  --format <fmt>  Output format: netscape|json|csv (default: netscape)',
    '  --out <dir>     Output directory (default: .)',
    '  --help          Show this help',
  ].join('\n'));
}

function parseArgs(argv) {
  const args = { format: 'netscape', out: '.', input: null, size: null, parts: null };
  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--size':   args.size   = parseInt(argv[++i], 10); break;
      case '--parts':  args.parts  = parseInt(argv[++i], 10); break;
      case '--format': args.format = argv[++i]; break;
      case '--out':    args.out    = argv[++i]; break;
      case '--help':   args.help   = true; break;
      default: if (!argv[i].startsWith('--')) args.input = argv[i];
    }
  }
  return args;
}

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help || !args.input) { usage(); process.exit(args.help ? 0 : 1); }

  const raw = fs.readFileSync(args.input, 'utf8');
  const bookmarks = parse(raw);

  let chunks;
  if (args.size) {
    chunks = chunkBySize(bookmarks, args.size);
  } else if (args.parts) {
    chunks = splitIntoParts(bookmarks, args.parts);
  } else {
    console.error('Specify --size or --parts');
    process.exit(1);
  }

  if (!fs.existsSync(args.out)) fs.mkdirSync(args.out, { recursive: true });

  const ext = args.format === 'json' ? 'json' : args.format === 'csv' ? 'csv' : 'html';
  for (let i = 0; i < chunks.length; i++) {
    const outPath = path.join(args.out, `part-${String(i + 1).padStart(3, '0')}.${ext}`);
    exportToFile(chunks[i], outPath, args.format);
    console.log(`Wrote ${chunks[i].length} bookmarks -> ${outPath}`);
  }
}

main();
