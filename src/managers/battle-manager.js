import { Card } from '../entities/card.js';
import { shuffle } from '../utils/math.js';
import { RANKS } from '../configs/card-ranks.js';

/** Battle grid dimensions */
export const GRID_COLS = 8;
export const GRID_ROWS = 4;

/** Initial player deck size */
export const INITIAL_DECK_SIZE = 10;

/** Maximum hand size */
export const HAND_SIZE = 4;

/**
 * BattleManager — pure logic class managing battle state.
 * No Phaser dependency — fully testable in isolation.
 */
export class BattleManager {
  constructor() {
    /** @type {(Card|null)[][]} 4 rows × 8 cols */
    this.grid = [];
    /** @type {Card[]} Player draw pile */
    this.deck = [];
    /** @type {Card[]} Player hand (up to 4) */
    this.hand = [];
    /** @type {Card|null} Last enemy card fought */
    this.lastOpponent = null;
  }

  /**
   * Initialize a new battle.
   * Generates the enemy grid, builds the player deck, shuffles it, and draws the initial hand.
   */
  initBattle() {
    this._generateGrid();
    this._buildPlayerDeck();
    this.lastOpponent = null;
    this.drawHand();
  }

  /** @private Generate 4×8 grid of random enemy cards */
  _generateGrid() {
    this.grid = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const rowCards = [];
      for (let col = 0; col < GRID_COLS; col++) {
        rowCards.push(Card.dropRandom());
      }
      this.grid.push(rowCards);
    }
  }

  /** @private Build and shuffle the player deck */
  _buildPlayerDeck() {
    this.deck = [];
    for (let i = 0; i < INITIAL_DECK_SIZE; i++) {
      this.deck.push(Card.dropRandom());
    }
    shuffle(this.deck);
    this.hand = [];
  }

  /**
   * Fill the hand up to HAND_SIZE from the deck.
   */
  drawHand() {
    while (this.hand.length < HAND_SIZE && this.deck.length > 0) {
      this.hand.push(this.deck.shift());
    }
  }

  /**
   * Get coordinates of attackable targets using path-based reachability.
   *
   * Starting from a virtual row just below the grid (index GRID_ROWS), the
   * player can walk through empty grid cells (BFS, 4-directional). Any enemy
   * card that is directly adjacent to a reachable empty cell (or adjacent to
   * the virtual bottom row) is considered attackable.
   *
   * Consequence: at game start the entire bottom row is attackable. As enemy
   * cards are defeated, empty cells open corridors that give the player access
   * to deeper rows and neighbouring columns.
   *
   * @returns {{ row: number, col: number }[]}
   */
  getAttackableTargets() {
    // Virtual row index just below the grid — always fully reachable
    const VIRTUAL_ROW = GRID_ROWS;

    const reachable = new Set();
    const queue = [];

    // Seed: every column of the virtual row is accessible from outside
    for (let col = 0; col < GRID_COLS; col++) {
      reachable.add(`${VIRTUAL_ROW},${col}`);
      queue.push([VIRTUAL_ROW, col]);
    }

    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    // BFS — only traverse empty cells that are within the grid
    while (queue.length > 0) {
      const [r, c] = queue.shift();
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= GRID_ROWS || nc < 0 || nc >= GRID_COLS) continue;
        const key = `${nr},${nc}`;
        if (reachable.has(key)) continue;
        if (this.grid[nr][nc] === null) {
          reachable.add(key);
          queue.push([nr, nc]);
        }
      }
    }

    // Any enemy card adjacent to a reachable cell is attackable
    const targets = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (this.grid[row][col] === null) continue;
        for (const [dr, dc] of dirs) {
          if (reachable.has(`${row + dr},${col + dc}`)) {
            targets.push({ row, col });
            break;
          }
        }
      }
    }

    return targets;
  }

  /**
   * Resolve an attack between a hand card and a grid card.
   * @param {number} handIndex - Index in the hand array (0-3)
   * @param {number} row - Grid row
   * @param {number} col - Grid col
   * @returns {{ playerCard: Card, enemyCard: Card, playerWins: boolean }}
   */
  resolveAttack(handIndex, row, col) {
    const playerCard = this.hand[handIndex];
    const enemyCard = this.grid[row][col];

    if (!playerCard || !enemyCard) {
      throw new Error('Invalid attack: card not found');
    }

    const playerWins = this._compareCards(playerCard, enemyCard);

    // Remove player card from hand
    this.hand.splice(handIndex, 1);

    this.lastOpponent = enemyCard;

    if (playerWins) {
      // Enemy card removed from grid — position stays empty (no gravity)
      this.grid[row][col] = null;
      // Player card returns to bottom of deck
      this.deck.push(playerCard);
    }
    // If player loses: enemy stays, player card is permanently destroyed (already removed from hand)

    // Draw new cards to refill hand
    this.drawHand();

    return { playerCard, enemyCard, playerWins };
  }

  /**
   * Compare two cards. Lower level wins. If equal, lower rank index wins.
   * If both are identical, player loses (defender advantage).
   * @param {Card} playerCard
   * @param {Card} enemyCard
   * @returns {boolean} true if player wins
   * @private
   */
  _compareCards(playerCard, enemyCard) {
    if (playerCard.typeLevel < enemyCard.typeLevel) return true;
    if (playerCard.typeLevel > enemyCard.typeLevel) return false;

    // Same level — compare rank (lower index = better rank)
    const playerRankIndex = RANKS.findIndex((r) => r.label === playerCard.rankLabel);
    const enemyRankIndex = RANKS.findIndex((r) => r.label === enemyCard.rankLabel);

    if (playerRankIndex < enemyRankIndex) return true;
    // Equal or worse: player loses (defender advantage)
    return false;
  }

  /**
   * Collapse empty cells downward in a column (gravity).
   * Cards above a gap fall down to fill it.
   * @param {number} col
   */
  applyGravity(col) {
    // Collect non-null cards from bottom to top
    const cards = [];
    for (let row = GRID_ROWS - 1; row >= 0; row--) {
      if (this.grid[row][col] !== null) {
        cards.push(this.grid[row][col]);
      }
    }
    // Refill column from bottom with collected cards, null on top
    for (let row = GRID_ROWS - 1; row >= 0; row--) {
      const idx = GRID_ROWS - 1 - row;
      this.grid[row][col] = idx < cards.length ? cards[idx] : null;
    }
  }

  /**
   * Check if all enemy cards have been defeated.
   * @returns {boolean}
   */
  isVictory() {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (this.grid[row][col] !== null) return false;
      }
    }
    return true;
  }

  /**
   * Check if the player has no cards left (deck empty + hand empty).
   * @returns {boolean}
   */
  isDefeat() {
    return this.deck.length === 0 && this.hand.length === 0;
  }

  /**
   * Count remaining enemy cards on the grid.
   * @returns {number}
   */
  remainingEnemies() {
    let count = 0;
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (this.grid[row][col] !== null) count++;
      }
    }
    return count;
  }
}
