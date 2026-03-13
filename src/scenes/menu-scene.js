import Phaser from 'phaser';
import { BaseScene } from './base-scene.js';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../configs/constants.js';
import { Button } from '../components/button.js';
import { Title } from '../components/title.js';
import { i18n } from '../managers/i18n-manager.js';

/**
 * MenuScene — main menu screen.
 */
export class MenuScene extends BaseScene {
  constructor() {
    super({ key: SCENE_KEYS.MENU });
  }

  create() {
    super.create();
    new Title(this, GAME_WIDTH / 2, 180, i18n.t('menu.title'));

    new Button(this, GAME_WIDTH / 2, GAME_HEIGHT / 2, i18n.t('menu.play'), () => {
      this.scene.start(SCENE_KEYS.GAME);
    });
  }
}
