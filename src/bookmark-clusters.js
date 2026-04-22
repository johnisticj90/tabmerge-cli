/**
 * bookmark-clusters.js
 * Groups bookmarks into semantic clusters based on URL/title similarity.
 */

/**
 * Extract a simple domain key from a URL.
 * @param {string} url
 * @returns {string}
 */
function domainKey(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * Tokenize a string into lowercase words.
 * @param {string} str
 * @returns {string[]}
 */
function tokenize(str) {
  return (str || '').toLowerCase().match(/[a-z0-9]+/g) || [];
}

/**
 * Compute Jaccard similarity between two token sets.
 * @param {string[]} a
 * @param {string[]} b
 * @returns {number} 0..1
 */
function jaccard(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter(t => setB.has(t)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Assign each bookmark to a cluster id (0-based index of first similar bookmark).
 * @param {object[]} bookmarks
 * @param {number} [threshold=0.25]
 * @returns {Map<number, object[]>} clusterIndex -> bookmarks
 */
function clusterBookmarks(bookmarks, threshold = 0.25) {
  const assignments = new Array(bookmarks.length).fill(-1);
  const centroids = [];

  bookmarks.forEach((bm, i) => {
    const tokens = [
      ...tokenize(bm.title),
      ...tokenize(domainKey(bm.url)),
      ...(bm.tags || []).flatMap(t => tokenize(t))
    ];

    let bestCluster = -1;
    let bestScore = threshold;

    centroids.forEach((centroidTokens, ci) => {
      const score = jaccard(tokens, centroidTokens);
      if (score > bestScore) {
        bestScore = score;
        bestCluster = ci;
      }
    });

    if (bestCluster === -1) {
      bestCluster = centroids.length;
      centroids.push(tokens);
    }

    assignments[i] = bestCluster;
  });

  const clusters = new Map();
  bookmarks.forEach((bm, i) => {
    const cid = assignments[i];
    if (!clusters.has(cid)) clusters.set(cid, []);
    clusters.get(cid).push(bm);
  });

  return clusters;
}

/**
 * Return clusters as a plain array of arrays, sorted by size descending.
 * @param {object[]} bookmarks
 * @param {number} [threshold]
 * @returns {object[][]}
 */
function getClusters(bookmarks, threshold) {
  const map = clusterBookmarks(bookmarks, threshold);
  return [...map.values()].sort((a, b) => b.length - a.length);
}

module.exports = { domainKey, tokenize, jaccard, clusterBookmarks, getClusters };
