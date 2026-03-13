import Phaser from 'phaser';
import { BaseScene } from './base-scene.js';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT, DEPTH } from '../configs/constants.js';
import { InGameMenu } from '../components/in-game-menu.js';
import { Modal } from '../components/modal.js';
import { CardVisual, CARD_WIDTH, CARD_HEIGHT } from '../components/card-visual.js';
import { CardVisualMini, CARD_SIZE as MINI_SIZE } from '../components/card-visual-mini.js';
import { CardVisualTiny, CARD_SIZE as TINY_SIZE } from '../components/card-visual-tiny.js';
import { i18n } from '../managers/i18n-manager.js';
import { BattleManager, GRID_COLS, GRID_ROWS } from '../managers/battle-manager.js';
import '../styles/card.css';

/* ── Zone boundaries ──────────────────────────────────────── */
const ARENA_W  = GAME_WIDTH * 0.8;
const ARENA_H  = GAME_HEIGHT * 0.8;
const HAND_W   = GAME_WIDTH * 0.8;
const HAND_H   = GAME_HEIGHT * 0.2;
const SIDE_W   = GAME_WIDTH * 0.2;
const SIDE_H   = GAME_HEIGHT * 0.5;

/* ── Grid layout ──────────────────────────────────────────── */
const GRID_PAD_X = 40;
const GRID_PAD_Y = 30;
const CELL_GAP   = 12;
const CELL       = TINY_SIZE + CELL_GAP;

/* ── Side-zone card scale (Opponent & Stockpile) ─────────── */
const SIDE_CARD_SCALE = 0.7;

/* ── VS modal duration (ms) ───────────────────────────────── */
const VS_MODAL_DURATION = 2000;

/* ── Attack animation duration (ms) ──────────────────────── */
const ATTACK_ANIM_DURATION = 400;

/* ── Post-VS exit animation duration (ms) ────────────────── */
const EXIT_ANIM_DURATION = 450;

/* ── VS modal internal animation timings (ms) ────────────── */
const VS_STRIKE_DELAY    = 300; // pause before winner card strikes
const VS_STRIKE_HALF_DUR = 250; // half of the strike CSS anim (card at peak impact)

/**
 * BattleScene — main combat scene.
 */
export class BattleScene extends BaseScene {
  constructor() {
    super({ key: SCENE_KEYS.BATTLE });
  }

  create() {
    super.create();

    /** @type {BattleManager} */
    this.manager = new BattleManager();
    this.manager.initBattle();

    /** Visual references */
    this._gridVisuals  = [];   // [row][col] → CardVisualTiny | null
    this._handVisuals  = [];   // CardVisualMini[]
    this._opponentVisual = null;
    this._stockpileVisual = null;
    this._stockpileText = null;

    /** Interaction state */
    this._selectedHandIndex = null;
    this._busy = false; // locked during animations

    /** Hurt state — tracks tiny arena cards that survived a versus.
     *  Map values: 'last' = most recent survivor | 'win' = survived before. */
    this._hurtCells  = new Map(); // Map<"row,col", 'last'|'win'>
    /** Cells defeated THIS turn — rendered as loose ghost for one draw cycle only. */
    this._looseCells = new Set(); // Set<"row,col">

    this._drawArena();
    this._drawHand();
    this._drawOpponentZone();
    this._drawStockpile();

    new InGameMenu(this);
  }

  /*  ════════════════════════════════════════════════════════════
      Arena Zone — 8×4 grid of tiny mystery cards
      ════════════════════════════════════════════════════════════ */

