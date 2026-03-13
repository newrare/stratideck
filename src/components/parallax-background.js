import { GAME_WIDTH, GAME_HEIGHT, DEPTH } from '../configs/constants.js';

/** Cloud-1 horizontal drift speed in pixels per second (left → right). */
const CLOUD1_SPEED = 27;

/** Cloud-2 horizontal drift speed in pixels per second (right → left). */
const CLOUD2_SPEED = 19;

/**
 * ParallaxBackground — multi-layer animated night background.
 *
 * Layers (back → front, by depth):
 *   sky      (DEPTH.BACKGROUND - 8) — full-screen; smooth alpha + tint oscillation (day/night)
 *   cloud-1  (DEPTH.BACKGROUND - 7) — drifts left → right; between sky and rock
 *   rock     (DEPTH.BACKGROUND - 6) — full-screen; static
 *   cloud-2  (DEPTH.BACKGROUND - 5) — drifts right → left; between rock and grounds
 *   ground-1 (DEPTH.BACKGROUND - 4) — full-screen; static (furthest back ground)
 *   cloud-2b (DEPTH.BACKGROUND - 3) — cloud-2 duplicate; between ground-1 and ground-3; Y +200 px
 *   ground-2 (DEPTH.BACKGROUND - 2) — full-screen; static
 *   ground-3 (DEPTH.BACKGROUND - 1) — full-screen; static (front ground)
 *
 * Lifecycle is tied to the scene: all GameObjects and listeners are cleaned up
 * automatically on scene shutdown.
 *
 * @example
 * // In BaseScene.create() — all concrete scenes inherit it via super.create():
 * this._background = new ParallaxBackground(this);
 */
