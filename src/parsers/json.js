/**
 * Parse Chrome/Chromium JSON bookmark exports
 */

function extractBookmarks(node, bookmarks = []) {
  if (node.type === 'url') {
    bookmarks.push({
      title: node.name || '',
      url: node.url,
      addDate: node.date_added ? Math.floor(parseInt(node.date_added) / 1000000) : null,
    });
  }

  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      extractBookmarks(child, bookmarks);
    }
  }

  return bookmarks;
}

/**
 * @param {string} input - raw JSON string from Chrome bookmark export
 * @returns {Array<{title: string, url: string, addDate: number|null}>}
 */
function parseJson(input) {
  let data;
  try {
    data = JSON.parse(input);
  } catch (err) {
    throw new Error(`Invalid JSON bookmark file: ${err.message}`);
  }

  if (!data.roots) {
    throw new Error('Unrecognized JSON bookmark format: missing "roots" key');
  }

  const bookmarks = [];

  for (const rootKey of Object.keys(data.roots)) {
    extractBookmarks(data.roots[rootKey], bookmarks);
  }

  return bookmarks;
}

module.exports = { parseJson };
