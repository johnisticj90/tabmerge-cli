const fs = require('fs');
const os = require('os');
const path = require('path');
const { main } = require('./bookmark-attachments.cli');

function writeTmp(data) {
  const f = path.join(os.tmpdir(), `att-test-${Date.now()}.json`);
  fs.writeFileSync(f, JSON.stringify(data));
  return f;
}

const sample = [
  { url: 'https://example.com', title: 'Example' },
  { url: 'https://other.com', title: 'Other' },
];

test('add attachment', () => {
  const f = writeTmp(sample);
  main(['add', f, '--bookmark', 'https://example.com', '--id', 'a1', '--name', 'shot.png', '--type', 'image/png']);
  const result = JSON.parse(fs.readFileSync(f, 'utf8'));
  expect(result[0].attachments).toHaveLength(1);
  expect(result[0].attachments[0].id).toBe('a1');
  expect(result[1].attachments).toBeUndefined();
});

test('remove attachment', () => {
  const data = [{ url: 'https://example.com', title: 'E', attachments: [{ id: 'a1', name: 'x', type: 'text/plain', addedAt: 1 }] }];
  const f = writeTmp(data);
  main(['remove', f, '--bookmark', 'https://example.com', '--id', 'a1']);
  const result = JSON.parse(fs.readFileSync(f, 'utf8'));
  expect(result[0].attachments).toHaveLength(0);
});

test('clear attachments', () => {
  const data = [{ url: 'https://example.com', title: 'E', attachments: [{ id: 'a1' }, { id: 'a2' }] }];
  const f = writeTmp(data);
  main(['clear', f, '--bookmark', 'https://example.com']);
  const result = JSON.parse(fs.readFileSync(f, 'utf8'));
  expect(result[0].attachments).toHaveLength(0);
});

test('list prints to stdout', () => {
  const data = [{ url: 'https://example.com', title: 'E', attachments: [{ id: 'a1', name: 'f.txt', type: 'text/plain' }] }];
  const f = writeTmp(data);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  main(['list', f, '--bookmark', 'https://example.com']);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('a1'));
  spy.mockRestore();
});

test('exits on missing args', () => {
  const spy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
  expect(() => main([])).toThrow('exit');
  spy.mockRestore();
});
