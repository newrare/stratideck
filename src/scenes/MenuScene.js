import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT, COLORS } from '../configs/constants.js';
import { Button } from '../components/Button.js';
import { Title } from '../components/Title.js';
import { i18n } from '../managers/I18nManager.js';

/**
 * MenuScene — main menu screen.
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.MENU });
  }

  create() {
    new Title(this, GAME_WIDTH / 2, 180, i18n.t('menu.title'));

    new Button(this, GAME_WIDTH / 2, GAME_HEIGHT / 2, i18n.t('menu.play'), () => {
      this.scene.start(SCENE_KEYS.GAME);
    });
  }
}
