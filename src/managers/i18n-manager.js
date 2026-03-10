import { en } from '../locales/en.js';
import { fr } from '../locales/fr.js';

const LOCALES = { en, fr };
const DEFAULT_LOCALE = 'en';
const STORAGE_KEY = 'stratideck_locale';

/**
 * I18nManager — handles locale selection and translation lookups.
 *
 * Usage:
 *   import { i18n } from '../managers/i18n-manager.js';
 *   i18n.t('menu.play'); // "Play" or "Jouer"
 *   i18n.setLocale('fr');
 *   i18n.t('menu.play'); // "Jouer"
 */
class I18nManager {
  constructor() {
    /** @type {string} */
    this._locale = this._loadLocale();
    /** @type {Set<() => void>} */
    this._listeners = new Set();
  }

  /**
   * Get the current locale code.
   * @returns {string}
   */
  get locale() {
    return this._locale;
  }

  /**
   * List available locale codes.
   * @returns {string[]}
   */
  get availableLocales() {
    return Object.keys(LOCALES);
  }

  /**
   * Change the active locale and persist the choice.
   * @param {string} locale - 'en' or 'fr'
   */
  setLocale(locale) {
    if (!LOCALES[locale]) {
      console.warn(`[i18n] Unknown locale "${locale}", falling back to "${DEFAULT_LOCALE}".`);
      locale = DEFAULT_LOCALE;
    }
    this._locale = locale;
    this._saveLocale(locale);
    this._listeners.forEach((cb) => cb());
  }

  /**
   * Translate a key using the current locale.
   * @param {string} key - Dot-separated translation key (e.g. 'menu.play').
   * @param {Record<string, string>} [params] - Optional interpolation values.
   * @returns {string}
   */
  t(key, params) {
    const dict = LOCALES[this._locale] ?? LOCALES[DEFAULT_LOCALE];
    let value = dict[key];

    if (value === undefined) {
      console.warn(`[i18n] Missing key "${key}" for locale "${this._locale}".`);
      return key;
    }

    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(`{${k}}`, v);
      }
    }

    return value;
  }

  /**
   * Subscribe to locale changes.
   * @param {() => void} callback
   * @returns {() => void} Unsubscribe function.
   */
  onChange(callback) {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  }

  /** @private */
  _loadLocale() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && LOCALES[saved]) {
        return saved;
      }
    } catch {
      // localStorage unavailable (e.g. SSR or privacy mode)
    }
    return DEFAULT_LOCALE;
  }

  /** @private */
  _saveLocale(locale) {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // silently ignore
    }
  }
}

/** Singleton instance */
export const i18n = new I18nManager();
