import { GAME_WIDTH, GAME_HEIGHT, COLORS, DEPTH, SCENE_KEYS } from '../configs/constants.js';
import { Button } from './button.js';
import { i18n } from '../managers/i18n-manager.js';
import { stateManager } from '../managers/state-manager.js';

/**
 * In-game navigation menu — top-right toggle button + modal overlay.
 * Only visible when a game is in progress.
 */
export class InGameMenu {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.isOpen = false;
    this.menuElements = [];

    if (!stateManager.get('gameInProgress')) return;

    this.toggleBtn = new Button(scene, GAME_WIDTH - 60, 35, '\u2630', () => this._openMenu(), {
      width: 80,
      height: 45,
      fontSize: '28px',
    });

    this.toggleBtn.bg.setDepth(DEPTH.UI);
    this.toggleBtn.text.setDepth(DEPTH.UI);
    this.toggleBtn.hitArea.setDepth(DEPTH.UI);
  }

  /** @private */
  _openMenu() {
    if (this.isOpen) return;
    this.isOpen = true;

    const overlay = this.scene.add.graphics();
    overlay.fillStyle(COLORS.BLACK, 0.6);
    overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    overlay.setDepth(DEPTH.MODAL);
    this.menuElements.push(overlay);

    const blocker = this.scene.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT);
    blocker.setDepth(DEPTH.MODAL);
    blocker.setInteractive();
    blocker.on('pointerdown', () => this._closeMenu());
    this.menuElements.push(blocker);

    const modalWidth = 400;
    const modalHeight = 420;
    const modalX = (GAME_WIDTH - modalWidth) / 2;
    const modalY = (GAME_HEIGHT - modalHeight) / 2;

    const bg = this.scene.add.graphics();
    bg.fillStyle(COLORS.DARK, 1);
    bg.fillRoundedRect(modalX, modalY, modalWidth, modalHeight, 16);
    bg.setDepth(DEPTH.MODAL + 1);
    this.menuElements.push(bg);

    const title = this.scene.add
      .text(GAME_WIDTH / 2, modalY + 35, i18n.t('ingame.menu'), {
        fontSize: '28px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.MODAL + 2);
    this.menuElements.push(title);

    const items = [
      { label: i18n.t('ingame.baseCamp'), scene: SCENE_KEYS.BASE_CAMP },
      { label: i18n.t('ingame.map'), scene: SCENE_KEYS.MAP },
      { label: i18n.t('ingame.deck'), scene: SCENE_KEYS.DECK },
      { label: i18n.t('ingame.options'), scene: SCENE_KEYS.OPTIONS },
      { label: i18n.t('ingame.quitGame'), scene: SCENE_KEYS.TITLE, quit: true },
    ];

    const startY = modalY + 90;
    items.forEach((item, index) => {
      const btn = new Button(
        this.scene,
        GAME_WIDTH / 2,
        startY + index * 62,
        item.label,
        () => {
          if (item.quit) {
            stateManager.set('gameInProgress', false);
          }
          this.scene.scene.start(item.scene);
        },
        {
          width: 300,
          height: 50,
          fontSize: '20px',
          ...(item.quit ? { fillColor: COLORS.DANGER } : {}),
        },
      );
      btn.bg.setDepth(DEPTH.MODAL + 2);
      btn.text.setDepth(DEPTH.MODAL + 2);
      btn.hitArea.setDepth(DEPTH.MODAL + 2);
      this.menuElements.push(btn);
    });
  }

  /** @private */
  _closeMenu() {
    this.isOpen = false;
    this.menuElements.forEach((el) => {
      if (el.destroy) {
        el.destroy();
      }
    });
    this.menuElements = [];
  }

  destroy() {
    this._closeMenu();
    this.toggleBtn?.destroy();
  }
}
