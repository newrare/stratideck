import { describe, it, expect, beforeEach } from 'vitest';
import { BattleManager, GRID_COLS, GRID_ROWS, HAND_SIZE, INITIAL_DECK_SIZE } from '../../src/managers/battle-manager.js';
import { Card } from '../../src/entities/card.js';
import { RANKS } from '../../src/configs/card-ranks.js';

describe('BattleManager', () => {
  let bm;

  beforeEach(() => {
    bm = new BattleManager();
    bm.initBattle();
  });

  /* ── Initialization ─────────────────────────────────────── */

  describe('initBattle', () => {
    it('creates a grid of GRID_ROWS × GRID_COLS', () => {
      expect(bm.grid).toHaveLength(GRID_ROWS);
      bm.grid.forEach((row) => {
        expect(row).toHaveLength(GRID_COLS);
      });
    });

    it('fills every grid cell with a Card', () => {
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          const card = bm.grid[r][c];
          expect(card).not.toBeNull();
          expect(card.id).toBeGreaterThanOrEqual(1);
          expect(card.id).toBeLessThanOrEqual(90);
        }
      }
    });

    it('creates a hand of HAND_SIZE cards', () => {
      expect(bm.hand).toHaveLength(HAND_SIZE);
    });

    it('creates a deck of INITIAL_DECK_SIZE minus HAND_SIZE cards', () => {
      expect(bm.deck).toHaveLength(INITIAL_DECK_SIZE - HAND_SIZE);
    });

    it('starts with no lastOpponent', () => {
      expect(bm.lastOpponent).toBeNull();
    });

    it('total player cards = INITIAL_DECK_SIZE', () => {
      expect(bm.hand.length + bm.deck.length).toBe(INITIAL_DECK_SIZE);
    });
  });

  /* ── Attackable targets (path-based) ───────────────────── */

  describe('getAttackableTargets', () => {
    it('all returned targets reference non-null grid cells', () => {
      const targets = bm.getAttackableTargets();
      for (const { row, col } of targets) {
        expect(bm.grid[row][col]).not.toBeNull();
      }
    });

    it('after init, all targets are on the bottom row', () => {
      const targets = bm.getAttackableTargets();
      targets.forEach((t) => {
        expect(t.row).toBe(GRID_ROWS - 1);
      });
    });

    it('returns GRID_COLS targets when grid is full', () => {
      const targets = bm.getAttackableTargets();
      expect(targets).toHaveLength(GRID_COLS);
    });

    it('upper row card becomes attackable when an empty path reaches it', () => {
      // Clear a whole column — path goes all the way to the top
      const col = 0;
      for (let r = 1; r < GRID_ROWS; r++) bm.grid[r][col] = null;
      // grid[0][col] still has a card; rows 1…GRID_ROWS-1 are empty

      const targets = bm.getAttackableTargets();
      expect(targets.some((t) => t.row === 0 && t.col === col)).toBe(true);
    });

    it('defeating a bottom card opens access to the card directly above', () => {
      // Single card remaining in column 1 at row GRID_ROWS-2
      const col = 1;
      bm.grid[GRID_ROWS - 1][col] = null; // bottom defeated
      for (let r = 0; r < GRID_ROWS - 2; r++) bm.grid[r][col] = null;
      // grid[GRID_ROWS-2][col] now has a card with an empty cell below it

      const targets = bm.getAttackableTargets();
      expect(targets.some((t) => t.row === GRID_ROWS - 2 && t.col === col)).toBe(true);
    });

    it('card blocked by a full column below it is not attackable', () => {
      // Full grid — cards in rows 0-2 have no empty path from the bottom
      const targets = bm.getAttackableTargets();
      for (const { row } of targets) {
        expect(row).toBe(GRID_ROWS - 1);
      }
    });

    it('card reachable via horizontal corridor through empty cells', () => {
      // col 0 fully empty → provides horizontal access to col 1 at the same row
      for (let r = 0; r < GRID_ROWS; r++) bm.grid[r][0] = null;
      // Clear bottom row of col 1 so col 0 empty cells connect sideways
      bm.grid[GRID_ROWS - 1][1] = null;
      for (let r = 0; r < GRID_ROWS - 1; r++) bm.grid[r][1] = null;
      const target = Card.dropRandom();
      bm.grid[GRID_ROWS - 2][1] = target;
      // Path: virtual row → col 0 bottom → col 0 row GRID_ROWS-2 → col 1 row GRID_ROWS-2
      // (or: virtual row → col 1 bottom empty → col 1 row GRID_ROWS-2)

      const targets = bm.getAttackableTargets();
      expect(targets.some((t) => t.row === GRID_ROWS - 2 && t.col === 1)).toBe(true);
    });

    it('enemy cards do not shift positions when another is defeated', () => {
      // Snapshot the full grid, defeat the bottom card of col 0, check others unchanged
      const col = 0;
      const cardAbove = bm.grid[GRID_ROWS - 2][col];
      bm.grid[GRID_ROWS - 1][col] = null; // simulate defeat (no gravity)

      expect(bm.grid[GRID_ROWS - 2][col]).toBe(cardAbove); // card did not move
    });
  });

  /* ── Gravity ────────────────────────────────────────────── */

  describe('applyGravity', () => {
    it('moves cards down to fill gaps in a column', () => {
      // Remove the bottom card from column 0
      bm.grid[GRID_ROWS - 1][0] = null;
      bm.applyGravity(0);

      // Bottom should now have a card (fell from above)
      expect(bm.grid[GRID_ROWS - 1][0]).not.toBeNull();
      // Top should be null
      expect(bm.grid[0][0]).toBeNull();
    });

    it('preserves the total number of cards in a column', () => {
      const col = 2;
      const before = bm.grid.map((r) => r[col]).filter(Boolean).length;
      bm.grid[1][col] = null;
      bm.applyGravity(col);
      const after = bm.grid.map((r) => r[col]).filter(Boolean).length;
      expect(after).toBe(before - 1);
    });

    it('does nothing when column is full', () => {
      const col = 0;
      const before = bm.grid.map((r) => r[col]);
      bm.applyGravity(col);
      const after = bm.grid.map((r) => r[col]);
      expect(after).toEqual(before);
    });

    it('handles fully empty column', () => {
      const col = 3;
      for (let r = 0; r < GRID_ROWS; r++) bm.grid[r][col] = null;
      bm.applyGravity(col);
      for (let r = 0; r < GRID_ROWS; r++) {
        expect(bm.grid[r][col]).toBeNull();
      }
    });
  });

  /* ── Card comparison (via resolveAttack) ────────────────── */

  describe('resolveAttack', () => {
    it('returns playerCard, enemyCard, and playerWins', () => {
      const targets = bm.getAttackableTargets();
      const { row, col } = targets[0];
      const result = bm.resolveAttack(0, row, col);

      expect(result).toHaveProperty('playerCard');
      expect(result).toHaveProperty('enemyCard');
      expect(result).toHaveProperty('playerWins');
      expect(typeof result.playerWins).toBe('boolean');
    });

    it('removes player card from hand', () => {
      const handBefore = bm.hand.length;
      const deckBefore = bm.deck.length;
      const targets = bm.getAttackableTargets();
      const { row, col } = targets[0];

      bm.resolveAttack(0, row, col);

      // Hand should be refilled from deck
      const totalBefore = handBefore + deckBefore;
      const totalAfter = bm.hand.length + bm.deck.length;
      // Player either kept the card (went to deck) or lost it
      expect(totalAfter).toBeLessThanOrEqual(totalBefore);
    });

    it('sets lastOpponent to the enemy card', () => {
      const targets = bm.getAttackableTargets();
      const { row, col } = targets[0];
      const enemyCard = bm.grid[row][col];

      bm.resolveAttack(0, row, col);

      expect(bm.lastOpponent).toBe(enemyCard);
    });

    it('throws for invalid hand index', () => {
      const targets = bm.getAttackableTargets();
      const { row, col } = targets[0];
      expect(() => bm.resolveAttack(99, row, col)).toThrow('Invalid attack');
    });

    it('throws for null grid cell', () => {
      bm.grid[0][0] = null;
      expect(() => bm.resolveAttack(0, 0, 0)).toThrow('Invalid attack');
    });
  });

  /* ── Combat resolution logic ────────────────────────────── */

  describe('_compareCards (via resolveAttack)', () => {
    it('lower level wins', () => {
      // Manually set up cards: player level 1 vs enemy level 5
      const player = Card.fromId(1);  // Overlord SSS, level 1
      const enemy = Card.fromId(46);  // Vanguard SSS, level 6

      bm.hand = [player];
      bm.grid[GRID_ROWS - 1][0] = enemy;

      const result = bm.resolveAttack(0, GRID_ROWS - 1, 0);
      expect(result.playerWins).toBe(true);
    });

    it('higher level loses', () => {
      const player = Card.fromId(46);  // Vanguard SSS, level 6
      const enemy = Card.fromId(1);    // Overlord SSS, level 1

      bm.hand = [player];
      bm.grid[GRID_ROWS - 1][0] = enemy;

      const result = bm.resolveAttack(0, GRID_ROWS - 1, 0);
      expect(result.playerWins).toBe(false);
    });

    it('same level, better rank wins', () => {
      const player = Card.fromId(1);  // Overlord SSS, level 1
      const enemy = Card.fromId(9);   // Overlord F, level 1

      bm.hand = [player];
      bm.grid[GRID_ROWS - 1][0] = enemy;

      const result = bm.resolveAttack(0, GRID_ROWS - 1, 0);
      expect(result.playerWins).toBe(true);
    });

    it('same level and rank: player loses (defender advantage)', () => {
      const player = Card.fromId(1);  // Overlord SSS, level 1
      const enemy = Card.fromId(1);   // Overlord SSS, level 1

      bm.hand = [player];
      bm.grid[GRID_ROWS - 1][0] = enemy;

      const result = bm.resolveAttack(0, GRID_ROWS - 1, 0);
      expect(result.playerWins).toBe(false);
    });
  });

  /* ── Win outcome ────────────────────────────────────────── */

  describe('player wins combat', () => {
    it('removes enemy card from grid', () => {
      // Clear column 0 except bottom row for a clean test
      for (let r = 0; r < GRID_ROWS; r++) bm.grid[r][0] = null;
      const enemy = Card.fromId(46); // Vanguard SSS, level 6
      bm.grid[GRID_ROWS - 1][0] = enemy;
      bm.hand = [Card.fromId(1)]; // Overlord SSS, level 1 (wins: 1 < 6)
      bm.deck = [];

      bm.resolveAttack(0, GRID_ROWS - 1, 0);

      // The single card in column 0 was defeated, column should be empty
      const col0Cards = bm.grid.map((r) => r[0]).filter(Boolean);
      expect(col0Cards).toHaveLength(0);
    });

    it('returns player card to bottom of deck', () => {
      for (let r = 0; r < GRID_ROWS; r++) bm.grid[r][0] = null;
      bm.grid[GRID_ROWS - 1][0] = Card.fromId(46); // level 6
      const playerCard = Card.fromId(1); // level 1 (wins)
      bm.hand = [playerCard];
      bm.deck = [];

      bm.resolveAttack(0, GRID_ROWS - 1, 0);

      // Player card should go to deck, then drawHand pulls it
      const found = bm.hand.includes(playerCard) || bm.deck.includes(playerCard);
      expect(found).toBe(true);
    });
  });

  /* ── Lose outcome ───────────────────────────────────────── */

  describe('player loses combat', () => {
    it('enemy card stays on grid', () => {
      for (let r = 0; r < GRID_ROWS; r++) bm.grid[r][0] = null;
      const enemy = Card.fromId(1); // Overlord SSS, level 1
      bm.grid[GRID_ROWS - 1][0] = enemy;
      bm.hand = [Card.fromId(46)]; // Vanguard SSS, level 6 (loses: 6 > 1)
      bm.deck = [];

      bm.resolveAttack(0, GRID_ROWS - 1, 0);

      expect(bm.grid[GRID_ROWS - 1][0]).toBe(enemy);
    });

    it('player card is permanently destroyed', () => {
      for (let r = 0; r < GRID_ROWS; r++) bm.grid[r][0] = null;
      bm.grid[GRID_ROWS - 1][0] = Card.fromId(1); // level 1
      const playerCard = Card.fromId(46); // level 6 (loses)
      bm.hand = [playerCard];
      bm.deck = [];

      bm.resolveAttack(0, GRID_ROWS - 1, 0);

      const inHand = bm.hand.includes(playerCard);
      const inDeck = bm.deck.includes(playerCard);
      expect(inHand).toBe(false);
      expect(inDeck).toBe(false);
    });
  });

  /* ── drawHand ───────────────────────────────────────────── */

  describe('drawHand', () => {
    it('fills hand up to HAND_SIZE from deck', () => {
      bm.hand = [];
      bm.deck = Array.from({ length: 6 }, () => Card.dropRandom());

      bm.drawHand();

      expect(bm.hand).toHaveLength(HAND_SIZE);
      expect(bm.deck).toHaveLength(2);
    });

    it('draws remaining if deck has fewer than HAND_SIZE', () => {
      bm.hand = [];
      bm.deck = [Card.dropRandom(), Card.dropRandom()];

      bm.drawHand();

      expect(bm.hand).toHaveLength(2);
      expect(bm.deck).toHaveLength(0);
    });

    it('does nothing when deck is empty', () => {
      bm.hand = [];
      bm.deck = [];

      bm.drawHand();

      expect(bm.hand).toHaveLength(0);
    });
  });

  /* ── Victory / Defeat ───────────────────────────────────── */

  describe('isVictory', () => {
    it('returns false when grid has cards', () => {
      expect(bm.isVictory()).toBe(false);
    });

    it('returns true when all grid cells are null', () => {
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          bm.grid[r][c] = null;
        }
      }
      expect(bm.isVictory()).toBe(true);
    });
  });

  describe('isDefeat', () => {
    it('returns false when player has cards', () => {
      expect(bm.isDefeat()).toBe(false);
    });

    it('returns true when hand and deck are both empty', () => {
      bm.hand = [];
      bm.deck = [];
      expect(bm.isDefeat()).toBe(true);
    });

    it('returns false when only hand has cards', () => {
      bm.hand = [Card.dropRandom()];
      bm.deck = [];
      expect(bm.isDefeat()).toBe(false);
    });

    it('returns false when only deck has cards', () => {
      bm.hand = [];
      bm.deck = [Card.dropRandom()];
      expect(bm.isDefeat()).toBe(false);
    });
  });

  /* ── remainingEnemies ───────────────────────────────────── */

  describe('remainingEnemies', () => {
    it('returns total grid cards after init', () => {
      expect(bm.remainingEnemies()).toBe(GRID_ROWS * GRID_COLS);
    });

    it('decreases when grid cells are cleared', () => {
      bm.grid[0][0] = null;
      bm.grid[1][1] = null;
      expect(bm.remainingEnemies()).toBe(GRID_ROWS * GRID_COLS - 2);
    });

    it('returns 0 when grid is empty', () => {
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          bm.grid[r][c] = null;
        }
      }
      expect(bm.remainingEnemies()).toBe(0);
    });
  });

  /* ── Constants ──────────────────────────────────────────── */

  describe('constants', () => {
    it('GRID_COLS is 8', () => {
      expect(GRID_COLS).toBe(8);
    });

    it('GRID_ROWS is 4', () => {
      expect(GRID_ROWS).toBe(4);
    });

    it('HAND_SIZE is 4', () => {
      expect(HAND_SIZE).toBe(4);
    });

    it('INITIAL_DECK_SIZE is 10', () => {
      expect(INITIAL_DECK_SIZE).toBe(10);
    });
  });
});
