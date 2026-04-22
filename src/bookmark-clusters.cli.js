#!/usr/bin/env node
/**
 * bookmark-clusters.cli.js
 * CLI: cluster bookmarks from a JSON file and print grouped results.
 *
 * Usage:
 *   node bookmark-clusters.cli.js <file.json> [--threshold 0.25] [--min-size 2]
 */

const fs = require('fs');
const path = require('path');
const { getClusters } = require('./bookmark-clusters');

function usage() {
  console.error('Usage: bookmark-clusters <file.json> [--threshold 0.25] [--min-size 2]');
  process.exit(1);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = { threshold: 0.25, minSize: 1, file: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--threshold' && args[i + 1]) {
      opts.threshold = parseFloat(args[++i]);
    } else if (args[i] === '--min-size' && args[i + 1]) {
      opts.minSize = parseInt(args[++i], 10);
    } else if (!args[i].startsWith('--')) {
      opts.file = args[i];
    }
  }
  return opts;
}

function main(argv = process.argv) {
  const opts = parseArgs(argv);
  if (!opts.file) usage();

  let raw;
  try {
    raw = fs.readFileSync(path.resolve(opts.file), 'utf8');
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
    process.exit(1);
  }

  let bookmarks;
  try {
    bookmarks = JSON.parse(raw);
  } catch (err) {
    console.error(`Invalid JSON: ${err.message}`);
    process.exit(1);
  }

  if (!Array.isArray(bookmarks)) {
    console.error('Expected a JSON array of bookmarks.');
    process.exit(1);
  }

  const clusters = getClusters(bookmarks, opts.threshold)
    .filter(c => c.length >= opts.minSize);

  if (clusters.length === 0) {
    console.log('No clusters found matching criteria.');
    return;
  }

  clusters.forEach((cluster, idx) => {
    console.log(`\nCluster ${idx + 1} (${cluster.length} bookmarks):`);
    cluster.forEach(bm => {
      const tags = (bm.tags || []).join(', ');
      console.log(`  [${bm.title || '(no title)'}] ${bm.url}${tags ? ' — ' + tags : ''}`);
    });
  });
}

if (require.main === module) main();
module.exports = { parseArgs, main };
