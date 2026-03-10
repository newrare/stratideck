import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../configs/constants.js';
import { Button } from '../components/button.js';
import { Title } from '../components/title.js';
import { InGameMenu } from '../components/in-game-menu.js';
import { i18n } from '../managers/i18n-manager.js';

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
