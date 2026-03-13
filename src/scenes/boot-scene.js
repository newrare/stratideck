import { BaseScene } from './base-scene.js';
import { SCENE_KEYS } from '../configs/constants.js';

/**
 * BootScene — first scene loaded.
 * Handles minimal setup before handing off to PreloadScene.
 */
export class BootScene extends BaseScene {
  constructor() {
    super({ key: SCENE_KEYS.BOOT });
  }

  create() {
    this.scene.start(SCENE_KEYS.PRELOAD);
  }
}
