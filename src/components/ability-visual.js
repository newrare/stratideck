import { DEPTH, COLORS } from '../configs/constants.js';
import { i18n } from '../managers/i18n-manager.js';
import { Modal } from './modal.js';

/** Ability visual dimensions */
const CIRCLE_RADIUS = 60;
const IMAGE_SIZE = 40;

/**
 * Visual representation of an Ability entity in a Phaser scene.
 * Renders as a circle with image, title, and usage info.
 */
export class AbilityVisual {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x - Center X position.
   * @param {number} y - Center Y position.
   * @param {import('../entities/ability.js').Ability} ability
   */
  constructor(scene, x, y, ability) {
    this.scene = scene;
    this.ability = ability;
    this.x = x;
    this.y = y;
    this.elements = [];

    this._draw();
  }

  /** @private */
  _draw() {
    const { scene, ability, x, y } = this;

    // Circle background
    const bg = scene.add.graphics();
    bg.fillStyle(COLORS.DARK, 1);
    bg.fillCircle(x, y, CIRCLE_RADIUS);
    bg.lineStyle(2, COLORS.PRIMARY, 0.8);
    bg.strokeCircle(x, y, CIRCLE_RADIUS);
    bg.setDepth(DEPTH.ENTITIES);
    this.elements.push(bg);

    // Image placeholder (centered "?" text)
    const imgPlaceholder = scene.add
      .text(x, y, '?', {
        fontSize: '36px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.ENTITIES + 2);
    this.elements.push(imgPlaceholder);

    // Title (top of circle) — clickable
    const titleText = scene.add
      .text(x, y - CIRCLE_RADIUS + 14, ability.title, {
        fontSize: '10px',
        color: '#ffffff',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: CIRCLE_RADIUS * 2 - 16 },
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.ENTITIES + 2);
    titleText.setInteractive({ useHandCursor: true });
    titleText.on('pointerdown', () => {
      this._showDescriptionModal();
    });
    this.elements.push(titleText);

    // Footer: total uses | #id (bottom of circle)
    const footerText = scene.add
      .text(x, y + CIRCLE_RADIUS - 14, `${ability.totalUses} | #${ability.id}`, {
        fontSize: '8px',
        color: '#aaaaaa',
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.ENTITIES + 2);
    this.elements.push(footerText);
  }

  /** @private */
  _showDescriptionModal() {
    new Modal(this.scene, {
      title: this.ability.title,
      body: i18n.t(this.ability.descriptionKey),
      confirmLabel: i18n.t('modal.ok'),
    });
  }

  /**
   * Remove all visual elements from the scene.
   */
  destroy() {
    this.elements.forEach((el) => {
      if (el.destroy) {
        el.destroy();
      }
    });
    this.elements = [];
  }
}
