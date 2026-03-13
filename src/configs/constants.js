/**
 * Game-wide constants.
 * Never hardcode magic numbers in scenes or entities — define them here.
 */

/** Base resolution (landscape 16:9) */
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

/**
 * Horizontal safe zone — keeps UI elements away from device edges
 * (physical buttons, cameras) on mobile landscape.
 * Backgrounds may still use full width.
 */
export const SAFE_ZONE_X = 60;
export const SAFE_LEFT = SAFE_ZONE_X;
export const SAFE_RIGHT = GAME_WIDTH - SAFE_ZONE_X;
export const SAFE_WIDTH = GAME_WIDTH - 2 * SAFE_ZONE_X;

/** Grid settings */
export const GRID_COLS = 10;
export const GRID_ROWS = 6;
export const TILE_SIZE = 80;

/** Depth layers (z-ordering) */
export const DEPTH = {
  BACKGROUND: 0,
  GRID: 10,
  ENTITIES: 20,
  UI: 30,
  MODAL: 40,
};

/** Scene keys */
export const SCENE_KEYS = {
  BOOT: 'BootScene',
  PRELOAD: 'PreloadScene',
  TITLE: 'TitleScene',
  BASE_CAMP: 'BaseCampScene',
  MAP: 'MapScene',
  BATTLE: 'BattleScene',
  END_BATTLE: 'EndBattleScene',
  DECK: 'DeckScene',
  ABILITY: 'AbilityScene',
  OPTIONS: 'OptionsScene',
};

/** Colors */
export const COLORS = {
  PRIMARY: 0x3498db,
  SECONDARY: 0x2ecc71,
  DANGER: 0xe74c3c,
  DARK: 0x2c3e50,
  LIGHT: 0xecf0f1,
  WHITE: 0xffffff,
  BLACK: 0x000000,
};
