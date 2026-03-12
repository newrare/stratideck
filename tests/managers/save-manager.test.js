import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SaveManager } from '../../src/managers/save-manager.js';

// Mock localStorage for Node test environment.
const store = {};
const localStorageMock = {
  getItem: (key) => store[key] ?? null,
  setItem: (key, value) => { store[key] = String(value); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
};
globalThis.localStorage = localStorageMock;

describe('SaveManager', () => {
  /** @type {SaveManager} */
  let sm;

  beforeEach(() => {
    localStorage.clear();
    sm = new SaveManager();
    sm.load();
  });

  // ─── Persistence ────────────────────────────────────────────

  describe('persistence', () => {
    it('starts with default empty save data', () => {
      expect(sm.get('gameInProgress')).toBe(false);
      expect(sm.getStats()).toEqual({
        gamesStarted: 0,
        battlesPlayed: 0,
        victories: 0,
        defeats: 0,
      });
    });

    it('persists data to localStorage on save()', () => {
      sm.set('gameInProgress', true);
      const stored = JSON.parse(localStorage.getItem('stratideck_save'));
      expect(stored.gameInProgress).toBe(true);
    });

    it('restores data from localStorage on load()', () => {
      sm.set('gameInProgress', true);
      sm.incrementStat('victories');

      const sm2 = new SaveManager();
      sm2.load();
      expect(sm2.get('gameInProgress')).toBe(true);
      expect(sm2.getStats().victories).toBe(1);
    });

    it('reset() clears all data and persists', () => {
      sm.set('gameInProgress', true);
      sm.incrementStat('gamesStarted');
      sm.unlockCard(5);

      sm.reset();

      expect(sm.get('gameInProgress')).toBe(false);
      expect(sm.getStats().gamesStarted).toBe(0);
      expect(sm.isCardUnlocked(5)).toBe(false);

      // Also clears localStorage
      const stored = JSON.parse(localStorage.getItem('stratideck_save'));
      expect(stored.gameInProgress).toBe(false);
    });

    it('handles corrupted localStorage gracefully', () => {
      localStorage.setItem('stratideck_save', '{broken json');
      const sm2 = new SaveManager();
      sm2.load();
      expect(sm2.get('gameInProgress')).toBe(false);
    });

    it('handles outdated version by resetting', () => {
      localStorage.setItem('stratideck_save', JSON.stringify({ version: 0, gameInProgress: true }));
      const sm2 = new SaveManager();
      sm2.load();
      expect(sm2.get('gameInProgress')).toBe(false);
    });
  });

  // ─── Observable ─────────────────────────────────────────────

  describe('observable (get/set/on/clear)', () => {
    it('stores and retrieves values', () => {
      sm.set('gameInProgress', true);
      expect(sm.get('gameInProgress')).toBe(true);
    });

    it('returns undefined for unknown keys', () => {
      expect(sm.get('unknown')).toBeUndefined();
    });

    it('notifies listeners on change', () => {
      let received = null;
      sm.on('gameInProgress', (val) => {
        received = val;
      });
      sm.set('gameInProgress', true);
      expect(received).toBe(true);
    });

    it('unsubscribes correctly', () => {
      let count = 0;
      const unsub = sm.on('gameInProgress', () => {
        count++;
      });
      sm.set('gameInProgress', true);
      unsub();
      sm.set('gameInProgress', false);
      expect(count).toBe(1);
    });

    it('clears listeners for a specific key', () => {
      let called = false;
      sm.on('gameInProgress', () => {
        called = true;
      });
      sm.clear('gameInProgress');
      sm.set('gameInProgress', true);
      expect(called).toBe(false);
    });

    it('clears all listeners when no key specified', () => {
      let called = false;
      sm.on('gameInProgress', () => {
        called = true;
      });
      sm.clear();
      sm.set('gameInProgress', true);
      expect(called).toBe(false);
    });
  });

  // ─── Stats ──────────────────────────────────────────────────

  describe('game stats', () => {
    it('increments gamesStarted', () => {
      sm.incrementStat('gamesStarted');
      sm.incrementStat('gamesStarted');
      expect(sm.getStats().gamesStarted).toBe(2);
    });

    it('increments battlesPlayed', () => {
      sm.incrementStat('battlesPlayed');
      expect(sm.getStats().battlesPlayed).toBe(1);
    });

    it('increments victories and defeats independently', () => {
      sm.incrementStat('victories');
      sm.incrementStat('victories');
      sm.incrementStat('defeats');
      const stats = sm.getStats();
      expect(stats.victories).toBe(2);
      expect(stats.defeats).toBe(1);
    });

    it('getStats returns a copy (not a reference)', () => {
      const stats = sm.getStats();
      stats.victories = 999;
      expect(sm.getStats().victories).toBe(0);
    });
  });

  // ─── Cards ──────────────────────────────────────────────────

  describe('cards', () => {
    it('card is not unlocked by default', () => {
      expect(sm.isCardUnlocked(1)).toBe(false);
      expect(sm.isCardUsed(1)).toBe(false);
      expect(sm.getCardUseCount(1)).toBe(0);
    });

    it('unlockCard marks card as unlocked', () => {
      sm.unlockCard(42);
      expect(sm.isCardUnlocked(42)).toBe(true);
      expect(sm.getCardUseCount(42)).toBe(0);
    });

    it('useCard increments use count and marks as unlocked', () => {
      sm.useCard(10);
      expect(sm.isCardUnlocked(10)).toBe(true);
      expect(sm.isCardUsed(10)).toBe(true);
      expect(sm.getCardUseCount(10)).toBe(1);

      sm.useCard(10);
      expect(sm.getCardUseCount(10)).toBe(2);
    });

    it('isCardUsed is false when unlocked but never used', () => {
      sm.unlockCard(5);
      expect(sm.isCardUsed(5)).toBe(false);
    });

    it('card data persists across load', () => {
      sm.unlockCard(7);
      sm.useCard(7);

      const sm2 = new SaveManager();
      sm2.load();
      expect(sm2.isCardUnlocked(7)).toBe(true);
      expect(sm2.getCardUseCount(7)).toBe(1);
    });
  });

  // ─── Abilities ──────────────────────────────────────────────

  describe('abilities', () => {
    it('ability is not unlocked by default', () => {
      expect(sm.isAbilityUnlocked(1)).toBe(false);
      expect(sm.isAbilityUsed(1)).toBe(false);
      expect(sm.getAbilityUseCount(1)).toBe(0);
    });

    it('unlockAbility marks ability as unlocked', () => {
      sm.unlockAbility(2);
      expect(sm.isAbilityUnlocked(2)).toBe(true);
      expect(sm.getAbilityUseCount(2)).toBe(0);
    });

    it('useAbility increments use count and marks as unlocked', () => {
      sm.useAbility(3);
      expect(sm.isAbilityUnlocked(3)).toBe(true);
      expect(sm.isAbilityUsed(3)).toBe(true);
      expect(sm.getAbilityUseCount(3)).toBe(1);

      sm.useAbility(3);
      expect(sm.getAbilityUseCount(3)).toBe(2);
    });

    it('isAbilityUsed is false when unlocked but never used', () => {
      sm.unlockAbility(1);
      expect(sm.isAbilityUsed(1)).toBe(false);
    });

    it('ability data persists across load', () => {
      sm.unlockAbility(4);
      sm.useAbility(4);
      sm.useAbility(4);

      const sm2 = new SaveManager();
      sm2.load();
      expect(sm2.isAbilityUnlocked(4)).toBe(true);
      expect(sm2.getAbilityUseCount(4)).toBe(2);
    });
  });
});
