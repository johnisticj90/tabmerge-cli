#!/usr/bin/env node
// bookmark-tags.cli.js — CLI for tag management

const fs = require('fs');
const { parse } = require('./parsers/index');
const { listAllTags, renameTags, mergeTags, countByTag } = require('./bookmark-tags');
const { formatJson } = require('./formatter');

function usage() {
  console.log(`Usage: bookmark-tags <command> [options] <file>

Commands:
  list <file>                     List all tags
  count <file>                    Count bookmarks per tag
  rename <old> <new> <file>       Rename a tag
  merge <t1,t2,...> <into> <file> Merge tags into one
`);
}

async function main(argv) {
  const args = argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === '--help') return usage();

  if (cmd === 'list') {
    const src = fs.readFileSync(args[1], 'utf8');
    const bookmarks = parse(src);
    console.log(listAllTags(bookmarks).join('\n'));
    return;
  }

  if (cmd === 'count') {
    const src = fs.readFileSync(args[1], 'utf8');
    const bookmarks = parse(src);
    const counts = countByTag(bookmarks);
    for (const [tag, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
      console.log(`${n}\t${tag}`);
    }
    return;
  }

  if (cmd === 'rename') {
    const [, oldTag, newTag, file] = args;
    const src = fs.readFileSync(file, 'utf8');
    const bookmarks = renameTags(parse(src), oldTag, newTag);
    console.log(formatJson(bookmarks));
    return;
  }

  if (cmd === 'merge') {
    const [, tagsArg, into, file] = args;
    const src = fs.readFileSync(file, 'utf8');
    const bookmarks = mergeTags(parse(src), tagsArg.split(','), into);
    console.log(formatJson(bookmarks));
    return;
  }

  console.error(`Unknown command: ${cmd}`);
  process.exit(1);
}

main(process.argv);
