const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

function writeTmp(content) {
  const p = path.join(os.tmpdir(), `tags-test-${Date.now()}.json`);
  fs.writeFileSync(p, content);
  return p;
}

const sampleJson = JSON.stringify([
  { url: 'https://a.com', title: 'A', tags: ['js', 'dev'] },
  { url: 'https://b.com', title: 'B', tags: ['js', 'css'] },
  { url: 'https://c.com', title: 'C', tags: ['css'] }
]);

const cli = path.resolve(__dirname, 'bookmark-tags.cli.js');
const run = (args) => execSync(`node ${cli} ${args}`, { encoding: 'utf8' });

describe('bookmark-tags CLI', () => {
  let tmp;
  beforeEach(() => { tmp = writeTmp(sampleJson); });
  afterEach(() => fs.unlinkSync(tmp));

  it('list prints all tags sorted', () => {
    const out = run(`list ${tmp}`);
    expect(out.trim()).toBe('css\ndev\njs');
  });

  it('count outputs counts', () => {
    const out = run(`count ${tmp}`);
    expect(out).toContain('js');
    expect(out).toContain('css');
  });

  it('rename renames a tag', () => {
    const out = run(`rename js javascript ${tmp}`);
    const parsed = JSON.parse(out);
    expect(parsed.every(b => !b.tags.includes('js'))).toBe(true);
  });

  it('merge merges tags', () => {
    const out = run(`merge js,css web ${tmp}`);
    const parsed = JSON.parse(out);
    parsed.forEach(b => {
      expect(b.tags).not.toContain('js');
      expect(b.tags).not.toContain('css');
    });
  });
});
