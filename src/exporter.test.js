import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supportedFormats, resolveOutputPath, exportToString, exportToFile } from './exporter.js';
import * as fs from 'fs';

vi.mock('fs');

const bookmarks = [
  { url: 'https://example.com', title: 'Example', tags: [], addDate: null },
  { url: 'https://foo.org',     title: 'Foo',     tags: ['dev'], addDate: null },
];

describe('supportedFormats', () => {
  it('returns netscape, json, csv', () => {
    expect(supportedFormats()).toEqual(expect.arrayContaining(['netscape', 'json', 'csv']));
  });
});

describe('resolveOutputPath', () => {
  it('appends extension when missing', () => {
    expect(resolveOutputPath('out', 'json')).toBe('out.json');
    expect(resolveOutputPath('out', 'netscape')).toBe('out.html');
    expect(resolveOutputPath('out', 'csv')).toBe('out.csv');
  });

  it('does not double-append extension', () => {
    expect(resolveOutputPath('out.json', 'json')).toBe('out.json');
    expect(resolveOutputPath('out.html', 'netscape')).toBe('out.html');
  });

  it('throws on unsupported format', () => {
    expect(() => resolveOutputPath('out', 'xml')).toThrow('Unsupported format: xml');
  });
});

describe('exportToString', () => {
  it('returns a non-empty string for each format', () => {
    for (const fmt of ['netscape', 'json', 'csv']) {
      const result = exportToString(bookmarks, fmt);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    }
  });

  it('throws on unsupported format', () => {
    expect(() => exportToString(bookmarks, 'xml')).toThrow();
  });

  it('json output is valid JSON containing bookmarks', () => {
    const result = exportToString(bookmarks, 'json');
    const parsed = JSON.parse(result);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(2);
  });
});

describe('exportToFile', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('writes content to resolved path', () => {
    const path = exportToFile(bookmarks, 'output', 'csv');
    expect(path).toBe('output.csv');
    expect(fs.writeFileSync).toHaveBeenCalledWith('output.csv', expect.any(String), 'utf8');
  });

  it('returns the resolved path', () => {
    const path = exportToFile(bookmarks, 'result.json', 'json');
    expect(path).toBe('result.json');
  });
});
