import { describe, it, expect } from 'vitest';
import { RANKS, getRankByLabel, getRankByIndex } from '../../src/configs/card-ranks.js';

describe('card-ranks', () => {
  it('defines exactly 9 ranks', () => {
    expect(RANKS).toHaveLength(9);
  });

  it('ranks are ordered SSS to F', () => {
    const labels = RANKS.map((r) => r.label);
    expect(labels).toEqual(['SSS', 'SS', 'S', 'A', 'B', 'C', 'D', 'E', 'F']);
  });

  it('drop rates sum to 100', () => {
    const total = RANKS.reduce((sum, r) => sum + r.dropRate, 0);
    expect(total).toBeCloseTo(100);
  });

  it('drop rates increase as rank decreases', () => {
    for (let i = 1; i < RANKS.length; i++) {
      expect(RANKS[i].dropRate).toBeGreaterThan(RANKS[i - 1].dropRate);
    }
  });

  it('color indices go from 0 to 8', () => {
    const indices = RANKS.map((r) => r.colorIndex);
    expect(indices).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  describe('getRankByLabel', () => {
    it('returns the correct rank for SSS', () => {
      const rank = getRankByLabel('SSS');
      expect(rank).toBeDefined();
      expect(rank.dropRate).toBe(0.5);
      expect(rank.colorIndex).toBe(0);
    });

    it('returns the correct rank for F', () => {
      const rank = getRankByLabel('F');
      expect(rank).toBeDefined();
      expect(rank.dropRate).toBe(30.5);
      expect(rank.colorIndex).toBe(8);
    });

    it('returns undefined for unknown label', () => {
      expect(getRankByLabel('X')).toBeUndefined();
    });
  });

  describe('getRankByIndex', () => {
    it('returns SSS for index 0', () => {
      const rank = getRankByIndex(0);
      expect(rank.label).toBe('SSS');
    });

    it('returns F for index 8', () => {
      const rank = getRankByIndex(8);
      expect(rank.label).toBe('F');
    });

    it('returns undefined for out-of-range index', () => {
      expect(getRankByIndex(9)).toBeUndefined();
    });
  });
});
