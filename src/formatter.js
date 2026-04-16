/**
 * Formats deduplicated bookmarks into various output formats
 */

/**
 * Format bookmarks as Netscape HTML bookmark file
 * @param {Array} bookmarks
 * @returns {string}
 */
export function formatNetscape(bookmarks) {
  const lines = [
    '<!DOCTYPE NETSCAPE-Bookmark-file-1>',
    '<!-- This is an automatically generated file. -->',
    '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
    '<TITLE>Bookmarks</TITLE>',
    '<H1>Bookmarks</H1>',
    '<DL><p>',
  ];

  for (const bookmark of bookmarks) {
    const addDate = bookmark.addDate ? ` ADD_DATE="${bookmark.addDate}"` : '';
    const title = escapeHtml(bookmark.title || '');
    const url = bookmark.url || '';
    lines.push(`    <DT><A HREF="${url}"${addDate}>${title}</A>`);
  }

  lines.push('</DL><p>');
  return lines.join('\n');
}

/**
 * Format bookmarks as JSON array
 * @param {Array} bookmarks
 * @returns {string}
 */
export function formatJson(bookmarks) {
  return JSON.stringify(bookmarks, null, 2);
}

/**
 * Format bookmarks as CSV
 * @param {Array} bookmarks
 * @returns {string}
 */
export function formatCsv(bookmarks) {
  const header = 'url,title,addDate';
  const rows = bookmarks.map((b) => {
    const url = csvEscape(b.url || '');
    const title = csvEscape(b.title || '');
    const addDate = b.addDate || '';
    return `${url},${title},${addDate}`;
  });
  return [header, ...rows].join('\n');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function csvEscape(str) {
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function format(bookmarks, outputFormat) {
  switch ( 'netscape':
      ;
    case 'csv':
      return formatCsv(bookmarks);
    case 'json':
    default:
      return formatJson(bookmarks);
  }
}
