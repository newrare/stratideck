/**
 * Rank definitions ordered from highest to lowest.
 * Each rank has a label, drop rate (percentage), and color index within its type palette.
 */
export const RANKS = [
  { label: 'SSS', dropRate: 0.5, colorIndex: 0 },
  { label: 'SS', dropRate: 1, colorIndex: 1 },
  { label: 'S', dropRate: 2, colorIndex: 2 },
  { label: 'A', dropRate: 4, colorIndex: 3 },
  { label: 'B', dropRate: 7, colorIndex: 4 },
  { label: 'C', dropRate: 12, colorIndex: 5 },
  { label: 'D', dropRate: 18, colorIndex: 6 },
  { label: 'E', dropRate: 25, colorIndex: 7 },
  { label: 'F', dropRate: 30.5, colorIndex: 8 },
];

/**
 * Get rank definition by label.
 * @param {string} label - e.g. 'SSS', 'A', 'F'
 * @returns {object|undefined}
 */
export function getRankByLabel(label) {
  return RANKS.find((r) => r.label === label);
}

/**
 * Get rank definition by color index (0 = SSS, 8 = F).
 * @param {number} index
 * @returns {object|undefined}
 */
export function getRankByIndex(index) {
  return RANKS.find((r) => r.colorIndex === index);
}
