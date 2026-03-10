import { describe, it, expect } from 'vitest';
import { clamp, randomInt, shuffle } from '../../src/utils/math.js';

describe('clamp', () => {
  it('returns the value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps to min when below range', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it('clamps to max when above range', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe('randomInt', () => {
  it('returns a value between min and max inclusive', () => {
    for (let i = 0; i < 100; i++) {
      const result = randomInt(1, 6);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(6);
    }
  });
});

describe('shuffle', () => {
  it('returns an array of the same length', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle([...arr]);
    expect(result).toHaveLength(arr.length);
  });

  it('contains all original elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle([...arr]);
    expect(result.sort()).toEqual(arr.sort());
  });
});
