import Phaser from 'phaser';
import { BaseScene } from './base-scene.js';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT, DEPTH } from '../configs/constants.js';
import { Modal } from '../components/modal.js';
import { i18n } from '../managers/i18n-manager.js';
import { saveManager } from '../managers/save-manager.js';

/**
 * TitleScene — title screen with "press any button" then main menu.
 */
export class TitleScene extends BaseScene {
  constructor() {
    super({ key: SCENE_KEYS.TITLE });
  }

  create() {
    super.create();

    this.add
      .image(GAME_WIDTH / 2, 250, 'logo-title')
      .setScale(0.35)
      .setDepth(DEPTH.UI);

    this.pressText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 150, i18n.t('title.pressStart'), {
        fontSize: '24px',
        color: '#cccccc',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: this.pressText,
      alpha: 0.2,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    this.input.once('pointerdown', () => this._showMenu());
    this.input.keyboard.once('keydown', () => this._showMenu());
  }

  /** @private */
  _showMenu() {
    if (this.pressText) {
      this.pressText.destroy();
      this.pressText = null;
    }

    const navItems = [];

    // New Game
    navItems.push({ label: i18n.t('title.newGame'), onClick: () => this._handleNewGame() });

    // Continue (only if game in progress)
    if (saveManager.get('gameInProgress')) {
      navItems.push({
        label: i18n.t('title.continue'),
        onClick: () => this.scene.start(SCENE_KEYS.BASE_CAMP),
      });
    }

    // Deck
    navItems.push({ label: i18n.t('title.deck'), onClick: () => this.scene.start(SCENE_KEYS.DECK) });

    // Abilities
    navItems.push({ label: i18n.t('title.abilities'), onClick: () => this.scene.start(SCENE_KEYS.ABILITY) });

    // Options
    navItems.push({ label: i18n.t('title.options'), onClick: () => this.scene.start(SCENE_KEYS.OPTIONS) });

    // Quit
    navItems.push({ label: i18n.t('title.quit'), onClick: () => window.close(), variant: 'danger' });

    new Modal(this, {
      title: i18n.t('menu.title'),
      centered: true,
      closeOnBackdrop: true,
      navItems,
    });
  }

  /** @private */
  _handleNewGame() {
    if (saveManager.get('gameInProgress')) {
      new Modal(this, {
        title: i18n.t('modal.confirm'),
        body: i18n.t('title.newGameWarning'),
        confirmLabel: i18n.t('modal.yes'),
        cancelLabel: i18n.t('modal.no'),
        onConfirm: () => {
          saveManager.set('gameInProgress', true);
          saveManager.incrementStat('gamesStarted');
          this.scene.start(SCENE_KEYS.BASE_CAMP);
        },
      });
    } else {
      saveManager.set('gameInProgress', true);
      saveManager.incrementStat('gamesStarted');
      this.scene.start(SCENE_KEYS.BASE_CAMP);
    }
  }
}
