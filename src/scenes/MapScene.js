import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../configs/constants.js';
import { Button } from '../components/Button.js';
import { Title } from '../components/Title.js';
import { InGameMenu } from '../components/InGameMenu.js';
import { i18n } from '../managers/I18nManager.js';

/**
 * MapScene — battle selection map.
 */
export class MapScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.MAP });
  }

  create() {
    new Title(this, GAME_WIDTH / 2, 160, i18n.t('map.title'));

    new Button(this, GAME_WIDTH / 2, GAME_HEIGHT / 2, i18n.t('map.startBattle'), () => {
      this.scene.start(SCENE_KEYS.BATTLE);
    });

    new InGameMenu(this);
  }
}
