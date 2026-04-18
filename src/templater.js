/**
 * templater.js — render bookmarks using simple string templates
 */

/**
 * Replace {{key}} placeholders in a template string with bookmark fields.
 * @param {string} template
 * @param {object} bookmark
 * @returns {string}
 */
function renderOne(template, bookmark) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = bookmark[key];
    if (val === undefined || val === null) return '';
    if (Array.isArray(val)) return val.join(', ');
    return String(val);
  });
}

/**
 * Render all bookmarks using the given template, joined by separator.
 * @param {string} template
 * @param {object[]} bookmarks
 * @param {string} [separator='\n']
 * @returns {string}
 */
function renderAll(template, bookmarks, separator = '\n') {
  return bookmarks.map(b => renderOne(template, b)).join(separator);
}

/**
 * Built-in named templates.
 */
const TEMPLATES = {
  plain: '{{title}} <{{url}}>',
  markdown: '[{{title}}]({{url}})',
  html: '<a href="{{url}}">{{title}}</a>',
  csv: '"{{title}}","{{url}}","{{tags}}"',
  org: '[[{{url}}][{{title}}]]',
};

/**
 * Resolve a template string — either a named built-in or a raw template.
 * @param {string} nameOrTemplate
 * @returns {string}
 */
function resolveTemplate(nameOrTemplate) {
  return TEMPLATES[nameOrTemplate] || nameOrTemplate;
}

module.exports = { renderOne, renderAll, resolveTemplate, TEMPLATES };
