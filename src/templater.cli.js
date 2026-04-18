#!/usr/bin/env node
/**
 * templater.cli.js — render bookmarks from a file using a template
 *
 * Usage: node src/templater.cli.js <input> [--template <name|string>] [--sep <separator>]
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('./parsers/index');
const { renderAll, resolveTemplate, TEMPLATES } = require('./templater');

function usage() {
  console.log('Usage: templater.cli.js <input> [--template <name|string>] [--sep <separator>]');
  console.log('Built-in templates:', Object.keys(TEMPLATES).join(', '));
  process.exit(0);
}

function parseArgs(argv) {
  const args = { input: null, template: 'plain', sep: '\n' };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '--help' || rest[i] === '-h') usage();
    else if (rest[i] === '--template' || rest[i] === '-t') args.template = rest[++i];
    else if (rest[i] === '--sep') args.sep = rest[++i].replace(/\\n/g, '\n');
    else if (!args.input) args.input = rest[i];
  }
  return args;
}

function main(argv = process.argv, out = process.stdout, err = process.stderr) {
  const args = parseArgs(argv);
  if (!args.input) {
    err.write('Error: input file required\n');
    process.exit(1);
  }

  let raw;
  try {
    raw = fs.readFileSync(path.resolve(args.input), 'utf8');
  } catch (e) {
    err.write(`Error reading file: ${e.message}\n`);
    process.exit(1);
  }

  const bookmarks = parse(raw);
  const template = resolveTemplate(args.template);
  const output = renderAll(template, bookmarks, args.sep);
  out.write(output + '\n');
}

if (require.main === module) main();
module.exports = { main, parseArgs };
