/**
 * bookmark-custom-fields.js
 * Manage arbitrary custom fields on bookmarks.
 */

function setField(bookmark, key, value) {
  if (!key || typeof key !== 'string') throw new Error('key must be a non-empty string');
  const fields = bookmark.customFields ? { ...bookmark.customFields } : {};
  fields[key] = value;
  return { ...bookmark, customFields: fields };
}

function getField(bookmark, key) {
  return bookmark.customFields ? bookmark.customFields[key] : undefined;
}

function removeField(bookmark, key) {
  if (!bookmark.customFields) return bookmark;
  const fields = { ...bookmark.customFields };
  delete fields[key];
  return { ...bookmark, customFields: fields };
}

function hasField(bookmark, key) {
  return !!(bookmark.customFields && Object.prototype.hasOwnProperty.call(bookmark.customFields, key));
}

function clearFields(bookmark) {
  const b = { ...bookmark };
  delete b.customFields;
  return b;
}

function listFields(bookmark) {
  return bookmark.customFields ? Object.keys(bookmark.customFields) : [];
}

function filterByField(bookmarks, key, value) {
  return bookmarks.filter(b => hasField(b, key) && getField(b, key) === value);
}

function filterHavingField(bookmarks, key) {
  return bookmarks.filter(b => hasField(b, key));
}

function applyFieldToAll(bookmarks, key, value) {
  return bookmarks.map(b => setField(b, key, value));
}

module.exports = {
  setField,
  getField,
  removeField,
  hasField,
  clearFields,
  listFields,
  filterByField,
  filterHavingField,
  applyFieldToAll,
};
