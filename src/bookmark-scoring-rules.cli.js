#!/usr/bin/env node
/**
 * bookmark-scoring-rules.cli.js
 * CLI: score bookmarks by rules and print top results.
 * Usage: node bookmark-scoring-rules.cli.js <input.json> [--top N]
 */

const fs = require('fs');
const path = require('path');
const { scoreWithRules, topByRules, DEFAULT_RULES } = require('./bookmark-scoring-rules');

function usage() {
  console.error('Usage: bookmark-scoring-rules <input.json> [--top N] [--all]');
  process.exit(1);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  if (!args.length) usage();
  const input = args[0];
  let top = 10;
  let all = false;
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--top' && args[i + 1]) {
      top = parseInt(args[++i], 10);
    } else if (args[i] === '--all') {
      all = true;
    }
  }
  return { input, top, all };
}

function main(argv = process.argv) {
  const { input, top, all } = parseArgs(argv);
  let raw;
  try {
    raw = fs.readFileSync(path.resolve(input), 'utf8');
  } catch (e) {
    console.error(`Cannot read file: ${input}`);
    process.exit(1);
  }
  let bookmarks;
  try {
    bookmarks = JSON.parse(raw);
  } catch (e) {
    console.error('Invalid JSON');
    process.exit(1);
  }
  if (!Array.isArray(bookmarks)) {
    console.error('Expected a JSON array of bookmarks');
    process.exit(1);
  }
  const results = all
    ? scoreWithRules(bookmarks, DEFAULT_RULES).sort((a, b) => b.ruleScore - a.ruleScore)
    : topByRules(bookmarks, top, DEFAULT_RULES);

  for (const bm of results) {
    console.log(`[${bm.ruleScore}] ${bm.title || '(no title)'} — ${bm.url}`);
    if (bm.matchedRules && bm.matchedRules.length) {
      console.log(`    rules: ${bm.matchedRules.join(', ')}`);
    }
  }
  console.log(`\nShowing ${results.length} bookmark(s).`);
}

main();
