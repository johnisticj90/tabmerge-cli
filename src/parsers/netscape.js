/**
 * Parser for Netscape HTML bookmark format
 * Used by Chrome, Firefox, Edge for bookmark exports
 */

const { JSDOM } = require('jsdom');

/**
 * Parse a Netscape HTML bookmark file into a flat array of bookmark objects
 * @param {string} html - Raw HTML content of the bookmark file
 * @returns {Array<{title: string, url: string, addDate?: number, tags?: string[]}>}
 */
function parseNetscape(html) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const anchors = doc.querySelectorAll('a');
  const bookmarks = [];

  for (const anchor of anchors) {
    const url = anchor.href ? anchor.href.trim() : null;
    const title = anchor.textContent ? anchor.textContent.trim() : '';

    if (!url || url === 'about:blank') continue;

    const bookmark = { title, url };

    const addDate = anchor.getAttribute('add_date');
    if (addDate) {
      bookmark.addDate = parseInt(addDate, 10);
    }

    const tags = anchor.getAttribute('tags');
    if (tags) {
      bookmark.tags = tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    bookmarks.push(bookmark);
  }

  return bookmarks;
}

module.exports = { parseNetscape };
