import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT, COLORS } from '../configs/constants.js';
import { Button } from '../components/Button.js';
import { Title } from '../components/Title.js';
import { InGameMenu } from '../components/InGameMenu.js';
import { i18n } from '../managers/I18nManager.js';

/**
 * BattleScene — main combat scene (placeholder).
 */
export class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.BATTLE });
  }

  create() {
    new Title(this, GAME_WIDTH / 2, 160, i18n.t('battle.title'));

    new Button(
      this,
      GAME_WIDTH / 2 - 140,
      GAME_HEIGHT / 2,
      i18n.t('battle.victory'),
      () => {
        this.scene.start(SCENE_KEYS.END_BATTLE, { victory: true });
      },
      { fillColor: COLORS.SECONDARY },
    );

    new Button(
      this,
      GAME_WIDTH / 2 + 140,
      GAME_HEIGHT / 2,
      i18n.t('battle.defeat'),
      () => {
        this.scene.start(SCENE_KEYS.END_BATTLE, { victory: false });
      },
      { fillColor: COLORS.DANGER },
    );

    new InGameMenu(this);
  }

  update(_time, _delta) {
    // Battle logic goes here
  }
}
