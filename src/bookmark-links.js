// bookmark-links.js — manage related/linked bookmarks

function addLink(bookmark, targetUrl, label = '') {
  const links = bookmark.links ? [...bookmark.links] : [];
  if (links.some(l => l.url === targetUrl)) return bookmark;
  return { ...bookmark, links: [...links, { url: targetUrl, label }] };
}

function removeLink(bookmark, targetUrl) {
  if (!bookmark.links) return bookmark;
  return { ...bookmark, links: bookmark.links.filter(l => l.url !== targetUrl) };
}

function hasLink(bookmark, targetUrl) {
  return (bookmark.links || []).some(l => l.url === targetUrl);
}

function getLinks(bookmark) {
  return bookmark.links || [];
}

function clearLinks(bookmark) {
  return { ...bookmark, links: [] };
}

function findLinkedTo(bookmarks, targetUrl) {
  return bookmarks.filter(b => hasLink(b, targetUrl));
}

function buildLinkGraph(bookmarks) {
  const graph = {};
  for (const b of bookmarks) {
    graph[b.url] = (b.links || []).map(l => l.url);
  }
  return graph;
}

module.exports = { addLink, removeLink, hasLink, getLinks, clearLinks, findLinkedTo, buildLinkGraph };
