'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const CLI = path.resolve(__dirname, 'deduplicator.cli.js');

function writeTmp(name, content) {
  const p = path.join(os.tmpdir(), name);
  fs.writeFileSync(p, content, 'utf8');
  return p;
}

/**
 * Run the CLI with the given arguments and return stdout as a string.
 */
function runCLI(args, opts = {}) {
  return execFileSync(process.execPath, [CLI, ...args], opts).toString();
}

const NETSCAPE = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<DL><p>
<DT><A HREF="https://example.com" ADD_DATE="1700000000">Example</A>
<DT><A HREF="https://example.com" ADD_DATE="1700000001">Example Dup</A>
<DT><A HREF="https://foo.com" ADD_DATE="1700000002">Foo</A>
</DL><p>`;

describe('deduplicator cli', () => {
  test('deduplicates bookmarks from a single file', () => {
    const f = writeTmp('dedup_input.html', NETSCAPE);
    const out = runCLI([f]);
    const matches = out.match(/HREF=/g) || [];
    expect(matches.length).toBe(2);
  });

  test('merges and deduplicates across two files', () => {
    const f1 = writeTmp('dedup_a.html', NETSCAPE);
    const f2 = writeTmp('dedup_b.html', NETSCAPE);
    const out = runCLI([f1, f2]);
    const matches = out.match(/HREF=/g) || [];
    expect(matches.length).toBe(2);
  });

  test('outputs csv when --format csv', () => {
    const f = writeTmp('dedup_csv.html', NETSCAPE);
    const out = runCLI([f, '--format', 'csv']);
    expect(out).toMatch(/url,title/);
    const lines = out.trim().split('\n');
    expect(lines.length).toBe(3); // header + 2 unique
  });

  test('writes to file with --out', () => {
    const f = writeTmp('dedup_out_in.html', NETSCAPE);
    const outPath = path.join(os.tmpdir(), 'dedup_result.html');
    runCLI([f, '--out', outPath]);
    const content = fs.readFileSync(outPath, 'utf8');
    expect(content).toMatch(/HREF=/);
  });

  test('exits with error on unknown format', () => {
    const f = writeTmp('dedup_fmt.html', NETSCAPE);
    expect(() =>
      runCLI([f, '--format', 'xml'], { stdio: 'pipe' })
    ).toThrow();
  });
});
