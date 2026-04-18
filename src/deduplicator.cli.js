#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('./parsers/index');
const { deduplicate } = require('./deduplicator');
const { formatNetscape } = require('./formatter');

const usage = `
Usage: dedup-cli <input1> [input2 ...] [options]

Options:
  --format <fmt>   Output format: netscape, json, csv (default: netscape)
  --out <file>     Write output to file instead of stdout
  --help           Show this help
`.trim();

function main(argv) {
  const args = argv.slice(2);
  if (args.includes('--help') || args.length === 0) {
    console.log(usage);
    process.exit(0);
  }

  const inputs = [];
  let format = 'netscape';
  let outFile = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--format') {
      format = args[++i];
    } else if (args[i] === '--out') {
      outFile = args[++i];
    } else {
      inputs.push(args[i]);
    }
  }

  if (inputs.length === 0) {
    console.error('Error: no input files provided');
    process.exit(1);
  }

  let all = [];
  for (const file of inputs) {
    const content = fs.readFileSync(file, 'utf8');
    const bookmarks = parse(content);
    all = all.concat(bookmarks);
  }

  const deduped = deduplicate(all);

  const { formatJson, formatCsv } = require('./formatter');
  const formatters = { netscape: formatNetscape, json: formatJson, csv: formatCsv };
  const formatter = formatters[format];
  if (!formatter) {
    console.error(`Unknown format: ${format}`);
    process.exit(1);
  }

  const output = formatter(deduped);
  if (outFile) {
    fs.writeFileSync(outFile, output, 'utf8');
    console.error(`Wrote ${deduped.length} bookmarks to ${outFile}`);
  } else {
    process.stdout.write(output);
  }
}

main(process.argv);
