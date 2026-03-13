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
    // Background parallax layers
    this.load.image('bg-sky',      'assets/images/background-night-sky.png');
    this.load.image('bg-rock',     'assets/images/background-night-rock.png');
    this.load.image('bg-plant',    'assets/images/background-night-plant.png');
    this.load.image('bg-ground-3', 'assets/images/background-night-ground-3.png');
    this.load.image('bg-ground-2', 'assets/images/background-night-ground-2.png');
    this.load.image('bg-ground-1', 'assets/images/background-night-ground-1.png');
    this.load.image('bg-cloud-2',  'assets/images/background-night-cloud-2.png');
    this.load.image('bg-cloud-1',  'assets/images/background-night-cloud-1.png');

    // Title screen logo
    this.load.image('logo-title', 'assets/images/logo-title.png');
  }
}
