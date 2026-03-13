import Phaser from 'phaser';
import { BaseScene } from './base-scene.js';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../configs/constants.js';
import { Button } from '../components/button.js';
import { Title } from '../components/title.js';
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
    this.menuButtons = [];

    new Title(this, GAME_WIDTH / 2, 160, i18n.t('menu.title'));

    this.pressText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, i18n.t('title.pressStart'), {
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

    const cx = GAME_WIDTH / 2;
    let y = 300;
    const spacing = 65;

    // New Game
    this.menuButtons.push(
      new Button(this, cx, y, i18n.t('title.newGame'), () => this._handleNewGame()),
    );
    y += spacing;

    // Continue (only if game in progress)
    if (saveManager.get('gameInProgress')) {
      this.menuButtons.push(
        new Button(this, cx, y, i18n.t('title.continue'), () => {
          this.scene.start(SCENE_KEYS.BASE_CAMP);
        }),
      );
      y += spacing;
    }

    // Deck
    this.menuButtons.push(
      new Button(this, cx, y, i18n.t('title.deck'), () => {
        this.scene.start(SCENE_KEYS.DECK);
      }),
    );
    y += spacing;

    // Abilities
    this.menuButtons.push(
      new Button(this, cx, y, i18n.t('title.abilities'), () => {
        this.scene.start(SCENE_KEYS.ABILITY);
      }),
    );
    y += spacing;

    // Options
    this.menuButtons.push(
      new Button(this, cx, y, i18n.t('title.options'), () => {
        this.scene.start(SCENE_KEYS.OPTIONS);
      }),
    );
    y += spacing;

    // Quit
    this.menuButtons.push(
      new Button(this, cx, y, i18n.t('title.quit'), () => window.close(), { variant: 'danger' }),
    );
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
