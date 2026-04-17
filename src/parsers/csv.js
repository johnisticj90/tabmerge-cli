/**
 * Parse CSV bookmark exports
 * Supports common formats: url, title, [description], [tags], [date]
 */

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function parseCsv(content) {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map(h => h.trim().toLowerCase());

  const urlIdx = headers.findIndex(h => h === 'url' || h === 'href' || h === 'link');
  const titleIdx = headers.findIndex(h => h === 'title' || h === 'name');
  const tagsIdx = headers.findIndex(h => h === 'tags' || h === 'tag');
  const descIdx = headers.findIndex(h => h === 'description' || h === 'desc' || h === 'notes');
  const dateIdx = headers.findIndex(h => h === 'date' || h === 'added' || h === 'created');

  if (urlIdx === -1) throw new Error('CSV missing url column');

  const bookmarks = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = parseCsvLine(line);
    const url = cols[urlIdx]?.trim();
    if (!url) continue;
    bookmarks.push({
      url,
      title: titleIdx !== -1 ? cols[titleIdx]?.trim() || '' : '',
      tags: tagsIdx !== -1 ? (cols[tagsIdx]?.trim() || '').split(/[;|]/).map(t => t.trim()).filter(Boolean) : [],
      description: descIdx !== -1 ? cols[descIdx]?.trim() || '' : '',
      addDate: dateIdx !== -1 ? cols[dateIdx]?.trim() || null : null,
    });
  }
  return bookmarks;
}

module.exports = { parseCsv, parseCsvLine };
