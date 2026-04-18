#!/usr/bin/env node
// Demo / manual test for colorizer output

const { colorize, colorizeBookmark, colorizeStats } = require('./colorizer');

function main() {
  console.log(colorize('tabmerge-cli colorizer demo', 'bold', 'magenta'));
  console.log();

  const bookmarks = [
    { title: 'GitHub', url: 'https://github.com', tags: ['dev', 'git'] },
    { title: 'Hacker News', url: 'https://news.ycombinator.com', tags: ['news'] },
    { url: 'https://example.com', tags: [] },
  ];

  console.log(colorize('Bookmarks:', 'bold'));
  for (const bm of bookmarks) {
    console.log(colorizeBookmark(bm));
    console.log();
  }

  const stats = { total: 42, unique: 38, duplicates: 4, invalid: 0 };
  console.log(colorize('Stats:', 'bold'));
  console.log(colorizeStats(stats));
}

main();
