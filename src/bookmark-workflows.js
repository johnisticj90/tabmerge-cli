/**
 * bookmark-workflows.js
 * Define and run multi-step processing workflows on bookmark collections.
 * A workflow is a named sequence of pipeline steps (filter, sort, tag, deduplicate, etc.)
 */

'use strict';

/**
 * Create a new workflow definition.
 * @param {string} name
 * @param {Array<{step: string, options?: object}>} steps
 * @returns {object}
 */
function createWorkflow(name, steps = []) {
  if (!name || typeof name !== 'string') throw new Error('Workflow name is required');
  return { name, steps: [...steps], createdAt: new Date().toISOString() };
}

/**
 * Add a step to an existing workflow.
 * @param {object} workflow
 * @param {string} step  - step identifier, e.g. 'deduplicate', 'filter', 'sort', 'tag'
 * @param {object} [options]
 * @returns {object} updated workflow (immutable-style)
 */
function addStep(workflow, step, options = {}) {
  return { ...workflow, steps: [...workflow.steps, { step, options }] };
}

/**
 * Remove a step by index.
 * @param {object} workflow
 * @param {number} index
 * @returns {object}
 */
function removeStep(workflow, index) {
  const steps = workflow.steps.filter((_, i) => i !== index);
  return { ...workflow, steps };
}

/**
 * Execute a workflow against a list of bookmarks.
 * Supported steps: deduplicate, filter, sort, tag, validate, sanitize
 * @param {object} workflow
 * @param {Array<object>} bookmarks
 * @param {object} [deps]  - injectable dependencies for testing
 * @returns {Array<object>}
 */
function runWorkflow(workflow, bookmarks, deps = {}) {
  const {
    deduplicate = require('./deduplicator').deduplicate,
    filter      = require('./filter'),
    sort        = require('./sorter').sort,
    applyTags   = require('./tagger').applyTags,
    validate    = require('./validator').validate,
    sanitizeAll = require('./sanitizer').sanitizeAll,
  } = deps;

  let result = [...bookmarks];

  for (const { step, options } of workflow.steps) {
    switch (step) {
      case 'deduplicate':
        result = deduplicate(result);
        break;
      case 'filter': {
        const { type, value } = options;
        if (type === 'domain')    result = filter.filterByDomain(result, value);
        else if (type === 'tag')  result = filter.filterByTag(result, value);
        else if (type === 'query') result = filter.filterByQuery(result, value);
        break;
      }
      case 'sort':
        result = sort(result, options);
        break;
      case 'tag':
        result = applyTags(result, options.tags || []);
        break;
      case 'validate':
        result = validate(result);
        break;
      case 'sanitize':
        result = sanitizeAll(result);
        break;
      default:
        throw new Error(`Unknown workflow step: "${step}"`);
    }
  }

  return result;
}

/**
 * Serialize a workflow to a plain JSON-safe object.
 * @param {object} workflow
 * @returns {object}
 */
function serializeWorkflow(workflow) {
  return JSON.parse(JSON.stringify(workflow));
}

/**
 * Deserialize a workflow from a plain object (e.g. loaded from JSON file).
 * @param {object} raw
 * @returns {object}
 */
function deserializeWorkflow(raw) {
  if (!raw || !raw.name || !Array.isArray(raw.steps)) {
    throw new Error('Invalid workflow format');
  }
  return createWorkflow(raw.name, raw.steps);
}

module.exports = {
  createWorkflow,
  addStep,
  removeStep,
  runWorkflow,
  serializeWorkflow,
  deserializeWorkflow,
};
