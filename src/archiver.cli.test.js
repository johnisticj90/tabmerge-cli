const fs = require('fs');
const path = require('path');
const os = require('os');
const { main } = require('./archiver.cli');

const sampleJson = JSON.stringify({
  roots: {
    bookmark_bar: {
      children: [
        { type: 'url', name: 'Example', url: 'https://example.com', date_added: '0' },
      ]
    }
  }
});

function writeTmp(name, content) {
  const p = path.join(os.tmpdir(), name);
  fs.writeFileSync(p, content, 'utf8');
  return p;
}

test('main archives a json file to outDir', () => {
  const input = writeTmp('test-bookmarks.json', sampleJson);
  const outDir = path.join(os.tmpdir(), `arc-cli-${Date.now()}`);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  main([input, outDir, 'json']);
  expect(fs.existsSync(path.join(outDir, 'bookmarks.json'))).toBe(true);
  expect(fs.existsSync(path.join(outDir, 'manifest.json'))).toBe(true);
  spy.mockRestore();
  fs.rmSync(outDir, { recursive: true });
});

test('main exits on missing file', () => {
  const exit = jest.spyOn(process, 'exit').mockImplementation((c) => { throw new Error(`exit:${c}`); });
  jest.spyOn(console, 'error').mockImplementation(() => {});
  expect(() => main(['/no/such/file.json', '/tmp/out'])).toThrow('exit:1');
  exit.mockRestore();
  console.error.mockRestore();
});

test('main exits with no args', () => {
  const exit = jest.spyOn(process, 'exit').mockImplementation((c) => { throw new Error(`exit:${c}`); });
  jest.spyOn(console, 'error').mockImplementation(() => {});
  expect(() => main([])).toThrow('exit:1');
  exit.mockRestore();
  console.error.mockRestore();
});
