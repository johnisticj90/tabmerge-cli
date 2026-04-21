const fs = require('fs');
const os = require('os');
const path = require('path');
const { main } = require('./bookmark-permissions.cli');

function writeTmp(data) {
  const f = path.join(os.tmpdir(), `perms-test-${Date.now()}.json`);
  fs.writeFileSync(f, JSON.stringify(data));
  return f;
}

const bookmarks = [
  { url: 'https://example.com', title: 'Example' },
  { url: 'https://other.com', title: 'Other' },
];

test('set adds permission to matching bookmark', () => {
  const f = writeTmp(bookmarks);
  main(['set', f, 'https://example.com', 'alice', 'editor']);
  const result = JSON.parse(fs.readFileSync(f, 'utf8'));
  expect(result[0].permissions).toEqual({ alice: 'editor' });
  expect(result[1].permissions).toBeUndefined();
});

test('remove deletes a user permission', () => {
  const data = [{ url: 'https://example.com', title: 'Ex', permissions: { alice: 'owner', bob: 'viewer' } }];
  const f = writeTmp(data);
  main(['remove', f, 'https://example.com', 'bob']);
  const result = JSON.parse(fs.readFileSync(f, 'utf8'));
  expect(result[0].permissions).toEqual({ alice: 'owner' });
});

test('list prints permissions to stdout', () => {
  const data = [{ url: 'https://example.com', title: 'Ex', permissions: { alice: 'owner' } }];
  const f = writeTmp(data);
  const lines = [];
  const orig = console.log;
  console.log = (...a) => lines.push(a.join(' '));
  main(['list', f, 'https://example.com']);
  console.log = orig;
  expect(lines).toContain('alice: owner');
});

test('clear removes all permissions', () => {
  const data = [{ url: 'https://example.com', title: 'Ex', permissions: { alice: 'owner' } }];
  const f = writeTmp(data);
  main(['clear', f, 'https://example.com']);
  const result = JSON.parse(fs.readFileSync(f, 'utf8'));
  expect(result[0].permissions).toBeUndefined();
});

test('exits on unknown command', () => {
  const f = writeTmp(bookmarks);
  const orig = process.exit;
  let code;
  process.exit = (c) => { code = c; throw new Error('exit'); };
  expect(() => main(['bogus', f])).toThrow();
  expect(code).toBe(1);
  process.exit = orig;
});
