import { BaseScene } from './base-scene.js';
import { SCENE_KEYS } from '../configs/constants.js';
import { i18n } from '../managers/i18n-manager.js';
import { saveManager } from '../managers/save-manager.js';

/**
 * BootScene — first scene loaded.
 * Applies persisted locale then hands off to PreloadScene.
 */
export class BootScene extends BaseScene {
  constructor() {
    super({ key: SCENE_KEYS.BOOT });
  }

  create() {
    const savedLocale = saveManager.get('locale');
    if (savedLocale) i18n.setLocale(savedLocale);
    this.scene.start(SCENE_KEYS.PRELOAD);
  }
}
