import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './constants.js';
import { BootScene } from '../scenes/BootScene.js';
import { PreloadScene } from '../scenes/PreloadScene.js';
import { TitleScene } from '../scenes/TitleScene.js';
import { BaseCampScene } from '../scenes/BaseCampScene.js';
import { MapScene } from '../scenes/MapScene.js';
import { BattleScene } from '../scenes/BattleScene.js';
import { EndBattleScene } from '../scenes/EndBattleScene.js';
import { DeckScene } from '../scenes/DeckScene.js';
import { OptionsScene } from '../scenes/OptionsScene.js';

/**
 * Phaser game configuration.
 * @see https://newdocs.phaser.io/docs/3.80.0/Phaser.Types.Core.GameConfig
 */
export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#1a1a2e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
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