export class ParallaxBackground {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this._buildLayers();
    this._startAnimations();
    scene.events.on('update', this._onUpdate, this);
    scene.events.once('shutdown', this.destroy, this);
  }

  // ---------------------------------------------------------------------------
  // Private — build

  /** @private */
  _buildLayers() {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const base = DEPTH.BACKGROUND;

    // Full-screen static / animated layers
    this._sky = this.scene.add
      .image(cx, cy, 'bg-sky')
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(base - 8);

    // cloud-1: between sky and rock, drifts left → right.
    this._cloud1 = this.scene.add
      .image(-1, this._randomCloudY(), 'bg-cloud-1')
      .setDepth(base - 7);
    this._cloud1.x = -this._cloud1.width / 2;

    this._rock = this.scene.add
      .image(cx, cy, 'bg-rock')
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(base - 6);

    // cloud-2: between rock and grounds, drifts right → left.
    this._cloud2 = this.scene.add
      .image(0, this._randomCloudY(), 'bg-cloud-2')
      .setDepth(base - 5);
    this._cloud2.x = GAME_WIDTH + this._cloud2.width / 2;

    this._ground1 = this.scene.add
      .image(cx, cy, 'bg-ground-1')
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(base - 4);

    // cloud-2b: independent instance of bg-cloud-2, between ground-1 and ground-2.
    // Starts at a random X already on-screen (different phase from cloud-2),
    // with its own random alpha and optional flip so it never looks like a copy.
    this._cloud2b = this.scene.add
      .image(0, this._randomCloudYLow(), 'bg-cloud-2')
      .setDepth(base - 3)
      .setAlpha(0.05 + Math.random() * 0.95)
      .setFlipX(Math.random() < 0.5);
    // Place it at a random horizontal position already within the visible area
    // so the two cloud-2 instances are never in sync.
    this._cloud2b.x = Math.round(Math.random() * (GAME_WIDTH + this._cloud2b.width)) - this._cloud2b.width / 2;

    this._ground2 = this.scene.add
      .image(cx, cy, 'bg-ground-2')
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(base - 2);

    this._ground3 = this.scene.add
      .image(cx, cy, 'bg-ground-3')
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(base - 1);
  }

  // ---------------------------------------------------------------------------
  // Private — animations

  /** @private */
  _startAnimations() {
    /**
     * Sky — smooth counter-based tween that interpolates both alpha (1.0 → 0.25)
     * and tint (white → deep blue) each frame, eliminating abrupt jumps at
     * cycle boundaries. Sine easing slows naturally at both extremes.
     */
    this.scene.tweens.addCounter({
      from: 0,
      to: 100,
      duration: 8000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: (tween) => {
        const t = tween.getValue() / 100;
        this._sky.setAlpha(1.0 - t * 0.75);
        const r = Math.round(0xff + t * (0x44 - 0xff));
        const g = Math.round(0xff + t * (0x55 - 0xff));
        const b = Math.round(0xff + t * (0xaa - 0xff));
        this._sky.setTint((r << 16) | (g << 8) | b);
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Private — update loop

  /**
   * Called every frame via the scene 'update' event.
   * @param {number} _time
   * @param {number} delta — elapsed milliseconds since last frame
   * @private
   */
  _onUpdate(_time, delta) {
    const dt = delta / 1000;

    // cloud-1 — drifts left → right
    this._cloud1.x += CLOUD1_SPEED * dt;
    if (this._cloud1.x > GAME_WIDTH + this._cloud1.displayWidth / 2) {
      this._resetCloud1();
    }

    // cloud-2 — drifts right → left
    this._cloud2.x -= CLOUD2_SPEED * dt;
    if (this._cloud2.x < -this._cloud2.displayWidth / 2) {
      this._resetCloud2();
    }

    // cloud-2b duplicate — drifts right → left (same direction as cloud-2)
    this._cloud2b.x -= CLOUD2_SPEED * dt;
    if (this._cloud2b.x < -this._cloud2b.displayWidth / 2) {
      this._resetCloud2b();
    }
  }

  /** @private */
  _resetCloud1() {
    this._cloud1.x = -this._cloud1.displayWidth / 2;
    this._cloud1.y = this._randomCloudY();
    this._cloud1.setAlpha(0.05 + Math.random() * 0.95);
    if (Math.random() < 0.4) {
      this._cloud1.setFlipX(!this._cloud1.flipX);
    }
  }

  /** @private */
  _resetCloud2() {
    this._cloud2.x = GAME_WIDTH + this._cloud2.displayWidth / 2;
    this._cloud2.y = this._randomCloudY();
    this._cloud2.setAlpha(0.05 + Math.random() * 0.95);
    if (Math.random() < 0.4) {
      this._cloud2.setFlipX(!this._cloud2.flipX);
    }
  }

  /** @private */
  _resetCloud2b() {
    this._cloud2b.x = GAME_WIDTH + this._cloud2b.displayWidth / 2;
    this._cloud2b.y = this._randomCloudYLow();
    this._cloud2b.setAlpha(0.05 + Math.random() * 0.95);
    if (Math.random() < 0.4) {
      this._cloud2b.setFlipX(!this._cloud2b.flipX);
    }
  }

  /**
   * Returns a random Y in the upper portion of the screen (clouds behind rock).
   * @returns {number}
   * @private
   */
  _randomCloudY() {
    const min = 60;
    const max = GAME_HEIGHT - 220;
    return Math.round(min + Math.random() * (max - min));
  }

  /**
   * Returns a random Y 200 px lower than the normal cloud range (cloud-2b).
   * @returns {number}
   * @private
   */
  _randomCloudYLow() {
    const min = 260;
    const max = GAME_HEIGHT - 60;
    return Math.round(min + Math.random() * (max - min));
  }

  // ---------------------------------------------------------------------------
  // Public

  /**
   * Destroy all GameObjects and remove the scene event listener.
   * Called automatically on scene shutdown; safe to call manually.
   */
  destroy() {
    this.scene?.events.off('update', this._onUpdate, this);

    for (const img of [
      this._sky,
      this._rock,
      this._ground3,
      this._ground2,
      this._ground1,
      this._cloud2,
      this._cloud2b,
      this._cloud1,
    ]) {
      img?.destroy();
    }
  }
}
