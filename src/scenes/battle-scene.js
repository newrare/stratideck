import Phaser from 'phaser';
import { BaseScene } from './base-scene.js';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../configs/constants.js';
import { Button } from '../components/button.js';
import { Title } from '../components/title.js';
import { InGameMenu } from '../components/in-game-menu.js';
import { i18n } from '../managers/i18n-manager.js';

/**
 * BattleScene — main combat scene (placeholder).
 */
export class BattleScene extends BaseScene {
  constructor() {
    super({ key: SCENE_KEYS.BATTLE });
  }

  create() {
    super.create();
    new Title(this, GAME_WIDTH / 2, 160, i18n.t('battle.title'));

    new Button(
      this,
      GAME_WIDTH / 2 - 140,
      GAME_HEIGHT / 2,
      i18n.t('battle.victory'),
      () => {
        this.scene.start(SCENE_KEYS.END_BATTLE, { victory: true });
      },
      { variant: 'success' },
    );

    new Button(
      this,
      GAME_WIDTH / 2 + 140,
      GAME_HEIGHT / 2,
      i18n.t('battle.defeat'),
      () => {
        this.scene.start(SCENE_KEYS.END_BATTLE, { victory: false });
      },
      { variant: 'danger' },
    );

    new InGameMenu(this);
  }

  update(_time, _delta) {
    // Battle logic goes here
  }
}
