import Phaser from 'phaser';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  SAFE_LEFT,
  SAFE_RIGHT,
  SAFE_WIDTH,
} from '../configs/constants.js';

/**
 * BaseScene — base class for all game scenes.
 *
 * Exposes `this.sz` (safe zone) so every scene can position UI elements
 * without importing constants or doing manual SAFE_* arithmetic.
 * Backgrounds may still use GAME_WIDTH / GAME_HEIGHT directly.
 *
 * Usage:
 *   new Button(this, this.sz.rightOf(200), 36, ...)  // right-anchored 200px button
 *   new Button(this, this.sz.leftOf(160), 36, ...)   // left-anchored  160px button
 *   new Title(this, this.sz.cx, 36, ...)             // centered
 */
export class BaseScene extends Phaser.Scene {
  /**
   * Safe-zone layout helpers.
   * - `.left`    : inner left boundary  (no UI element's edge should go beyond this)
   * - `.right`   : inner right boundary
   * - `.cx`      : horizontal center (= GAME_WIDTH / 2)
   * - `.cy`      : vertical center   (= GAME_HEIGHT / 2)
   * - `.width`   : usable horizontal width between the two safe boundaries
   * - `.leftOf(w)`  : X center for an element of width `w` pinned to the left edge
   * - `.rightOf(w)` : X center for an element of width `w` pinned to the right edge
   */
  get sz() {
    return {
      left:    SAFE_LEFT,
      right:   SAFE_RIGHT,
      cx:      GAME_WIDTH / 2,
      cy:      GAME_HEIGHT / 2,
      width:   SAFE_WIDTH,
      leftOf:  (w) => SAFE_LEFT + w / 2,
      rightOf: (w) => SAFE_RIGHT - w / 2,
    };
  }
}
