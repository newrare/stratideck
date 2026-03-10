import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../configs/constants.js';

/**
 * GameScene — main gameplay scene.
 */
export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  create() {
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Game Scene — TODO', {
        fontSize: '32px',
        color: '#ffffff',
      })
      .setOrigin(0.5);
  }

  update(_time, _delta) {
    // Game loop logic goes here
  }
}
