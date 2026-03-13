import '../styles/modal.css';
import { GAME_WIDTH, DEPTH, SCENE_KEYS } from '../configs/constants.js';
import { Button } from './button.js';
import { i18n } from '../managers/i18n-manager.js';
import { saveManager } from '../managers/save-manager.js';

/**
 * In-game navigation menu — top-right toggle button + DOM modal overlay.
 * Only visible when a game is in progress.
 */
export class InGameMenu {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.isOpen = false;
    this._overlay = null;
    this._onKeyDown = this._onKeyDown.bind(this);

    if (!saveManager.get('gameInProgress')) return;

    this.toggleBtn = new Button(scene, GAME_WIDTH - 60, 35, '\u2630', () => this._openMenu(), {
      variant: 'ghost',
      size: 'sm',
      width: 80,
    });
    this.toggleBtn.setDepth(DEPTH.UI);
  }

  /** @private */
  _openMenu() {
    if (this.isOpen) return;
    this.isOpen = true;

    this._overlay = document.createElement('div');
    this._overlay.className = 'm-overlay';

    const backdrop = document.createElement('div');
    backdrop.className = 'm-backdrop';
    backdrop.addEventListener('click', () => this._closeMenu());

    const shell = document.createElement('div');
    shell.className = 'm-shell';

    const box = document.createElement('div');
    box.className = 'm-box m-centered';

    const title = document.createElement('span');
    title.className = 'm-title';
    title.textContent = i18n.t('ingame.menu');
    box.appendChild(title);

    const divider = document.createElement('div');
    divider.className = 'm-divider';
    box.appendChild(divider);

    const items = [
      { label: i18n.t('ingame.baseCamp'), scene: SCENE_KEYS.BASE_CAMP },
      { label: i18n.t('ingame.map'), scene: SCENE_KEYS.MAP },
      { label: i18n.t('ingame.deck'), scene: SCENE_KEYS.DECK },
      { label: i18n.t('ingame.abilities'), scene: SCENE_KEYS.ABILITY },
      { label: i18n.t('ingame.options'), scene: SCENE_KEYS.OPTIONS },
      { label: i18n.t('ingame.quitGame'), scene: SCENE_KEYS.TITLE, quit: true },
    ];

    const navList = document.createElement('div');
    navList.className = 'm-nav-list';

    items.forEach((item) => {
      new Button(this.scene, 0, 0, item.label, () => {
        if (item.quit) {
          saveManager.set('gameInProgress', false);
        }
        this._closeMenu();
        this.scene.scene.start(item.scene);
      }, {
        variant: item.quit ? 'danger' : 'default',
        container: navList,
      });
    });

    box.appendChild(navList);
    shell.appendChild(box);
    this._overlay.appendChild(backdrop);
    this._overlay.appendChild(shell);
    document.body.appendChild(this._overlay);

    document.addEventListener('keydown', this._onKeyDown);
    requestAnimationFrame(() => this._overlay?.classList.add('m-open'));
  }

  /** @private */
  _onKeyDown(e) {
    if (e.key === 'Escape') this._closeMenu();
  }

  /** @private */
  _closeMenu() {
    if (!this.isOpen) return;
    this.isOpen = false;
    document.removeEventListener('keydown', this._onKeyDown);
    this._overlay?.remove();
    this._overlay = null;
  }

  destroy() {
    this._closeMenu();
    this.toggleBtn?.destroy();
  }
}
