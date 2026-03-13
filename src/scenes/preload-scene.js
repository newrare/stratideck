import Phaser from 'phaser';
import { BaseScene } from './base-scene.js';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT, COLORS } from '../configs/constants.js';

/**
 * PreloadScene — loads all game assets and displays a progress bar.
 */
export class PreloadScene extends BaseScene {
  constructor() {
    super({ key: SCENE_KEYS.PRELOAD });
  }

  preload() {
    this._createProgressBar();
    this._loadAssets();
  }

  create() {
    this.scene.start(SCENE_KEYS.TITLE);
  }

  /** @private */
  _createProgressBar() {
    const barWidth = 400;
    const barHeight = 30;
    const x = (GAME_WIDTH - barWidth) / 2;
    const y = GAME_HEIGHT / 2;

    const bg = this.add.graphics();
    bg.fillStyle(COLORS.DARK, 0.8);
    bg.fillRect(x, y, barWidth, barHeight);

    const bar = this.add.graphics();

    this.load.on('progress', (value) => {
      bar.clear();
      bar.fillStyle(COLORS.PRIMARY, 1);
      bar.fillRect(x, y, barWidth * value, barHeight);
    });

    this.load.on('complete', () => {
      bar.destroy();
      bg.destroy();
    });
  }

  /** @private */
  _loadAssets() {
    // TODO: Load individual card images, spritesheets, audio, etc.
    // this.load.image('card_001', 'assets/images/cards/card_001.png');
    // this.load.audio('bgm', 'assets/audio/music/theme.mp3');
  }
}
