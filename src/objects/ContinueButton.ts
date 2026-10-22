import Phaser from 'phaser';
import { BUTTON_STYLE, CONTINUE_BUTTON, GAME_HEIGHT, GAME_WIDTH } from '../config';

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
  g.fillStyle(BUTTON_STYLE.shadow, BUTTON_STYLE.shadowAlpha);
  g.fillCircle(0, BUTTON_STYLE.shadowOffset * 2, radius);
  g.fillStyle(CONTINUE_BUTTON.color);
  g.fillCircle(0, 0, radius);
  g.lineStyle(CONTINUE_BUTTON.ringWidth, CONTINUE_BUTTON.ring);
  g.strokeCircle(0, 0, radius - CONTINUE_BUTTON.ringWidth / 2);
  // A soft light spot on top makes it look round and shiny.
  g.fillStyle(CONTINUE_BUTTON.shine, CONTINUE_BUTTON.shineAlpha);
  g.fillEllipse(0, -radius * 0.45, radius * 1.2, radius * 0.6);
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