  _drawArena() {
    const attackable = this.manager.getAttackableTargets();
    const attackSet = new Set(attackable.map((t) => `${t.row},${t.col}`));

    // Center the grid within the arena zone
    const gridTotalW = GRID_COLS * CELL - CELL_GAP;
    const gridTotalH = GRID_ROWS * CELL - CELL_GAP;
    const offsetX = (ARENA_W - gridTotalW) / 2 + TINY_SIZE / 2;
    const offsetY = (ARENA_H - gridTotalH) / 2 + TINY_SIZE / 2;

    this._gridVisuals = [];
    // Snapshot and clear loose cells — shown for exactly one draw cycle
    const looseCellsThisTurn = new Set(this._looseCells);
    this._looseCells.clear();

    for (let row = 0; row < GRID_ROWS; row++) {
      const rowVisuals = [];
      for (let col = 0; col < GRID_COLS; col++) {
        const cellKey = `${row},${col}`;
        const x = offsetX + col * CELL;
        const y = offsetY + row * CELL;
        const card = this.manager.grid[row][col];

        if (!card) {
          // Defeated cell: show ghost for one turn, then nothing
          rowVisuals.push(
            looseCellsThisTurn.has(cellKey)
              ? new CardVisualTiny(this, x, y, null, { mode: 'loose' })
              : null,
          );
          continue;
        }

        // Determine mode from hurt state and attackability
        const isAttack   = attackSet.has(cellKey);
        const hurtState  = this._hurtCells.get(cellKey); // 'last' | 'win' | undefined
        let mode;
        if (hurtState === 'last')     mode = 'last';
        else if (hurtState === 'win') mode = 'win';
        else if (isAttack)            mode = 'attack';
        else                          mode = 'mystery';

        const visual = new CardVisualTiny(this, x, y, card, { mode });
        visual._gridRow = row;
        visual._gridCol = col;

        if (isAttack) {
          this._makeAttackable(visual, row, col);
        }

        rowVisuals.push(visual);
      }
      this._gridVisuals.push(rowVisuals);
    }
  }

