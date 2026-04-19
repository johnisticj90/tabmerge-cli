// Snapshot bookmarks list at a point in time

function createSnapshot(bookmarks, label = '') {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    label: label || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    bookmarks: bookmarks.map(b => ({ ...b })),
  };
}

function restoreSnapshot(snapshot) {
  return snapshot.bookmarks.map(b => ({ ...b }));
}

function diffSnapshot(snapshotA, snapshotB) {
  const urlsA = new Set(snapshotA.bookmarks.map(b => b.url));
  const urlsB = new Set(snapshotB.bookmarks.map(b => b.url));
  const added = snapshotB.bookmarks.filter(b => !urlsA.has(b.url));
  const removed = snapshotA.bookmarks.filter(b => !urlsB.has(b.url));
  return { added, removed };
}

function listSnapshots(snapshots) {
  return snapshots.map(s => ({
    id: s.id,
    label: s.label,
    createdAt: s.createdAt,
    count: s.bookmarks.length,
  }));
}

function findSnapshot(snapshots, id) {
  return snapshots.find(s => s.id === id) || null;
}

function deleteSnapshot(snapshots, id) {
  return snapshots.filter(s => s.id !== id);
}

module.exports = {
  createSnapshot,
  restoreSnapshot,
  diffSnapshot,
  listSnapshots,
  findSnapshot,
  deleteSnapshot,
};
