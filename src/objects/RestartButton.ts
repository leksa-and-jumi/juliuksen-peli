import Phaser from 'phaser';
import { GAME_WIDTH, RESTART_BUTTON } from '../config';
import { arcArrowHead } from '../logic/arrow';

/**
 * A raised, rounded button with a round arrow ↻ in the top right corner.
 * It shrinks a little when pressed. Pressing it calls `onPress`.
 */
export function addRestartButton(scene: Phaser.Scene, onPress: () => void): void {
  const b = RESTART_BUTTON;
  const half = b.size / 2;
  const centerX = GAME_WIDTH - b.margin - half;
  const centerY = b.margin + half;

  // Everything is drawn around (0, 0), so the button can shrink from its middle.
  const shadow = scene.add.graphics({ x: centerX, y: centerY + b.shadowOffset });
  shadow.fillStyle(b.shadow, b.shadowAlpha);
  shadow.fillRoundedRect(-half, -half, b.size, b.size, b.cornerRadius);

  const g = scene.add.graphics({ x: centerX, y: centerY });
  g.fillStyle(b.background);
  g.fillRoundedRect(-half, -half, b.size, b.size, b.cornerRadius);
  g.lineStyle(b.borderWidth, b.border);
  g.strokeRoundedRect(-half, -half, b.size, b.size, b.cornerRadius);

  const start = Phaser.Math.DegToRad(b.arrowStartDeg);
  const end = Phaser.Math.DegToRad(b.arrowEndDeg);
  g.lineStyle(b.arrowWidth, b.arrowColor);
  g.beginPath();
  g.arc(0, 0, b.arrowRadius, start, end);
  g.strokePath();

  const [tip, left, right] = arcArrowHead(0, 0, b.arrowRadius, end, b.arrowHeadSize);
  g.fillStyle(b.arrowColor);
  g.fillTriangle(tip.x, tip.y, left.x, left.y, right.x, right.y);

  scene.add
    .zone(centerX, centerY, b.size, b.size)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      // A quick squish, then do what the button is for.
      scene.tweens.add({
        targets: g,
        scale: b.pressScale,
        duration: b.pressTime,
        yoyo: true,
        onComplete: onPress,
      });
    });
}
