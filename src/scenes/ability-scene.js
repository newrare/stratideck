import Phaser from 'phaser';
import { BaseScene } from './base-scene.js';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT, DEPTH } from '../configs/constants.js';
import { Button } from '../components/button.js';
import { Title } from '../components/title.js';
import { InGameMenu } from '../components/in-game-menu.js';
import { AbilityVisual } from '../components/ability-visual.js';
import { Ability } from '../entities/ability.js';
import { i18n } from '../managers/i18n-manager.js';
import { saveManager } from '../managers/save-manager.js';

const CIRCLE_DIAMETER = 120;
const ITEM_GAP_X = 24;
const ITEM_GAP_Y = 24;
const GRID_TOP = 80;
const COLS = 8;

/**
 * AbilityScene — displays all abilities in a scrollable grid of circles.
 */
export class AbilityScene extends BaseScene {
  constructor() {
    super({ key: SCENE_KEYS.ABILITY });
  }

  create() {
    this._abilityVisuals = [];

    // Title
    new Title(this, GAME_WIDTH / 2, 36, i18n.t('ability.title'));

    // Navigation
    if (saveManager.get('gameInProgress')) {
      new InGameMenu(this);
    } else {
      new Button(this, this.sz.rightOf(160), 36, i18n.t('nav.titleScreen'), () => {
        this.scene.start(SCENE_KEYS.TITLE);
      }, { size: 'sm', width: 160 });
    }

    // Back to Deck button
    new Button(this, this.sz.leftOf(160), 36, i18n.t('ability.backToDeck'), () => {
      this.scene.start(SCENE_KEYS.DECK);
    }, { size: 'sm', width: 160 });

    // Build all abilities
    const allAbilities = Ability.getAll();
    this._buildAbilityGrid(allAbilities);
  }

  /** @private */
  _buildAbilityGrid(abilities) {
    const cellWidth = CIRCLE_DIAMETER + ITEM_GAP_X;
    const cellHeight = CIRCLE_DIAMETER + ITEM_GAP_Y;
    const rows = Math.ceil(abilities.length / COLS);
    const totalHeight = rows * cellHeight + GRID_TOP + ITEM_GAP_Y;

    abilities.forEach((ability, index) => {
      const col = index % COLS;
      const row = Math.floor(index / COLS);
      const x = this.sz.left + col * cellWidth + CIRCLE_DIAMETER / 2;
      const y = GRID_TOP + row * cellHeight + CIRCLE_DIAMETER / 2;

      const visual = new AbilityVisual(this, x, y, ability);
      this._abilityVisuals.push(visual);
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
