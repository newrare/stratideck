import Phaser from 'phaser';
import { COLORS } from '../configs/constants.js';

/**
 * Reusable title text component.
 */
export class Title {
  /**
   * @param {Phaser.Scene} scene - The scene to add the title to.
   * @param {number} x - X position (center).
   * @param {number} y - Y position (center).
   * @param {string} label - Title text.
   * @param {object} [options] - Optional style overrides.
   */
  constructor(scene, x, y, label, options = {}) {
    const fontSize = options.fontSize ?? '56px';
    const color = options.color ?? '#ffffff';

    this.text = scene.add
      .text(x, y, label, {
        fontSize,
        color,
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);
  }

  /**
   * @param {string} label
   */
  setText(label) {
    this.text.setText(label);
  }

  destroy() {
    this.text.destroy();
  }
}
