import '../styles/card.css';
import { DEPTH } from '../configs/constants.js';

/** Mini card dimensions */
export const CARD_SIZE = 110;

/**
 * Mini visual representation of a Card entity using real HTML/CSS via Phaser DOMElement.
 * Square 110×110 card showing type|rank label and 3 ability slots.
 * Matches the card-styles-mini-preview.html design.
 */
export class CardVisualMini {
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
        <div class="cvm-card">
          <div class="cvm-bg-img" style="background-image:url('${bgUrl}')"></div>
          <div class="cvm-overlay"></div>
          <div class="cvm-type-num">${card.typeLevel}</div>
          <div class="cvm-content">
            <div class="cvm-label">${card.typeName} | ${card.rankLabel}</div>
            <div class="cvm-footer">
              <div class="cvm-slot"></div>
              <div class="cvm-slot"></div>
              <div class="cvm-slot"></div>
            </div>
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
