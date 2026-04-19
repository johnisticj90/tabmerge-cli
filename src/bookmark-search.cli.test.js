const fs = require('fs');
const os = require('os');
const path = require('path');
const { main } = require('./bookmark-search.cli');

function writeTmp(content, ext = '.html') {
  const f = path.join(os.tmpdir(), `bms-test-${Date.now()}${ext}`);
  fs.writeFileSync(f, content);
  return f;
}

const netscapeContent = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<DL><p>
  <DT><A HREF="https://github.com" ADD_DATE="1700000000" TAGS="dev,code">GitHub</A>
  <DT><A HREF="https://google.com" ADD_DATE="1700000001" TAGS="search">Google</A>
  <DT><A HREF="https://developer.mozilla.org" ADD_DATE="1700000002" TAGS="dev,docs">MDN</A>
</DL>`;

test('main prints help when no args', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  main([]);
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

test('main searches and outputs results', () => {
  const f = writeTmp(netscapeContent);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  main(['dev', f]);
  const output = spy.mock.calls.map(c => c[0]).join('\n');
  expect(output).toContain('github.com');
  spy.mockRestore();
  fs.unlinkSync(f);
});

test('main --any returns OR results', () => {
  const f = writeTmp(netscapeContent);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  main(['--any', 'github', 'google', f]);
  const output = spy.mock.calls.map(c => c[0]).join('\n');
  expect(output).toContain('github.com');
  expect(output).toContain('google.com');
  spy.mockRestore();
  fs.unlinkSync(f);
});

test('main exits on missing file args', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
  expect(() => main(['onlyoneterm'])).toThrow('exit');
  spy.mockRestore();
  exit.mockRestore();
});
