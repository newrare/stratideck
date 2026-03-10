import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, DEPTH } from '../configs/constants.js';
import { Button } from './Button.js';

/**
 * Reusable modal overlay component.
 */
export class Modal {
  /**
   * @param {Phaser.Scene} scene - The scene to add the modal to.
   * @param {object} options
   * @param {string} options.title - Modal title text.
   * @param {string} [options.body] - Modal body text.
   * @param {string} [options.confirmLabel] - Confirm button label (default: "OK").
   * @param {() => void} [options.onConfirm] - Confirm callback.
   * @param {string} [options.cancelLabel] - Cancel button label. If set, shows a cancel button.
   * @param {() => void} [options.onCancel] - Cancel callback.
   */
  constructor(scene, options) {
    this.scene = scene;
    this.elements = [];

    const overlay = scene.add.graphics();
    overlay.fillStyle(COLORS.BLACK, 0.6);
    overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    overlay.setDepth(DEPTH.MODAL);
    this.elements.push(overlay);

    // Block input behind modal
    const blocker = scene.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT);
    blocker.setDepth(DEPTH.MODAL);
    blocker.setInteractive();
    this.elements.push(blocker);

    const modalWidth = 500;
    const modalHeight = 300;
    const modalX = (GAME_WIDTH - modalWidth) / 2;
    const modalY = (GAME_HEIGHT - modalHeight) / 2;

    const bg = scene.add.graphics();
    bg.fillStyle(COLORS.DARK, 1);
    bg.fillRoundedRect(modalX, modalY, modalWidth, modalHeight, 16);
    bg.setDepth(DEPTH.MODAL + 1);
    this.elements.push(bg);

    // Title
    const title = scene.add
      .text(GAME_WIDTH / 2, modalY + 40, options.title, {
        fontSize: '28px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.MODAL + 2);
    this.elements.push(title);

    // Body
    if (options.body) {
      const body = scene.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, options.body, {
          fontSize: '20px',
          color: '#cccccc',
          wordWrap: { width: modalWidth - 60 },
          align: 'center',
        })
        .setOrigin(0.5)
        .setDepth(DEPTH.MODAL + 2);
      this.elements.push(body);
    }

    // Buttons
    const buttonY = modalY + modalHeight - 60;

    if (options.cancelLabel) {
      const cancelBtn = new Button(
        scene,
        GAME_WIDTH / 2 - 120,
        buttonY,
        options.cancelLabel,
        () => {
          this.destroy();
          options.onCancel?.();
        },
        { fillColor: COLORS.DANGER, width: 160, height: 50, fontSize: '20px' },
      );
      this._setDepthRecursive(cancelBtn, DEPTH.MODAL + 2);
      this.elements.push(cancelBtn);
    }

    const confirmBtn = new Button(
      scene,
      options.cancelLabel ? GAME_WIDTH / 2 + 120 : GAME_WIDTH / 2,
      buttonY,
      options.confirmLabel ?? 'OK',
      () => {
        this.destroy();
        options.onConfirm?.();
      },
      { width: 160, height: 50, fontSize: '20px' },
    );
    this._setDepthRecursive(confirmBtn, DEPTH.MODAL + 2);
    this.elements.push(confirmBtn);
  }

  /** @private */
  _setDepthRecursive(component, depth) {
    if (component.bg?.setDepth) {
      component.bg.setDepth(depth);
    }
    if (component.text?.setDepth) {
      component.text.setDepth(depth);
    }
    if (component.hitArea?.setDepth) {
      component.hitArea.setDepth(depth);
    }
  }

  destroy() {
    this.elements.forEach((el) => {
      if (el.destroy) {
        el.destroy();
      }
    });
    this.elements = [];
  }
}
