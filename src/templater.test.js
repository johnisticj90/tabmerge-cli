const { renderOne, renderAll, resolveTemplate, TEMPLATES } = require('./templater');

const bookmark = {
  title: 'Example Site',
  url: 'https://example.com',
  tags: ['news', 'tech'],
  date: '2024-01-15',
};

describe('renderOne', () => {
  test('replaces known placeholders', () => {
    const result = renderOne('{{title}} - {{url}}', bookmark);
    expect(result).toBe('Example Site - https://example.com');
  });

  test('joins array values with comma', () => {
    const result = renderOne('{{tags}}', bookmark);
    expect(result).toBe('news, tech');
  });

  test('replaces missing keys with empty string', () => {
    const result = renderOne('{{title}} {{missing}}', bookmark);
    expect(result).toBe('Example Site ');
  });

  test('handles null values gracefully', () => {
    const result = renderOne('{{title}}', { title: null });
    expect(result).toBe('');
  });
});

describe('renderAll', () => {
  const bookmarks = [
    { title: 'A', url: 'https://a.com' },
    { title: 'B', url: 'https://b.com' },
  ];

  test('renders each bookmark and joins with newline by default', () => {
    const result = renderAll('{{title}}', bookmarks);
    expect(result).toBe('A\nB');
  });

  test('uses custom separator', () => {
    const result = renderAll('{{title}}', bookmarks, ' | ');
    expect(result).toBe('A | B');
  });

  test('returns empty string for empty array', () => {
    expect(renderAll('{{title}}', [])).toBe('');
  });
});

describe('resolveTemplate', () => {
  test('resolves named template', () => {
    expect(resolveTemplate('markdown')).toBe(TEMPLATES.markdown);
  });

  test('returns raw string if not a known name', () => {
    const custom = '{{title}} => {{url}}';
    expect(resolveTemplate(custom)).toBe(custom);
  });

  test('all built-in templates contain url placeholder', () => {
    Object.values(TEMPLATES).forEach(t => {
      expect(t).toContain('{{url}}');
    });
  });
});
