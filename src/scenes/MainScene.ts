import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH, WELCOME_FONT_SIZE, WELCOME_TEXT } from '../config';

/**
 * Empty starter scene. Julius designs the real game from scratch.
 */
export class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  create(): void {
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, WELCOME_TEXT, {
        fontSize: WELCOME_FONT_SIZE,
        color: COLORS.text,
        align: 'center',
      })
      .setOrigin(0.5);
  }
}
