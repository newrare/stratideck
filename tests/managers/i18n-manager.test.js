import { describe, it, expect, beforeEach } from 'vitest';

/**
 * We test I18nManager by re-importing a fresh module each time.
 * Since the module exports a singleton, we use dynamic import + vi.resetModules.
 */
describe('I18nManager', () => {
  /** @type {import('../../src/managers/i18n-manager.js')} */
  let mod;

  beforeEach(async () => {
    vi.resetModules();
    // Clear persisted locale
    try {
      localStorage.removeItem('stratideck_locale');
    } catch {
      // no localStorage in node env
    }
    mod = await import('../../src/managers/i18n-manager.js');
  });

  it('defaults to English', () => {
    expect(mod.i18n.locale).toBe('en');
  });

  it('translates a key in English', () => {
    expect(mod.i18n.t('title.newGame')).toBe('New Game');
  });

  it('switches to French', () => {
    mod.i18n.setLocale('fr');
    expect(mod.i18n.locale).toBe('fr');
    expect(mod.i18n.t('title.newGame')).toBe('Nouvelle Partie');
  });

  it('returns the key when translation is missing', () => {
    expect(mod.i18n.t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('falls back to default locale for unknown locale', () => {
    mod.i18n.setLocale('xx');
    expect(mod.i18n.locale).toBe('en');
  });

  it('lists available locales', () => {
    expect(mod.i18n.availableLocales).toEqual(expect.arrayContaining(['en', 'fr']));
  });

  it('notifies listeners on locale change', () => {
    let called = 0;
    mod.i18n.onChange(() => {
      called++;
    });
    mod.i18n.setLocale('fr');
    expect(called).toBe(1);
  });

  it('unsubscribes correctly', () => {
    let called = 0;
    const unsub = mod.i18n.onChange(() => {
      called++;
    });
    mod.i18n.setLocale('fr');
    unsub();
    mod.i18n.setLocale('en');
    expect(called).toBe(1);
  });

  it('interpolates params', async () => {
    // Temporarily inject a key with a placeholder
    const enLocale = await import('../../src/locales/en.js');
    enLocale.en['test.hello'] = 'Hello {name}!';
    expect(mod.i18n.t('test.hello', { name: 'World' })).toBe('Hello World!');
    delete enLocale.en['test.hello'];
  });
});
