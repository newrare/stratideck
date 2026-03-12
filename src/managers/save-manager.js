/**
 * SaveManager — persistent game state with observable notifications.
 * Replaces StateManager. Persists to localStorage.
 */

const STORAGE_KEY = 'stratideck_save';
const SAVE_VERSION = 1;

/**
 * @returns {object} Fresh save data structure.
 */
function createEmptySave() {
  return {
    version: SAVE_VERSION,
    gameInProgress: false,
    stats: {
      gamesStarted: 0,
      battlesPlayed: 0,
      victories: 0,
      defeats: 0,
    },
    cards: {},
    abilities: {},
  };
}

export class SaveManager {
  constructor() {
    /** @type {object} */
    this._data = createEmptySave();
    /** @type {Map<string, Set<(value: any) => void>>} */
    this._listeners = new Map();
  }

  // ─── Persistence ────────────────────────────────────────────

  /**
   * Load save data from localStorage. Initialises with empty data if nothing stored.
   */
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === SAVE_VERSION) {
          this._data = parsed;
          return;
        }
      }
    } catch {
      // Corrupted data — fall through to defaults.
    }
    this._data = createEmptySave();
  }

  /**
   * Persist current state to localStorage.
   */
  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
  }

  /**
   * Reset all save data (new game). Persists immediately.
   */
  reset() {
    this._data = createEmptySave();
    this.save();
  }

  // ─── Observable (replaces StateManager) ─────────────────────

  /**
   * Get a top-level save value.
   * @param {string} key
   * @returns {any}
   */
  get(key) {
    return this._data[key];
  }

  /**
   * Set a top-level save value, notify listeners, and persist.
   * @param {string} key
   * @param {any} value
   */
  set(key, value) {
    this._data[key] = value;
    this.save();
    const listeners = this._listeners.get(key);
    if (listeners) {
      listeners.forEach((cb) => cb(value));
    }
  }

  /**
   * Subscribe to changes on a key.
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
   * Remove listeners for a key, or all listeners.
   * @param {string} [key]
   */
  clear(key) {
    if (key) {
      this._listeners.delete(key);
    } else {
      this._listeners.clear();
    }
  }

  // ─── Game stats ─────────────────────────────────────────────

  /** @returns {{ gamesStarted: number, battlesPlayed: number, victories: number, defeats: number }} */
  getStats() {
    return { ...this._data.stats };
  }

  /**
   * Increment a stat counter and persist.
   * @param {'gamesStarted'|'battlesPlayed'|'victories'|'defeats'} stat
   */
  incrementStat(stat) {
    this._data.stats[stat] = (this._data.stats[stat] || 0) + 1;
    this.save();
  }

  // ─── Cards ──────────────────────────────────────────────────

  /**
   * Mark a card as unlocked and increment its use count.
   * @param {number} cardId
   */
  unlockCard(cardId) {
    const key = String(cardId);
    if (!this._data.cards[key]) {
      this._data.cards[key] = { unlocked: true, useCount: 0 };
    }
    this._data.cards[key].unlocked = true;
    this.save();
  }

  /**
   * Increment a card's use counter.
   * @param {number} cardId
   */
  useCard(cardId) {
    const key = String(cardId);
    if (!this._data.cards[key]) {
      this._data.cards[key] = { unlocked: true, useCount: 0 };
    }
    this._data.cards[key].useCount += 1;
    this.save();
  }

  /**
   * @param {number} cardId
   * @returns {boolean}
   */
  isCardUnlocked(cardId) {
    return this._data.cards[String(cardId)]?.unlocked === true;
  }

  /**
   * @param {number} cardId
   * @returns {boolean}
   */
  isCardUsed(cardId) {
    return (this._data.cards[String(cardId)]?.useCount || 0) > 0;
  }

  /**
   * @param {number} cardId
   * @returns {number}
   */
  getCardUseCount(cardId) {
    return this._data.cards[String(cardId)]?.useCount || 0;
  }

  // ─── Abilities ──────────────────────────────────────────────

  /**
   * Mark an ability as unlocked.
   * @param {number} abilityId
   */
  unlockAbility(abilityId) {
    const key = String(abilityId);
    if (!this._data.abilities[key]) {
      this._data.abilities[key] = { unlocked: true, useCount: 0 };
    }
    this._data.abilities[key].unlocked = true;
    this.save();
  }

  /**
   * Increment an ability's use counter.
   * @param {number} abilityId
   */
  useAbility(abilityId) {
    const key = String(abilityId);
    if (!this._data.abilities[key]) {
      this._data.abilities[key] = { unlocked: true, useCount: 0 };
    }
    this._data.abilities[key].useCount += 1;
    this.save();
  }

  /**
   * @param {number} abilityId
   * @returns {boolean}
   */
  isAbilityUnlocked(abilityId) {
    return this._data.abilities[String(abilityId)]?.unlocked === true;
  }

  /**
   * @param {number} abilityId
   * @returns {boolean}
   */
  isAbilityUsed(abilityId) {
    return (this._data.abilities[String(abilityId)]?.useCount || 0) > 0;
  }

  /**
   * @param {number} abilityId
   * @returns {number}
   */
  getAbilityUseCount(abilityId) {
    return this._data.abilities[String(abilityId)]?.useCount || 0;
  }
}

/** Singleton instance */
export const saveManager = new SaveManager();

// Load saved data immediately on import.
saveManager.load();
