import { describe, it, expect } from 'vitest';
import { CARD_REGISTRY, getCardDataById } from '../../src/configs/card-data.js';

describe('card-data', () => {
  it('contains exactly 90 cards', () => {
    expect(CARD_REGISTRY).toHaveLength(90);
  });

  it('all IDs are unique', () => {
    const ids = CARD_REGISTRY.map((c) => c.id);
    expect(new Set(ids).size).toBe(90);
  });

  it('IDs span 1 to 90', () => {
    const ids = CARD_REGISTRY.map((c) => c.id).sort((a, b) => a - b);
    expect(ids[0]).toBe(1);
    expect(ids[ids.length - 1]).toBe(90);
  });

  it('all character names are unique', () => {
    const names = CARD_REGISTRY.map((c) => c.characterName);
    expect(new Set(names).size).toBe(90);
  });

  it('every card has required fields', () => {
    CARD_REGISTRY.forEach((card) => {
      expect(card.id).toBeTypeOf('number');
      expect(card.characterName).toBeTypeOf('string');
      expect(card.characterName.length).toBeGreaterThan(0);
      expect(card.personalityKey).toBeTypeOf('string');
      expect(card.personalityKey.length).toBeGreaterThan(0);
      expect(card.imageKey).toBeTypeOf('string');
      expect(card.imageKey.length).toBeGreaterThan(0);
    });
  });

  describe('getCardDataById', () => {
    it('returns card data for id 1', () => {
      const card = getCardDataById(1);
      expect(card).toBeDefined();
      expect(card.characterName).toBe('Aurelion the Unbound');
    });

    it('returns card data for id 90', () => {
      const card = getCardDataById(90);
      expect(card).toBeDefined();
      expect(card.characterName).toBe('Puddle Inkblot');
    });

    it('returns undefined for non-existent id', () => {
      expect(getCardDataById(0)).toBeUndefined();
      expect(getCardDataById(91)).toBeUndefined();
    });
  });
});
