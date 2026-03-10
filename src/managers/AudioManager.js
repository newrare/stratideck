/**
 * AudioManager — handles music and sound effects playback.
 */
export class AudioManager {
  /** @param {Phaser.Scene} scene */
  constructor(scene) {
    this.scene = scene;
    this.musicVolume = 0.5;
    this.sfxVolume = 0.7;
    this.currentMusic = null;
  }

  /**
   * Play background music (loops by default).
   * @param {string} key - Audio asset key.
   * @param {object} [config]
   */
  playMusic(key, config = {}) {
    this.stopMusic();
    this.currentMusic = this.scene.sound.add(key, {
      loop: true,
      volume: this.musicVolume,
      ...config,
    });
    this.currentMusic.play();
  }

  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic.destroy();
      this.currentMusic = null;
    }
  }

  /**
   * Play a one-shot sound effect.
   * @param {string} key - Audio asset key.
   */
  playSfx(key) {
    this.scene.sound.play(key, { volume: this.sfxVolume });
  }

  /** @param {number} vol - 0 to 1 */
  setMusicVolume(vol) {
    this.musicVolume = vol;
    if (this.currentMusic) {
      this.currentMusic.setVolume(vol);
    }
  }

  /** @param {number} vol - 0 to 1 */
  setSfxVolume(vol) {
    this.sfxVolume = vol;
  }
}
