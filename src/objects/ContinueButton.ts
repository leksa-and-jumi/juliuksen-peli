import Phaser from 'phaser';
import { CONTINUE_BUTTON, GAME_HEIGHT, GAME_WIDTH } from '../config';

/**
 * A big round green button with a white play arrow, in the middle of
 * the screen (or at height `y`). It gently pulses. Pressing it calls `onPress`.
 */
export function addContinueButton(
  scene: Phaser.Scene,
  onPress: () => void,
  y: number = GAME_HEIGHT / 2,
): void {
  const { radius, arrowSize } = CONTINUE_BUTTON;
  const g = scene.add.graphics({ x: GAME_WIDTH / 2, y });
  g.fillStyle(CONTINUE_BUTTON.color);
  g.fillCircle(0, 0, radius);
  g.fillStyle(CONTINUE_BUTTON.arrowColor);
  // The arrow is moved a bit right so it looks centered.
  g.fillTriangle(-arrowSize / 2, -arrowSize, -arrowSize / 2, arrowSize, arrowSize, 0);

  scene.tweens.add({
    targets: g,
    scale: CONTINUE_BUTTON.pulseScale,
    duration: CONTINUE_BUTTON.pulseTime,
    yoyo: true,
    repeat: -1,
  });

  scene.add
    .zone(GAME_WIDTH / 2, y, radius * 2, radius * 2)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', onPress);
}
