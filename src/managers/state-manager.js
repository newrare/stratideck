/**
 * StateManager — simple observable state store.
 * Use for game-wide state (score, player data, settings).
 */
export class StateManager {
  constructor() {
    /** @type {Map<string, any>} */
    this._state = new Map();
    /** @type {Map<string, Set<(value: any) => void>>} */
    this._listeners = new Map();
  }

  /**
   * Get a state value.
   * @param {string} key
   * @returns {any}
   */
  get(key) {
    return this._state.get(key);
  }

  /**
   * Set a state value and notify listeners.
   * @param {string} key
   * @param {any} value
   */
  set(key, value) {
    this._state.set(key, value);
    const listeners = this._listeners.get(key);
    if (listeners) {
      listeners.forEach((cb) => cb(value));
    }
  }

  /**
   * Subscribe to state changes for a given key.
   * @param {string} key
   * @param {(value: any) => void} callback
   * @returns {() => void} Unsubscribe function.
   */
  on(key, callback) {
    if (!this._listeners.has(key)) {
      this._listeners.set(key, new Set());
    }
    this._listeners.get(key).add(callback);
    return () => this._listeners.get(key)?.delete(callback);
  }

  /**
   * Remove all listeners for a key, or all listeners entirely.
   * @param {string} [key]
   */
  clear(key) {
    if (key) {
      this._listeners.delete(key);
    } else {
      this._listeners.clear();
    }
  }
}

/** Singleton instance */
export const stateManager = new StateManager();
