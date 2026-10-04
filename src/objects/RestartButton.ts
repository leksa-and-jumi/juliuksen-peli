import Phaser from 'phaser';
import { GAME_WIDTH, RESTART_BUTTON } from '../config';

/**
 * A button with a round arrow in the top right corner.
 * Pressing it calls `onPress`, which starts the whole game over.
 */
export function addRestartButton(scene: Phaser.Scene, onPress: () => void): void {
  const { size, margin, arrowRadius, arrowHeadSize } = RESTART_BUTTON;
  const left = GAME_WIDTH - margin - size;
  const centerX = left + size / 2;
  const centerY = margin + size / 2;

  const g = scene.add.graphics();
  g.fillStyle(RESTART_BUTTON.background);
  g.fillRect(left, margin, size, size);

  // Almost a full circle, with an arrow head at its end.
  const start = Phaser.Math.DegToRad(-60);
  const end = Phaser.Math.DegToRad(240);
  g.lineStyle(RESTART_BUTTON.arrowWidth, RESTART_BUTTON.arrowColor);
  g.beginPath();
  g.arc(centerX, centerY, arrowRadius, start, end);
  g.strokePath();

  const tipX = centerX + Math.cos(start) * arrowRadius;
  const tipY = centerY + Math.sin(start) * arrowRadius;
  g.fillStyle(RESTART_BUTTON.arrowColor);
  g.fillTriangle(
    tipX - arrowHeadSize,
    tipY - arrowHeadSize / 2,
    tipX + arrowHeadSize / 2,
    tipY - arrowHeadSize,
    tipX,
    tipY + arrowHeadSize / 2,
  );

  scene.add
    .zone(left, margin, size, size)
    .setOrigin(0, 0)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', onPress);
}
