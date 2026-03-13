import '../styles/card.css';
import { DEPTH } from '../configs/constants.js';

/** Tiny card dimensions */
export const CARD_SIZE = 55;

/**
 * Tiny visual representation of a Card entity using real HTML/CSS via Phaser DOMElement.
 * 55×55 square showing only the type number and rank label.
 * Matches the card-tiny section of card-styles-mini-preview.html.
 */
export class CardVisualTiny {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x - Center X position.
   * @param {number} y - Center Y position.
   * @param {import('../entities/card.js').Card} card
   */
  constructor(scene, x, y, card) {
    this.scene = scene;
    this.card = card;
    this.x = x;
    this.y = y;
    this.domElement = null;

    this._draw();
  }

  /** @private */
  _draw() {
    const { scene, card, x, y } = this;

    // Resolve background image URL — empty string if asset not loaded
    let bgUrl = '';
    if (scene.textures.exists(card.imageKey)) {
      const source = scene.textures.get(card.imageKey).getSourceImage();
      if (source?.src) bgUrl = source.src;
    }

    const html = `
      <div class="cvm-wrap">
        <div class="cvm-card cvm-tiny">
          <div class="cvm-bg-img" style="background-image:url('${bgUrl}')"></div>
          <div class="cvm-overlay"></div>
          <div class="cvm-type-num">${card.typeLevel}</div>
          <div class="cvm-content">
            <div class="cvm-label">${card.rankLabel}</div>
          </div>
        </div>
      </div>
    `;

    const el = document.createElement('div');
    el.innerHTML = html;
    const wrap = el.firstElementChild;

    if (card.css) {
      for (const [prop, value] of Object.entries(card.css)) {
        wrap.style.setProperty(prop, value);
      }
    }

    this.domElement = scene.add.dom(x, y, wrap);
    this.domElement.setDepth(DEPTH.ENTITIES);
  }

  /**
   * Remove the DOM element from the scene.
   */
  destroy() {
    if (this.domElement) {
      this.domElement.destroy();
      this.domElement = null;
    }
  }
}
