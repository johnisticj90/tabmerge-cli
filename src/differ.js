// Compare two bookmark collections and report additions/removals/changes

function diffBookmarks(oldList, newList) {
  const oldMap = new Map(oldList.map(b => [b.url, b]));
  const newMap = new Map(newList.map(b => [b.url, b]));

  const added = [];
  const removed = [];
  const changed = [];

  for (const [url, bookmark] of newMap) {
    if (!oldMap.has(url)) {
      added.push(bookmark);
    } else {
      const old = oldMap.get(url);
      if (old.title !== bookmark.title || (old.tags || []).join(',') !== (bookmark.tags || []).join(',')) {
        changed.push({ old, new: bookmark });
      }
    }
  }

  for (const [url, bookmark] of oldMap) {
    if (!newMap.has(url)) {
      removed.push(bookmark);
    }
  }

  return { added, removed, changed };
}

function formatDiff(diff) {
  const lines = [];
  lines.push(`+ ${diff.added.length} added, - ${diff.removed.length} removed, ~ ${diff.changed.length} changed`);

  for (const b of diff.added) {
    lines.push(`  + [${b.title || ''}] ${b.url}`);
  }
  for (const b of diff.removed) {
    lines.push(`  - [${b.title || ''}] ${b.url}`);
  }
  for (const c of diff.changed) {
    lines.push(`  ~ [${c.old.title} -> ${c.new.title}] ${c.new.url}`);
  }

  return lines.join('\n');
}

module.exports = { diffBookmarks, formatDiff };
