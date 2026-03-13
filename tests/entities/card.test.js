import { describe, it, expect } from 'vitest';
import { Card } from '../../src/entities/card.js';
import { RANKS } from '../../src/configs/card-ranks.js';
import { CARD_TYPES } from '../../src/configs/card-types.js';
import { CARD_REGISTRY } from '../../src/configs/card-data.js';

describe('Card', () => {
  describe('Card.fromId', () => {
    it('creates a card from id 1 (Overlord SSS)', () => {
      const card = Card.fromId(1);
      expect(card.id).toBe(1);
      expect(card.typeName).toBe('Overlord');
      expect(card.rankLabel).toBe('SSS');
      expect(card.characterName).toBe('Aurelion the Unbound');
      expect(card.dropRate).toBe(0.5);
      expect(card.css).toBeDefined();
    });

    it('creates a card from id 9 (Overlord F)', () => {
      const card = Card.fromId(9);
      expect(card.id).toBe(9);
      expect(card.typeName).toBe('Overlord');
      expect(card.rankLabel).toBe('F');
      expect(card.dropRate).toBe(30.5);
    });

    it('creates a card from id 10 (Warlord SSS)', () => {
      const card = Card.fromId(10);
      expect(card.typeName).toBe('Warlord');
      expect(card.rankLabel).toBe('SSS');
    });

    it('creates a card from id 90 (Assassin F)', () => {
      const card = Card.fromId(90);
      expect(card.typeName).toBe('Assassin');
      expect(card.rankLabel).toBe('F');
      expect(card.characterName).toBe('Puddle Inkblot');
    });

    it('throws for invalid id', () => {
      expect(() => Card.fromId(0)).toThrow('Card ID 0 not found');
      expect(() => Card.fromId(91)).toThrow('Card ID 91 not found');
      expect(() => Card.fromId(100)).toThrow();
    });
  });

  describe('Card properties', () => {
    it('has 3 empty ability slots', () => {
      const card = Card.fromId(1);
      expect(card.abilities).toEqual([null, null, null]);
      expect(card.abilities).toHaveLength(3);
    });

    it('has a descriptionKey based on type', () => {
      const card = Card.fromId(1);
      expect(card.descriptionKey).toBe('card.type.overlord');
    });

    it('has a personalityI18nKey based on personality', () => {
      const card = Card.fromId(1);
      expect(card.personalityI18nKey).toBe('card.personality.tyrannical');
    });

    it('exposes css custom properties (same for all ranks in type)', () => {
      const card = Card.fromId(19); // Guardian SSS
      expect(card.css).toBeDefined();
      expect(card.css['--primary']).toBe(CARD_TYPES[2].css['--primary']);

      const cardF = Card.fromId(27); // Guardian F
      expect(cardF.css['--primary']).toBe(CARD_TYPES[2].css['--primary']);
    });

    it('has a typeLevel', () => {
      const card = Card.fromId(1);
      expect(card.typeLevel).toBe(1);
    });
  });

  describe('Card.getAll', () => {
    it('returns all 90 cards', () => {
      const all = Card.getAll();
      expect(all).toHaveLength(90);
    });

    it('all cards are Card instances', () => {
      const all = Card.getAll();
      all.forEach((card) => {
        expect(card).toBeInstanceOf(Card);
      });
    });

    it('all IDs are present and unique', () => {
      const all = Card.getAll();
      const ids = all.map((c) => c.id);
      expect(new Set(ids).size).toBe(90);
      for (let i = 1; i <= 90; i++) {
        expect(ids).toContain(i);
      }
    });

    it('covers all 10 types', () => {
      const all = Card.getAll();
      const types = new Set(all.map((c) => c.typeName));
      expect(types.size).toBe(10);
    });

    it('covers all 9 ranks per type', () => {
      const all = Card.getAll();
      const rankLabels = RANKS.map((r) => r.label);

      CARD_TYPES.forEach((type) => {
        const cardsOfType = all.filter((c) => c.typeName === type.name);
        expect(cardsOfType).toHaveLength(9);
        const ranks = cardsOfType.map((c) => c.rankLabel);
        rankLabels.forEach((label) => {
          expect(ranks).toContain(label);
        });
      });
    });
  });

  describe('Card.dropRandom', () => {
    it('returns a valid Card instance', () => {
      const card = Card.dropRandom();
      expect(card).toBeInstanceOf(Card);
      expect(card.id).toBeGreaterThanOrEqual(1);
      expect(card.id).toBeLessThanOrEqual(90);
    });

    it('returns cards with valid types and ranks', () => {
      const typeNames = CARD_TYPES.map((t) => t.name);
      const rankLabels = RANKS.map((r) => r.label);

      for (let i = 0; i < 50; i++) {
        const card = Card.dropRandom();
        expect(typeNames).toContain(card.typeName);
        expect(rankLabels).toContain(card.rankLabel);
      }
    });
  });

  describe('consistency', () => {
    it('every registry entry can be instantiated', () => {
      CARD_REGISTRY.forEach((data) => {
        const card = Card.fromId(data.id);
        expect(card.characterName).toBe(data.characterName);
        expect(card.personalityKey).toBe(data.personalityKey);
        expect(card.imageKey).toBe(data.imageKey);
      });
    });
  });
});
