import '../styles/button.css';
import { DEPTH } from '../configs/constants.js';

/**
 * Reusable button component — DOM-based, B-02 border-beam style.
 *
 * The animated conic ring starts on hover and reverses direction.
 * Variants map to application card-type colors.
 *
 * @example
 * new Button(scene, x, y, 'Start', () => startGame());
 * new Button(scene, x, y, 'Quit',  () => quit(),      { variant: 'danger' });
 * new Button(scene, x, y, 'Back',  () => back(),      { size: 'sm' });
 */
export class Button {
  /**
   * @param {Phaser.Scene} scene - Scene to attach the button to.
   * @param {number} x - Center X position.
   * @param {number} y - Center Y position.
   * @param {string} label - Button label text.
   * @param {() => void} onClick - Click callback.
   * @param {object} [options]
   * @param {'default'|'danger'|'success'|'ghost'} [options.variant='default']
   * @param {'md'|'sm'} [options.size='md']
   * @param {number} [options.width] - Explicit pixel width override.
   * @param {boolean} [options.disabled] - Start in disabled state.
   * @param {HTMLElement} [options.container] - Append to this DOM element instead of using scene.add.dom().
   */
  constructor(scene, x, y, label, onClick, options = {}) {
    const variant = options.variant ?? 'default';
    const size = options.size ?? 'md';

    const el = document.createElement('button');
    el.className = `btn btn-${variant} btn-${size}`;
    el.textContent = label;

    if (options.disabled) el.disabled = true;
    if (options.width) el.style.width = `${options.width}px`;

    el.addEventListener('click', () => {
      if (!el.disabled) onClick();
    });

    this._el = el;

    if (options.container) {
      options.container.appendChild(el);
      this.domElement = null;
    } else {
      this.domElement = scene.add.dom(x, y, el);
      this.domElement.setDepth(DEPTH.UI);
    }
  }

  /**
   * Set the Phaser render depth of this button.
   * @param {number} depth
   * @returns {this}
   */
  setDepth(depth) {
    this.domElement.setDepth(depth);
    return this;
  }

  /**
   * Remove the button from the scene.
   */
  destroy() {
    this.domElement?.destroy();
    this.domElement = null;
  }
}
