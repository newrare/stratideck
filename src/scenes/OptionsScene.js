import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../configs/constants.js';
import { Button } from '../components/Button.js';
import { Title } from '../components/Title.js';
import { InGameMenu } from '../components/InGameMenu.js';
import { i18n } from '../managers/I18nManager.js';
import { stateManager } from '../managers/StateManager.js';

/**
 * OptionsScene — game settings (placeholder).
 */
export class OptionsScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.OPTIONS });
  }

  create() {
    new Title(this, GAME_WIDTH / 2, 160, i18n.t('options.title'));

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, i18n.t('options.comingSoon'), {
        fontSize: '22px',
        color: '#aaaaaa',
      })
      .setOrigin(0.5);

    if (stateManager.get('gameInProgress')) {
      new InGameMenu(this);
    } else {
      new Button(this, GAME_WIDTH / 2, GAME_HEIGHT - 80, i18n.t('nav.titleScreen'), () => {
        this.scene.start(SCENE_KEYS.TITLE);
      });
    }
  }
}
