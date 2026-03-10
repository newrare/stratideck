import { DEPTH, COLORS } from '../configs/constants.js';
import { i18n } from '../managers/I18nManager.js';
import { Modal } from './Modal.js';

/** Card visual dimensions (portrait playing-card ratio ~2.5:3.5) */
const CARD_WIDTH = 140;
const CARD_HEIGHT = 196;
const CARD_RADIUS = 8;
const HEADER_HEIGHT = 24;
const FOOTER_HEIGHT = 28;
const IMAGE_SIZE = 80;

/**
 * Visual representation of a Card entity in a Phaser scene.
 */
export class CardVisual {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x - Center X position.
   * @param {number} y - Center Y position.
   * @param {import('../entities/Card.js').Card} card
   */
  constructor(scene, x, y, card) {
    this.scene = scene;
    this.card = card;
    this.x = x;
    this.y = y;
    this.elements = [];

    this._draw();
  }

  /** @private */
  _draw() {
    const { scene, card, x, y } = this;
    const left = x - CARD_WIDTH / 2;
    const top = y - CARD_HEIGHT / 2;

    // Card background
    const bg = scene.add.graphics();
    bg.fillStyle(card.color, 1);
    bg.fillRoundedRect(left, top, CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS);
    bg.lineStyle(2, COLORS.WHITE, 0.3);
    bg.strokeRoundedRect(left, top, CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS);
    bg.setDepth(DEPTH.ENTITIES);
    this.elements.push(bg);

    // Inner dark area for image
    const innerPadding = 8;
    const innerBg = scene.add.graphics();
    innerBg.fillStyle(COLORS.BLACK, 0.3);
    innerBg.fillRoundedRect(
      left + innerPadding,
      top + HEADER_HEIGHT + 4,
      CARD_WIDTH - innerPadding * 2,
      CARD_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - 32,
      4,
    );
    innerBg.setDepth(DEPTH.ENTITIES + 1);
    this.elements.push(innerBg);

    // Image placeholder (centered box with "?" text)
    const imgY = top + HEADER_HEIGHT + 4 + (CARD_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - 32) / 2;
    const imgPlaceholder = scene.add
      .text(x, imgY, '?', {
        fontSize: '36px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.ENTITIES + 2);
    this.elements.push(imgPlaceholder);

    // Header: type (left) + rank (right)
    const headerY = top + HEADER_HEIGHT / 2 + 2;

    const typeText = scene.add
      .text(left + 8, headerY, card.typeName, {
        fontSize: '10px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5)
      .setDepth(DEPTH.ENTITIES + 2);
    this.elements.push(typeText);

    // Make type clickable → show description modal
    typeText.setInteractive({ useHandCursor: true });
    typeText.on('pointerdown', () => {
      this._showTypeModal();
    });

    const rankText = scene.add
      .text(left + CARD_WIDTH - 8, headerY, card.rankLabel, {
        fontSize: '10px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(1, 0.5)
      .setDepth(DEPTH.ENTITIES + 2);
    this.elements.push(rankText);

    // Character name (centered below image)
    const nameY = top + CARD_HEIGHT - FOOTER_HEIGHT - 16;
    const nameText = scene.add
      .text(x, nameY, card.characterName, {
        fontSize: '9px',
        color: '#ffffff',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: CARD_WIDTH - 16 },
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.ENTITIES + 2);
    this.elements.push(nameText);

    // Make name clickable → show personality modal
    nameText.setInteractive({ useHandCursor: true });
    nameText.on('pointerdown', () => {
      this._showPersonalityModal();
    });

    // Footer: 3 ability dots
    const footerY = top + CARD_HEIGHT - FOOTER_HEIGHT / 2 - 2;
    const dotSpacing = 16;
    const dotsStartX = x - dotSpacing;
    for (let i = 0; i < 3; i++) {
      const dot = scene.add
        .text(dotsStartX + i * dotSpacing, footerY, '•', {
          fontSize: '16px',
          color: '#ffffff',
        })
        .setOrigin(0.5)
        .setDepth(DEPTH.ENTITIES + 2);
      this.elements.push(dot);
    }

    // Card ID (small, bottom-right)
    const idText = scene.add
      .text(left + CARD_WIDTH - 6, top + CARD_HEIGHT - 6, `#${card.id}`, {
        fontSize: '7px',
        color: '#ffffff',
      })
      .setOrigin(1, 1)
      .setDepth(DEPTH.ENTITIES + 2);
    this.elements.push(idText);
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
