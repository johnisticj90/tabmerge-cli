import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const NETSCAPE_FIXTURE = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
://example.com" ADD_DATE;
ode src/cli.js ${argsfunction runWithExitCode(args) {
   {
    const stdoutSync(`node src/cli.js ${args}`, { encoding: 'utf-8' });
    return { stdout, exitCode: 0 };
  } catch (err) {
    return { stdout: err.stdout, stderr: err.stderr, exitCode: err.status };
  }
}

describe('cli', () => {
  let tmpFile;

  beforeEach(() => {
    tmpFile = join(tmpdir(), `tabmerge-test-${Date.now()}.html`);
    writeFileSync(tmpFile, NETSCAPE_FIXTURE, 'utf-8');
  });

  afterEach(() => {
    if (existsSync(tmpFile)) unlinkSync(tmpFile);
  });

  it('outputs netscape format by default', () => {
    const out = run(tmpFile);
    expect(out).toContain('NETSCAPE-Bookmark-file-1');
    expect(out).toContain('https://example.com');
  });

  it('outputs csv format when specified', () => {
    const out = run(`-f csv ${tmpFile}`);
    expect(out).toContain('url,title,addDate');
    expect(out).toContain('https://example.com');
  });

  it('outputs json format when specified', () => {
    const out = run(`-f json ${tmpFile}`);
    const parsed = JSON.parse(out);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0]).toHaveProperty('url');
  });

  it('merges multiple files', () => {
    const out = run(`-f json ${tmpFile} ${tmpFile}`);
    const parsed = JSON.parse(out);
    // dedup should collapse duplicates
    expect(parsed.length).toBe(2);
  });

  it('writes to output file when -o is specified', () => {
    const outFile = join(tmpdir(), `tabmerge-out-${Date.now()}.html`);
    try {
      run(`-o ${outFile} ${tmpFile}`);
      expect(existsSync(outFile)).toBe(true);
    } finally {
      if (existsSync(outFile)) unlinkSync(outFile);
    }
  });

  it('exits with non-zero code when given a nonexistent file', () => {
    const { exitCode } = runWithExitCode('/nonexistent/path/file.html');
    expect(exitCode).toBeGreaterThan(0);
  });
});
