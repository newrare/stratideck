import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT, COLORS } from '../configs/constants.js';

/**
 * PreloadScene — loads all game assets and displays a progress bar.
 */
export class PreloadScene extends Phaser.Scene {
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
    // TODO: Load images, spritesheets, audio, etc.
    // Files are served from public/assets/ — use root-relative paths:
    // this.load.image('logo', 'assets/images/logo.png');
    // this.load.audio('bgm', 'assets/audio/music/theme.mp3');
    // this.load.atlas('sprites', 'assets/spritesheets/atlas.png', 'assets/spritesheets/atlas.json');
  }
}
