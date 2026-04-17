/**
 * Groups bookmarks by a given key (domain, tag, date)
 */

function groupByDomain(bookmarks) {
  const groups = {};
  for (const bm of bookmarks) {
    let domain = '';
    try {
      domain = new URL(bm.url).hostname.replace(/^www\./, '');
    } catch {
      domain = 'invalid';
    }
    if (!groups[domain]) groups[domain] = [];
    groups[domain].push(bm);
  }
  return groups;
}

function groupByTag(bookmarks) {
  const groups = {};
  for (const bm of bookmarks) {
    const tags = bm.tags && bm.tags.length ? bm.tags : ['untagged'];
    for (const tag of tags) {
      if (!groups[tag]) groups[tag] = [];
      groups[tag].push(bm);
    }
  }
  return groups;
}

function groupByDate(bookmarks) {
  const groups = {};
  for (const bm of bookmarks) {
    let key = 'unknown';
    if (bm.addDate) {
      const d = new Date(typeof bm.addDate === 'number' ? bm.addDate * 1000 : bm.addDate);
      if (!isNaN(d)) key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }
    if (!groups[key]) groups[key] = [];
    groups[key].push(bm);
  }
  return groups;
}

function group(bookmarks, by) {
  switch (by) {
    case 'domain': return groupByDomain(bookmarks);
    case 'tag':    return groupByTag(bookmarks);
    case 'date':   return groupByDate(bookmarks);
    default: throw new Error(`Unknown group key: ${by}`);
  }
}

module.exports = { groupByDomain, groupByTag, groupByDate, group };
