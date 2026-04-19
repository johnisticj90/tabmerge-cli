const {
  addAttachment,
  removeAttachment,
  filterWithAttachments,
  filterWithoutAttachments,
  countAttachments,
} = require('./bookmark-attachments');

const bookmarks = [
  { url: 'https://a.com', title: 'A' },
  { url: 'https://b.com', title: 'B' },
  { url: 'https://c.com', title: 'C' },
];

test('full attach/detach lifecycle', () => {
  const att = { id: 'doc1', name: 'report.pdf', type: 'application/pdf' };

  let updated = bookmarks.map((b, i) =>
    i === 0 ? addAttachment(b, att) : b
  );

  expect(filterWithAttachments(updated)).toHaveLength(1);
  expect(filterWithoutAttachments(updated)).toHaveLength(2);
  expect(countAttachments(updated[0])).toBe(1);

  updated = updated.map(b => b.url === 'https://a.com' ? removeAttachment(b, 'doc1') : b);
  expect(filterWithAttachments(updated)).toHaveLength(0);
});

test('multiple attachments on one bookmark', () => {
  const atts = [
    { id: 'x1', name: 'img.png', type: 'image/png' },
    { id: 'x2', name: 'doc.pdf', type: 'application/pdf' },
    { id: 'x3', name: 'data.csv', type: 'text/csv' },
  ];
  const b = atts.reduce((acc, a) => addAttachment(acc, a), bookmarks[0]);
  expect(countAttachments(b)).toBe(3);
  const removed = removeAttachment(b, 'x2');
  expect(countAttachments(removed)).toBe(2);
  expect(removed.attachments.map(a => a.id)).toEqual(['x1', 'x3']);
});
