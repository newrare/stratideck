import Phaser from 'phaser';
import { COLORS } from '../configs/constants.js';

/**
 * Reusable button component.
 */
export class Button {
  /**
   * @param {Phaser.Scene} scene - The scene to add the button to.
   * @param {number} x - X position (center).
   * @param {number} y - Y position (center).
   * @param {string} label - Button text.
   * @param {() => void} onClick - Callback when pressed.
   * @param {object} [options] - Optional style overrides.
   */
  constructor(scene, x, y, label, onClick, options = {}) {
    const width = options.width ?? 200;
    const height = options.height ?? 60;
    const fillColor = options.fillColor ?? COLORS.PRIMARY;
    const hoverColor = options.hoverColor ?? COLORS.SECONDARY;
    const fontSize = options.fontSize ?? '24px';

    const bg = scene.add.graphics();
    bg.fillStyle(fillColor, 1);
    bg.fillRoundedRect(x - width / 2, y - height / 2, width, height, 12);

    const text = scene.add
      .text(x, y, label, {
        fontSize,
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const hitArea = scene.add.zone(x, y, width, height).setInteractive({ useHandCursor: true });

    hitArea.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(hoverColor, 1);
      bg.fillRoundedRect(x - width / 2, y - height / 2, width, height, 12);
    });

    hitArea.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(fillColor, 1);
      bg.fillRoundedRect(x - width / 2, y - height / 2, width, height, 12);
    });

    hitArea.on('pointerdown', () => {
      onClick();
    });

    this.bg = bg;
    this.text = text;
    this.hitArea = hitArea;
  }

  /**
   * Remove the button from the scene.
   */
  destroy() {
    this.bg.destroy();
    this.text.destroy();
    this.hitArea.destroy();
  }
}
