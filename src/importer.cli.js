#!/usr/bin/env node
const { collectBookmarks } = require('./importer');
const { formatStats } = require('./stats');
const { computeStats } = require('./stats');
const { formatJson } = require('./formatter');

function usage() {
  console.log('Usage: importer-cli [options] <file1> [file2 ...]');
  console.log('Options:');
  console.log('  --validate    Validate bookmarks after import');
  console.log('  --strict      Exit on first error');
  console.log('  --stats       Print stats instead of bookmarks');
  console.log('  --json        Output as JSON');
}

function main(argv = process.argv.slice(2)) {
  if (argv.length === 0 || argv.includes('--help')) {
    usage();
    return;
  }

  const options = {
    validate: argv.includes('--validate'),
    strict: argv.includes('--strict'),
  };
  const showStats = argv.includes('--stats');
  const asJson = argv.includes('--json');
  const files = argv.filter(a => !a.startsWith('--'));

  try {
    const bookmarks = collectBookmarks(files, options);
    if (showStats) {
      console.log(formatStats(computeStats(bookmarks)));
    } else if (asJson) {
      console.log(formatJson(bookmarks));
    } else {
      bookmarks.forEach(b => console.log(`${b.url}\t${b.title || ''}\t${(b.tags || []).join(',')}` ));
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

if (require.main === module) main();
module.exports = { main, usage };
