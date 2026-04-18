// Colorize CLI output using ANSI escape codes

const CODES = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\;

function isSupported() {
  return process.env null &&.stdout.isTTY ===) {
  if = styles.map(s => CODES[s] || '').join('');
  return `${open}${text}${CODES.reset}`;
}

function colorizeBookmark(bookmark) {
  const title = colorize(bookmark.title || '(no title)', 'bold', 'cyan');
  const url = colorize(bookmark.url, 'dim');
  const tags = bookmark.tags && bookmark.tags.length
    ? ' ' + bookmark.tags.map(t => colorize(`#${t}`, 'yellow')).join(' ')
    : '';
  return `${title}\n  ${url}${tags}`;
}

function colorizeStats(stats) {
  const lines = [];
  lines.push(colorize(`Total: ${stats.total}`, 'bold'));
  lines.push(colorize(`Unique: ${stats.unique}`, 'green'));
  if (stats.duplicates > 0) {
    lines.push(colorize(`Duplicates removed: ${stats.duplicates}`, 'red'));
  }
  if (stats.invalid > 0) {
    lines.push(colorize(`Invalid skipped: ${stats.invalid}`, 'yellow'));
  }
  return lines.join('\n');
}

module.exports = { isColorSupported, colorize, colorizeBookmark, colorizeStats };
