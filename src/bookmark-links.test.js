const { addLink, removeLink, hasLink, getLinks, clearLinks, findLinkedTo, buildLinkGraph } = require('./bookmark-links');

const base = { url: 'https://example.com', title: 'Example' };

test('addLink adds a link', () => {
  const b = addLink(base, 'https://other.com', 'Other');
  expect(b.links).toHaveLength(1);
  expect(b.links[0]).toEqual({ url: 'https://other.com', label: 'Other' });
});

test('addLink does not duplicate', () => {
  const b = addLink(addLink(base, 'https://other.com'), 'https://other.com');
  expect(b.links).toHaveLength(1);
});

test('addLink preserves existing links', () => {
  const b1 = addLink(base, 'https://a.com');
  const b2 = addLink(b1, 'https://b.com');
  expect(b2.links).toHaveLength(2);
});

test('removeLink removes by url', () => {
  const b = addLink(base, 'https://other.com');
  const b2 = removeLink(b, 'https://other.com');
  expect(b2.links).toHaveLength(0);
});

test('removeLink on bookmark with no links', () => {
  expect(removeLink(base, 'https://x.com').links).toEqual([]);
});

test('hasLink returns true when link exists', () => {
  const b = addLink(base, 'https://other.com');
  expect(hasLink(b, 'https://other.com')).toBe(true);
});

test('hasLink returns false when missing', () => {
  expect(hasLink(base, 'https://other.com')).toBe(false);
});

test('getLinks returns empty array by default', () => {
  expect(getLinks(base)).toEqual([]);
});

test('clearLinks removes all links', () => {
  const b = addLink(addLink(base, 'https://a.com'), 'https://b.com');
  expect(clearLinks(b).links).toEqual([]);
});

test('findLinkedTo finds bookmarks linking to url', () => {
  const b1 = addLink({ url: 'https://a.com', title: 'A' }, 'https://target.com');
  const b2 = { url: 'https://b.com', title: 'B' };
  expect(findLinkedTo([b1, b2], 'https://target.com')).toEqual([b1]);
});

test('buildLinkGraph builds adjacency map', () => {
  const b1 = addLink({ url: 'https://a.com', title: 'A' }, 'https://b.com');
  const b2 = { url: 'https://b.com', title: 'B' };
  const graph = buildLinkGraph([b1, b2]);
  expect(graph['https://a.com']).toEqual(['https://b.com']);
  expect(graph['https://b.com']).toEqual([]);
});