  /**
   * Make a tiny card interactive as an attack target.
   */
  _makeAttackable(visual, row, col) {
    const el = visual.domElement.node;
    el.style.cursor = 'pointer';

    const handler = () => {
      if (this._busy) return;
      if (this._selectedHandIndex === null) return;
      this._executeAttack(this._selectedHandIndex, row, col);
    };
    el.addEventListener('click', handler);
    visual._clickHandler = handler;

    // Drop target for drag & drop
    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });
    el.addEventListener('drop', (e) => {
      e.preventDefault();
      if (this._busy) return;
      const handIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
      if (isNaN(handIndex)) return;
      this._executeAttack(handIndex, row, col);
    });
  }

  /*  ════════════════════════════════════════════════════════════
      Hand Zone — 4 mini cards at bottom-left
      ════════════════════════════════════════════════════════════ */

  _drawHand() {
    this._clearHandVisuals();

    const hand = this.manager.hand;
    const count = hand.length;
    if (count === 0) return;

    const totalW = count * MINI_SIZE + (count - 1) * 16;
    const startX = (HAND_W - totalW) / 2 + MINI_SIZE / 2;
    const y = ARENA_H + HAND_H / 2;

    for (let i = 0; i < count; i++) {
      const card = hand[i];
      const x = startX + i * (MINI_SIZE + 16);

      const visual = new CardVisualMini(this, x, y, card);
      visual._handIndex = i;

      // Hover lift animation
      visual.domElement.node.classList.add('cvm-hoverable');

      // Click to select
      const el = visual.domElement.node;
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        if (this._busy) return;
        this._selectHandCard(i);
      });

      // Drag start
      el.setAttribute('draggable', 'true');
      el.addEventListener('dragstart', (e) => {
        if (this._busy) {
          e.preventDefault();
          return;
        }
        this._selectHandCard(i);
        e.dataTransfer.setData('text/plain', String(i));
        e.dataTransfer.effectAllowed = 'move';
      });

      this._handVisuals.push(visual);
    }
  }

  _selectHandCard(index) {
    this._selectedHandIndex = index;
    // Update visual selection
    this._handVisuals.forEach((v, i) => {
      const cardEl = v.domElement.node.querySelector('.cvm-card');
      if (cardEl) {
        cardEl.classList.toggle('cvm-selected', i === index);
      }
    });
  }

  _clearHandVisuals() {
    this._handVisuals.forEach((v) => v.destroy());
    this._handVisuals = [];
    this._selectedHandIndex = null;
  }

  /*  ════════════════════════════════════════════════════════════
      Opponent Zone — last fought card (top-right)
      ════════════════════════════════════════════════════════════ */

  _drawOpponentZone() {
    if (this._opponentVisual) {
      this._opponentVisual.destroy();
      this._opponentVisual = null;
    }

    const card = this.manager.lastOpponent;
    if (!card) return;

    const x = ARENA_W + SIDE_W / 2;
    const y = SIDE_H / 2;

    this._opponentVisual = new CardVisual(this, x, y, card);
    this._opponentVisual.domElement.setScale(SIDE_CARD_SCALE);
  }

  /*  ════════════════════════════════════════════════════════════
      Stockpile Zone — deck pile (bottom-right)
      ════════════════════════════════════════════════════════════ */

  _drawStockpile() {
    if (this._stockpileVisual) {
      this._stockpileVisual.destroy();
      this._stockpileVisual = null;
    }
    if (this._stockpileText) {
      this._stockpileText.destroy();
      this._stockpileText = null;
    }

    const x = ARENA_W + SIDE_W / 2;
    const remaining = this.manager.deck.length;

    // Zone: SIDE_H (360) → GAME_HEIGHT (720), 360 px tall.
    // Scaled card effective height: CARD_HEIGHT × SIDE_CARD_SCALE ≈ 251 px.
    const cardY = SIDE_H + (GAME_HEIGHT - SIDE_H) / 2;
    const textY = cardY + Math.round(CARD_HEIGHT * SIDE_CARD_SCALE / 2) + 14;

    if (remaining > 0) {
      this._stockpileVisual = new CardVisual(this, x, cardY, this.manager.deck[0]);
      this._stockpileVisual.domElement.setScale(SIDE_CARD_SCALE);
    }

    // Counter always shown (even when deck is empty)
    this._stockpileText = this.add.text(x, textY, `${remaining}`, {
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#94a3b8',
      align: 'center',
    }).setOrigin(0.5).setDepth(DEPTH.UI);
  }

  /*  ════════════════════════════════════════════════════════════
      Attack Execution & Animation
      ════════════════════════════════════════════════════════════ */

  /**
   * Execute an attack: animate, show VS modal, apply result.
   * @param {number} handIndex
   * @param {number} row
   * @param {number} col
   */
  async _executeAttack(handIndex, row, col) {
    if (this._busy) return;

    // Validate the target is attackable
    const targets = this.manager.getAttackableTargets();
    const isValidTarget = targets.some((t) => t.row === row && t.col === col);
    if (!isValidTarget) return;

    if (handIndex < 0 || handIndex >= this.manager.hand.length) return;

    this._busy = true;

    const handVisual = this._handVisuals[handIndex];
    const gridVisual = this._gridVisuals[row][col];

    if (!handVisual || !gridVisual) {
      this._busy = false;
      return;
    }

    // Get target positions for merge animation
    const mergeX = (handVisual.domElement.x + gridVisual.domElement.x) / 2;
    const mergeY = (handVisual.domElement.y + gridVisual.domElement.y) / 2;

    // Animate hand card toward merge point
    await Promise.all([
      this._animateMoveTo(handVisual.domElement, mergeX, mergeY, ATTACK_ANIM_DURATION),
      this._animateMoveTo(gridVisual.domElement, mergeX, mergeY, ATTACK_ANIM_DURATION),
    ]);

    // Hide both during modal
    handVisual.domElement.setVisible(false);
    gridVisual.domElement.setVisible(false);

    // Resolve combat logic
    const result = this.manager.resolveAttack(handIndex, row, col);

    // Update tiny card hurt tracking
    const cellKey = `${row},${col}`;
    if (result.playerWins) {
      // Enemy defeated: schedule ghost for this draw cycle, remove from survivors
      this._looseCells.add(cellKey);
      this._hurtCells.delete(cellKey);
    } else {
      // Enemy survived: previous 'last' becomes 'win', this cell becomes the new 'last'
      for (const [key, val] of this._hurtCells) {
        if (val === 'last') this._hurtCells.set(key, 'win');
      }
      this._hurtCells.set(cellKey, 'last');
    }

    // Show VS modal with internal strike / hurt animations
    await this._showVsModal(result.enemyCard, result.playerCard, result.playerWins);

    // Exit animations — cards fly to their destination zones
    await this._animatePostBattle(result, row, col);

    // Refresh all zones
    this._refreshGrid();
    this._drawHand();
    this._drawOpponentZone();
    this._drawStockpile();

    this._busy = false;

    // Check end conditions
    this._checkEndConditions();
  }

  /**
   * Resolve after `ms` milliseconds.
   * @param {number} ms
   * @returns {Promise<void>}
   */
  _wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Compute the Phaser-scene position of a grid cell.
   * @param {number} row
   * @param {number} col
   * @returns {{ x: number, y: number }}
   */
  _gridCellPosition(row, col) {
    const gridTotalW = GRID_COLS * CELL - CELL_GAP;
    const gridTotalH = GRID_ROWS * CELL - CELL_GAP;
    const offsetX = (ARENA_W - gridTotalW) / 2 + TINY_SIZE / 2;
    const offsetY = (ARENA_H - gridTotalH) / 2 + TINY_SIZE / 2;
    return { x: offsetX + col * CELL, y: offsetY + row * CELL };
  }

  /**
   * Play exit animations after the VS modal closes.
   * - Player wins: enemy card flies to Opponent zone, player card flies to Stockpile.
   * - Enemy wins:  enemy tiny card flies back to its grid cell.
   * @param {{ playerCard: import('../entities/card.js').Card, enemyCard: import('../entities/card.js').Card, playerWins: boolean }} result
   * @param {number} row
   * @param {number} col
   * @returns {Promise<void>}
   */
  async _animatePostBattle({ enemyCard, playerCard, playerWins }, row, col) {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const opponentX  = ARENA_W + SIDE_W / 2;
    const opponentY  = SIDE_H / 2;
    const stockpileX = ARENA_W + SIDE_W / 2;
    // Mirror the stockpile cardY formula from _drawStockpile
    const stockpileY = SIDE_H + (GAME_HEIGHT - SIDE_H) / 2;

    const animations = [];

    if (playerWins) {
      // Enemy revealed card flies to Opponent zone
      const enemyExit = new CardVisual(this, cx, cy, enemyCard);
      enemyExit.domElement.setDepth(DEPTH.UI + 1);
      animations.push(
        this._animateMoveTo(enemyExit.domElement, opponentX, opponentY, EXIT_ANIM_DURATION)
          .then(() => enemyExit.destroy()),
      );

      // Player card flies to Stockpile zone
      const playerExit = new CardVisualMini(this, cx, cy, playerCard);
      playerExit.domElement.setDepth(DEPTH.UI + 1);
      animations.push(
        this._animateMoveTo(playerExit.domElement, stockpileX, stockpileY, EXIT_ANIM_DURATION)
          .then(() => playerExit.destroy()),
      );
    } else {
      // Enemy survived — tiny mystery card flies back to its grid position
      const { x: gridX, y: gridY } = this._gridCellPosition(row, col);
      const enemyReturn = new CardVisualTiny(this, cx, cy, enemyCard, { mode: 'attack' });
      enemyReturn.domElement.setDepth(DEPTH.UI + 1);
      animations.push(
        this._animateMoveTo(enemyReturn.domElement, gridX, gridY, EXIT_ANIM_DURATION)
          .then(() => enemyReturn.destroy()),
      );
    }

    await Promise.all(animations);
  }

  /**
   * Animate a DOM element to a position.
   * @returns {Promise<void>}
   */
  _animateMoveTo(domElement, targetX, targetY, duration) {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: domElement,
        x: targetX,
        y: targetY,
        duration,
        ease: 'Power2',
        onComplete: resolve,
      });
    });
  }

  /**
   * Show the VS modal with strike and hurt animations, then auto-close.
   * Total duration is VS_MODAL_DURATION ms.
   * @param {import('../entities/card.js').Card} enemyCard
   * @param {import('../entities/card.js').Card} playerCard
   * @param {boolean} playerWins
   * @returns {Promise<void>}
   */
  async _showVsModal(enemyCard, playerCard, playerWins) {
    const { element, enemySlot, playerSlot } = this._buildVsElement(enemyCard, playerCard, playerWins);

    const modal = new Modal(this, {
      title: i18n.t('battle.vs'),
      bodyElement: element,
      centered: true,
      wide: true,
      confirmLabel: '',
      closeOnBackdrop: false,
    });

    // Hide the confirm button since we auto-close
    const btn = modal._overlay?.querySelector('.m-btn-main');
    if (btn) btn.style.display = 'none';

    // Phase 1 — brief pause then trigger strike on the winning card
    await this._wait(VS_STRIKE_DELAY);
    // Player slot is on the RIGHT and strikes LEFT; enemy slot is on the LEFT and strikes RIGHT
    const winnerSlot = playerWins ? playerSlot : enemySlot;
    const loserSlot  = playerWins ? enemySlot  : playerSlot;
    winnerSlot.classList.add(playerWins ? 'cvm-vs-strike-left' : 'cvm-vs-strike-right');

    // Phase 2 — at peak impact (50% of the strike animation) trigger the hurt blink
    await this._wait(VS_STRIKE_HALF_DUR);
    loserSlot.classList.add('cvm-vs-hurt');

    // Phase 3 — wait for remaining modal time then close
    await this._wait(VS_MODAL_DURATION - VS_STRIKE_DELAY - VS_STRIKE_HALF_DUR);
    modal.destroy();
  }

  /**
   * Build VS modal body element with full CardVisual instances.
   * Returns the root element and refs to the card slots for animation.
   * @param {import('../entities/card.js').Card} enemyCard
   * @param {import('../entities/card.js').Card} playerCard
   * @param {boolean} playerWins
   * @returns {{ element: HTMLElement, enemySlot: HTMLElement, playerSlot: HTMLElement }}
   */
  _buildVsElement(enemyCard, playerCard, playerWins) {
    const resultText = playerWins ? '🏆' : '💀';

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex; align-items:center; justify-content:center; gap:20px; padding:8px 0;';

    // position:relative is required for z-index to work during the strike animation
    const enemySlot = document.createElement('div');
    enemySlot.style.cssText = 'flex-shrink:0; zoom:0.65; position:relative;';

    const vsBlock = document.createElement('div');
    vsBlock.style.cssText = 'text-align:center; flex-shrink:0;';
    vsBlock.innerHTML = `
      <div style="font-size:2.2rem; font-weight:900; color:#facc15; text-shadow:0 0 20px rgba(250,204,21,0.4);">VS</div>
      <div style="font-size:1.8rem; margin-top:8px;">${resultText}</div>
    `;

    const playerSlot = document.createElement('div');
    playerSlot.style.cssText = 'flex-shrink:0; zoom:0.65; position:relative;';

    wrapper.appendChild(enemySlot);
    wrapper.appendChild(vsBlock);
    wrapper.appendChild(playerSlot);

    new CardVisual(this, 0, 0, enemyCard, { container: enemySlot });
    new CardVisual(this, 0, 0, playerCard, { container: playerSlot });

    return { element: wrapper, enemySlot, playerSlot };
  }

  /*  ════════════════════════════════════════════════════════════
      Grid Refresh
      ════════════════════════════════════════════════════════════ */

  _refreshGrid() {
    // Destroy all existing grid visuals
    for (let row = 0; row < this._gridVisuals.length; row++) {
      for (let col = 0; col < (this._gridVisuals[row]?.length ?? 0); col++) {
        this._gridVisuals[row][col]?.destroy();
      }
    }
    this._gridVisuals = [];

    // Redraw
    this._drawArena();
  }

  /*  ════════════════════════════════════════════════════════════
      End Conditions
      ════════════════════════════════════════════════════════════ */

  _checkEndConditions() {
    if (this.manager.isVictory()) {
      this.scene.start(SCENE_KEYS.END_BATTLE, { victory: true });
    } else if (this.manager.isDefeat()) {
      this.scene.start(SCENE_KEYS.END_BATTLE, { victory: false });
    }
  }

  update(_time, _delta) {
    // Reserved for future per-frame battle logic
  }
}
