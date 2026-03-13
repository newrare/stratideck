import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './constants.js';
import { BootScene } from '../scenes/boot-scene.js';
import { PreloadScene } from '../scenes/preload-scene.js';
import { TitleScene } from '../scenes/title-scene.js';
import { BaseCampScene } from '../scenes/camp-scene.js';
import { MapScene } from '../scenes/map-scene.js';
import { BattleScene } from '../scenes/battle-scene.js';
import { EndBattleScene } from '../scenes/end-battle-scene.js';
import { DeckScene } from '../scenes/deck-scene.js';
import { AbilityScene } from '../scenes/ability-scene.js';
import { OptionsScene } from '../scenes/options-scene.js';

/**
 * Phaser game configuration.
 * @see https://newdocs.phaser.io/docs/3.80.0/Phaser.Types.Core.GameConfig
 */
export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  resolution: Math.min(window.devicePixelRatio || 1, 3),
  backgroundColor: '#1a1a2e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  dom: {
    createContainer: true,
  },
  scene: [
    BootScene,
    PreloadScene,
    TitleScene,
    BaseCampScene,
    MapScene,
    BattleScene,
    EndBattleScene,
    DeckScene,
    AbilityScene,
    OptionsScene,
  ],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  input: {
    activePointers: 2,
  },
};
