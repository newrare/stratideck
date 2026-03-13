import Phaser from 'phaser';
import { BaseScene } from './base-scene.js';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../configs/constants.js';
import { Button } from '../components/button.js';
import { Title } from '../components/title.js';
import { InGameMenu } from '../components/in-game-menu.js';
import { i18n } from '../managers/i18n-manager.js';

/**
 * EndBattleScene — displays battle result (victory or defeat).
 */
export class EndBattleScene extends BaseScene {
  constructor() {
    super({ key: SCENE_KEYS.END_BATTLE });
  }

  init(data) {
    this.victory = data?.victory ?? false;
  }

  create() {
    super.create();
    const titleKey = this.victory ? 'endBattle.victoryTitle' : 'endBattle.defeatTitle';
    new Title(this, GAME_WIDTH / 2, 160, i18n.t(titleKey));

    new Button(
      this,
      GAME_WIDTH / 2 - 160,
      GAME_HEIGHT / 2,
      i18n.t('endBattle.backToCamp'),
      () => {
        this.scene.start(SCENE_KEYS.BASE_CAMP);
      },
      { width: 250 },
    );

    new Button(
      this,
      GAME_WIDTH / 2 + 160,
      GAME_HEIGHT / 2,
      i18n.t('endBattle.newBattle'),
      () => {
        this.scene.start(SCENE_KEYS.MAP);
      },
      { width: 250 },
    );

    new InGameMenu(this);
  }
}
