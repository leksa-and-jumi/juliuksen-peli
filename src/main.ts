import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from './config';
import { LEVEL_KEY, LEVELS } from './levels';
import { levelFromQuery } from './logic/levels';
import { MainScene } from './scenes/MainScene';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: COLORS.background,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [MainScene],
});

// `?level=3` in the address opens level 3 directly (handy for testing).
game.registry.set(LEVEL_KEY, levelFromQuery(window.location.search, LEVELS.length));
