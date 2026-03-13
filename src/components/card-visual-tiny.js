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
   * @param {object} [options={}]
   * @param {'normal'|'mystery'|'attack'|'win'|'last'|'loose'} [options.mode='normal'] - Render mode.
   *   `normal` : shows real card art/label.
   *   `mystery`: grey static face-down (unreachable).
   *   `attack` : rainbow-animated face-down (attackable target).
   *   `win`    : survived a previous versus — colorful gradient frozen, big `?` visible.
   *   `last`   : survived the most recent versus — colorful gradient frozen, no `?`.
   *   `loose`  : just defeated — transparent ghost with spinning violet border (one draw cycle).
   */
  constructor(scene, x, y, card, options = {}) {
    this.scene = scene;
    this.card = card;
    this.x = x;
    this.y = y;
    this.mode = options.mode ?? 'normal';
    this.domElement = null;

    this._draw();
  }

  /** @private */
  _draw() {
    const { scene, card, x, y, mode } = this;

    // Loose mode — ghost cell: transparent 55×55 square, spinning violet border
    if (mode === 'loose') {
      const ghostEl = document.createElement('div');
      ghostEl.className = 'cvm-tiny-ghost';
      this.domElement = scene.add.dom(x, y, ghostEl);
      this.domElement.setDepth(DEPTH.ENTITIES);
      return;
    }

    let html;

    if (mode === 'attack') {
      // Rainbow-animated face-down — attackable target
      html = `
        <div class="cvm-wrap">
          <div class="cvm-card cvm-tiny cvm-mystery">
            <div class="cvm-bg-mystery"></div>
            <div class="cvm-type-num-mystery">?</div>
            <div class="cvm-content">
              <div class="cvm-label-mystery">???</div>
            </div>
          </div>
        </div>
      `;
    } else if (mode === 'win') {
      // Survived a previous versus — colorful gradient frozen, ? visible
      html = `
        <div class="cvm-wrap">
          <div class="cvm-card cvm-tiny cvm-mystery cvm-hurt">
            <div class="cvm-bg-mystery"></div>
            <div class="cvm-type-num-mystery">?</div>
            <div class="cvm-content">
              <div class="cvm-label-mystery">???</div>
            </div>
          </div>
        </div>
      `;
    } else if (mode === 'last') {
      // Most recent surviving card — colorful gradient frozen, no ?
      html = `
        <div class="cvm-wrap">
          <div class="cvm-card cvm-tiny cvm-mystery cvm-hurt">
            <div class="cvm-bg-mystery"></div>
            <div class="cvm-content">
              <div class="cvm-label-mystery">???</div>
            </div>
          </div>
        </div>
      `;
    } else if (mode === 'mystery') {
      // Grey static face-down — unreachable
      html = `
        <div class="cvm-wrap">
          <div class="cvm-card cvm-tiny cvm-mystery-grey">
            <div class="cvm-bg-grey"></div>
            <div class="cvm-type-num-grey">?</div>
            <div class="cvm-content">
              <div class="cvm-label-grey">???</div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Normal mode — resolve background image URL, empty string if asset not loaded
      let bgUrl = '';
      if (scene.textures.exists(card.imageKey)) {
        const source = scene.textures.get(card.imageKey).getSourceImage();
        if (source?.src) bgUrl = source.src;
      }

      html = `
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
    }

    const el = document.createElement('div');
    el.innerHTML = html;
    const wrap = el.firstElementChild;

    if (mode === 'normal' && card.css) {
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
