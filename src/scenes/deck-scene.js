import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT, DEPTH } from '../configs/constants.js';
import { Button } from '../components/button.js';
import { Title } from '../components/title.js';
import { InGameMenu } from '../components/in-game-menu.js';
import { CardVisual } from '../components/card-visual.js';
import { Card } from '../entities/card.js';
import { i18n } from '../managers/i18n-manager.js';
import { stateManager } from '../managers/state-manager.js';

const CARD_WIDTH = 140;
const CARD_HEIGHT = 196;
const CARD_GAP_X = 16;
const CARD_GAP_Y = 16;
const GRID_TOP = 80;
const GRID_LEFT = 40;
const COLS = 8;

/**
 * DeckScene — displays the full collection of 90 cards in a scrollable grid.
 */
export class DeckScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.DECK });
  }

  create() {
    this._cardVisuals = [];

    // Title
    new Title(this, GAME_WIDTH / 2, 36, i18n.t('deck.title'));

    // Navigation
    if (stateManager.get('gameInProgress')) {
      new InGameMenu(this);
    } else {
      new Button(this, GAME_WIDTH - 100, 36, i18n.t('nav.titleScreen'), () => {
        this.scene.start(SCENE_KEYS.TITLE);
      }, { width: 160, height: 40, fontSize: '16px' });
    }

    // Build all cards
    const allCards = Card.getAll();
    this._buildCardGrid(allCards);
  }

  /** @private */
  _buildCardGrid(cards) {
    const cellWidth = CARD_WIDTH + CARD_GAP_X;
    const cellHeight = CARD_HEIGHT + CARD_GAP_Y;
    const rows = Math.ceil(cards.length / COLS);
    const totalHeight = rows * cellHeight + GRID_TOP + CARD_GAP_Y;

    // Scrollable container
    const container = this.add.container(0, 0);
    container.setDepth(DEPTH.ENTITIES);

    cards.forEach((card, index) => {
      const col = index % COLS;
      const row = Math.floor(index / COLS);
      const x = GRID_LEFT + col * cellWidth + CARD_WIDTH / 2;
      const y = GRID_TOP + row * cellHeight + CARD_HEIGHT / 2;

      const visual = new CardVisual(this, x, y, card);
      this._cardVisuals.push(visual);
    });

    // Enable scrolling if content overflows
    if (totalHeight > GAME_HEIGHT) {
      this._enableScroll(totalHeight);
    }
  }

  /** @private */
  _enableScroll(totalHeight) {
    const maxScroll = totalHeight - GAME_HEIGHT;
    let scrollY = 0;

    this.input.on('wheel', (_pointer, _gameObjects, _dx, dy) => {
      scrollY = Phaser.Math.Clamp(scrollY + dy * 0.5, 0, maxScroll);
      this.cameras.main.scrollY = scrollY;
    });

    // Touch drag scrolling
    let dragStartY = 0;
    let dragScrollY = 0;

    this.input.on('pointerdown', (pointer) => {
      dragStartY = pointer.y;
      dragScrollY = scrollY;
    });

    this.input.on('pointermove', (pointer) => {
      if (!pointer.isDown) {
        return;
      }
      const delta = dragStartY - pointer.y;
      scrollY = Phaser.Math.Clamp(dragScrollY + delta, 0, maxScroll);
      this.cameras.main.scrollY = scrollY;
    });
  }
}
