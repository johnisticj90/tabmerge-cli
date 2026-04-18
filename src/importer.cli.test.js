const fs = require('fs');
const os = require('os');
const path = require('path');
const { main } = require('./importer.cli');

function writeTmp(name, content) {
  const p = path.join(os.tmpdir(), name);
  fs.writeFileSync(p, content, 'utf8');
  return p;
}

const csv = `url,title,tags\nhttps://example.com,Example,news\nhttps://foo.bar,Foo,`;

test('main prints help with no args', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  main([]);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('Usage'));
  spy.mockRestore();
});

test('main prints bookmarks from csv', () => {
  const p = writeTmp('icli_test.csv', csv);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  main([p]);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('example.com'));
  spy.mockRestore();
});

test('main --json outputs json', () => {
  const p = writeTmp('icli_json.csv', csv);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  main(['--json', p]);
  const output = spy.mock.calls[0][0];
  expect(() => JSON.parse(output)).not.toThrow();
  spy.mockRestore();
});

test('main --stats outputs stats', () => {
  const p = writeTmp('icli_stats.csv', csv);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  main(['--stats', p]);
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

test('main exits on missing file with strict', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
  expect(() => main(['--strict', '/no/such/file.csv'])).toThrow('exit');
  spy.mockRestore();
  exit.mockRestore();
});
