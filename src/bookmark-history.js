// Track visit history metadata on bookmarks

function addVisit(bookmark, date = new Date().toISOString()) {
  const visits = bookmark.visits ? [...bookmark.visits] : [];
  visits.push(date);
  return { ...bookmark, visits };
}

function removeVisits(bookmark) {
  const { visits, ...rest } = bookmark;
  return rest;
}

function visitCount(bookmark) {
  return (bookmark.visits || []).length;
}

function lastVisited(bookmark) {
  const visits = bookmark.visits;
  if (!visits || visits.length === 0) return null;
  return visits[visits.length - 1];
}

function firstVisited(bookmark) {
  const visits = bookmark.visits;
  if (!visits || visits.length === 0) return null;
  return visits[0];
}

function filterVisitedAfter(bookmarks, date) {
  return bookmarks.filter(b => {
    const last = lastVisited(b);
    return last && last >= date;
  });
}

function filterNeverVisited(bookmarks) {
  return bookmarks.filter(b => !b.visits || b.visits.length === 0);
}

function sortByLastVisited(bookmarks, desc = true) {
  return [...bookmarks].sort((a, b) => {
    const da = lastVisited(a) || '';
    const db = lastVisited(b) || '';
    return desc ? db.localeCompare(da) : da.localeCompare(db);
  });
}

module.exports = {
  addVisit,
  removeVisits,
  visitCount,
  lastVisited,
  firstVisited,
  filterVisitedAfter,
  filterNeverVisited,
  sortByLastVisited,
};
