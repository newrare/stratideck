import { describe, it, expect } from 'vitest';
import { CARD_TYPES, getTypeById, getTypeByName } from '../../src/configs/card-types.js';

describe('card-types', () => {
  it('defines exactly 10 types', () => {
    expect(CARD_TYPES).toHaveLength(10);
  });

  it('each type has 9 colors', () => {
    CARD_TYPES.forEach((type) => {
      expect(type.colors).toHaveLength(9);
    });
  });

  it('each type spans exactly 9 IDs', () => {
    CARD_TYPES.forEach((type) => {
      expect(type.endId - type.startId + 1).toBe(9);
    });
  });

  it('type ID ranges do not overlap', () => {
    const allIds = new Set();
    CARD_TYPES.forEach((type) => {
      for (let id = type.startId; id <= type.endId; id++) {
        expect(allIds.has(id)).toBe(false);
        allIds.add(id);
      }
    });
  });

  it('covers IDs 1 to 90', () => {
    for (let id = 1; id <= 90; id++) {
      const type = getTypeById(id);
      expect(type).toBeDefined();
    }
  });

  describe('getTypeById', () => {
    it('returns Overlord for id 1', () => {
      expect(getTypeById(1).name).toBe('Overlord');
    });

    it('returns Overlord for id 9', () => {
      expect(getTypeById(9).name).toBe('Overlord');
    });

    it('returns Warlord for id 10', () => {
      expect(getTypeById(10).name).toBe('Warlord');
    });

    it('returns Assassin for id 90', () => {
      expect(getTypeById(90).name).toBe('Assassin');
    });

    it('returns undefined for id 0', () => {
      expect(getTypeById(0)).toBeUndefined();
    });

    it('returns undefined for id 91', () => {
      expect(getTypeById(91)).toBeUndefined();
    });
  });

  describe('getTypeByName', () => {
    it('returns the correct type for Overlord', () => {
      const type = getTypeByName('Overlord');
      expect(type).toBeDefined();
      expect(type.startId).toBe(1);
    });

    it('returns the correct type for Assassin', () => {
      const type = getTypeByName('Assassin');
      expect(type).toBeDefined();
      expect(type.startId).toBe(82);
    });

    it('returns undefined for unknown name', () => {
      expect(getTypeByName('Unknown')).toBeUndefined();
    });
  });
});
