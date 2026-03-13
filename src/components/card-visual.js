import '../styles/card.css';
import { DEPTH } from '../configs/constants.js';
import { i18n } from '../managers/i18n-manager.js';
import { Modal } from './modal.js';

/** Card visual dimensions */
export const CARD_WIDTH = 245;
export const CARD_HEIGHT = 358;



/**
 * Full visual representation of a Card entity using real HTML/CSS via Phaser DOMElement.
 * Produces the exact same rendering as docs/card-styles-preview.html.
 */
export class CardVisual {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x - Center X position (ignored when `options.container` is set).
   * @param {number} y - Center Y position (ignored when `options.container` is set).
   * @param {import('../entities/card.js').Card} card
   * @param {object} [options={}]
   * @param {HTMLElement} [options.container] - DOM element to append the card to instead of
   *   using `scene.add.dom()`. When set, `domElement` will be `null` and click interactions
   *   are not wired; the container owns lifecycle/cleanup.
   */
  constructor(scene, x, y, card, options = {}) {
    this.scene = scene;
    this.card = card;
    this.x = x;
    this.y = y;
    this._options = options;
    this.domElement = null;

    this._draw();
  }

  /** @private */
  _draw() {
    const { scene, card, x, y } = this;
    const { container } = this._options;

    // Resolve background image URL — empty string if asset not loaded
    let bgUrl = '';
    if (scene.textures.exists(card.imageKey)) {
      const source = scene.textures.get(card.imageKey).getSourceImage();
      if (source?.src) bgUrl = source.src;
    }

    // Build ability slot HTML
    const slotsHTML = card.abilities
      .map((a) => `<div class="cv-slot">${a ? '⚜' : '•'}</div>`)
      .join('');

    // Build card HTML (identical structure to card-styles-preview.html)
    const html = `
      <div class="cv-wrap">
        <div class="cv-badge">${card.rankLabel}</div>
        <div class="cv-card">
          <div class="cv-bg-img" style="background-image:url('${bgUrl}')"></div>
          <div class="cv-overlay"></div>
          <div class="cv-type-num">${card.typeLevel}</div>
          <div class="cv-content">
            <div class="cv-type" data-action="type">${card.typeName}</div>
            <div class="cv-title" data-action="name">${card.characterName}</div>
            <div class="cv-desc">${i18n.t(card.descriptionKey)}</div>
            <div class="cv-footer">${slotsHTML}</div>
          </div>
          <div class="cv-id">#${card.id}</div>
        </div>
      </div>
    `;

    // Create a real DOM element
    const el = document.createElement('div');
    el.innerHTML = html;
    const wrap = el.firstElementChild;

    // Apply CSS custom properties from the card's type palette
    if (card.css) {
      for (const [prop, value] of Object.entries(card.css)) {
        wrap.style.setProperty(prop, value);
      }
    }

    // Container mode — append to a host element without Phaser positioning
    if (container) {
      container.appendChild(wrap);
      this.domElement = null;
      return;
    }

    // Add to Phaser as a DOMElement
    this.domElement = scene.add.dom(x, y, wrap);
    this.domElement.setDepth(DEPTH.ENTITIES);

    // Wire up click interactions
    this.domElement.addListener('click');
    this.domElement.on('click', (event) => {
      const action = event.target.closest('[data-action]')?.dataset?.action;
      if (action === 'type') {
        this._showTypeModal();
      } else if (action === 'name') {
        this._showPersonalityModal();
      }
    });
  }

  /** @private */
  _showTypeModal() {
    new Modal(this.scene, {
      title: this.card.typeName,
      body: i18n.t(this.card.descriptionKey),
      confirmLabel: i18n.t('modal.ok'),
    });
  }

  /** @private */
  _showPersonalityModal() {
    new Modal(this.scene, {
      title: this.card.characterName,
      body: i18n.t(this.card.personalityI18nKey),
      confirmLabel: i18n.t('modal.ok'),
    });
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
