'use strict';

const fs = require('fs');
const { setReminder, clearReminder, filterDue, filterUpcoming, sortByReminder, formatReminder } = require('./bookmark-reminders');

function usage() {
  console.error('Usage: bookmark-reminders <command> [options] <file>');
  console.error('Commands:');
  console.error('  set <url> <date>   Set reminder on bookmark with given url');
  console.error('  clear <url>        Clear reminder from bookmark');
  console.error('  due                List due reminders');
  console.error('  upcoming           List upcoming reminders');
  process.exit(1);
}

function main(argv = process.argv.slice(2)) {
  if (argv.length < 2) usage();
  const [cmd, ...rest] = argv;
  const filePath = rest[rest.length - 1];
  const bookmarks = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (cmd === 'set') {
    const [url, date] = rest;
    const updated = bookmarks.map(b => b.url === url ? setReminder(b, date) : b);
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
    console.log(`Reminder set on ${url}`);
  } else if (cmd === 'clear') {
    const [url] = rest;
    const updated = bookmarks.map(b => b.url === url ? clearReminder(b) : b);
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
    console.log(`Reminder cleared on ${url}`);
  } else if (cmd === 'due') {
    filterDue(bookmarks).forEach(b => console.log(formatReminder(b)));
  } else if (cmd === 'upcoming') {
    sortByReminder(filterUpcoming(bookmarks)).forEach(b => console.log(formatReminder(b)));
  } else {
    usage();
  }
}

if (require.main === module) main();
module.exports = { usage, main };
