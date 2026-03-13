import Phaser from 'phaser';
import { BaseScene } from './base-scene.js';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT, DEPTH } from '../configs/constants.js';
import { Button } from '../components/button.js';
import { Title } from '../components/title.js';
import { InGameMenu } from '../components/in-game-menu.js';
import { Modal } from '../components/modal.js';
import { i18n } from '../managers/i18n-manager.js';
import { saveManager } from '../managers/save-manager.js';

/**
 * OptionsScene — game settings.
 */
export class OptionsScene extends BaseScene {
  constructor() {
    super({ key: SCENE_KEYS.OPTIONS });
  }

  create() {
    new Title(this, GAME_WIDTH / 2, 80, i18n.t('options.title'));

    // Save stats button
    new Button(this, GAME_WIDTH / 2, GAME_HEIGHT / 2, i18n.t('options.saveStats'), () => {
      this._showSaveStats();
    });

    if (saveManager.get('gameInProgress')) {
      new InGameMenu(this);
    } else {
      new Button(this, GAME_WIDTH / 2, GAME_HEIGHT - 80, i18n.t('nav.titleScreen'), () => {
        this.scene.start(SCENE_KEYS.TITLE);
      });
    }
  }

  /** @private */
  _showSaveStats() {
    const stats = saveManager.getStats();
    const lines = [
      `${i18n.t('stats.gamesStarted')}: ${stats.gamesStarted}`,
      `${i18n.t('stats.battlesPlayed')}: ${stats.battlesPlayed}`,
      `${i18n.t('stats.victories')}: ${stats.victories}`,
      `${i18n.t('stats.defeats')}: ${stats.defeats}`,
      `${i18n.t('stats.cardsUnlocked')}: ${this._countUnlockedCards()}`,
      `${i18n.t('stats.abilitiesUnlocked')}: ${this._countUnlockedAbilities()}`,
    ];

    new Modal(this, {
      title: i18n.t('options.saveStats'),
      body: lines.join('\n'),
      confirmLabel: i18n.t('modal.ok'),
    });
  }

  /** @private */
  _countUnlockedCards() {
    const cards = saveManager.get('cards') || {};
    return Object.values(cards).filter((c) => c.unlocked).length;
  }

  /** @private */
  _countUnlockedAbilities() {
    const abilities = saveManager.get('abilities') || {};
    return Object.values(abilities).filter((a) => a.unlocked).length;
  }
}
