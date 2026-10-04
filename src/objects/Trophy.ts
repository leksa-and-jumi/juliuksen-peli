import Phaser from 'phaser';
import { TROPHY } from '../config';
import { starPoints } from '../logic/items';

/** The big golden prize cup. It pops up from nothing. */
export function addTrophy(scene: Phaser.Scene): void {
  const t = TROPHY;
  const g = scene.add.graphics({ x: t.x, y: t.y });
  const w = t.cupWidth;
  const h = t.cupHeight;

  // Handles on both sides of the cup.
  g.lineStyle(t.handleWidth, t.shade);
  g.beginPath();
  g.arc(-w / 2, -h * 0.65, t.handleRadius, Math.PI / 2, (Math.PI * 3) / 2);
  g.strokePath();
  g.beginPath();
  g.arc(w / 2, -h * 0.65, t.handleRadius, -Math.PI / 2, Math.PI / 2);
  g.strokePath();

  // The cup, wide at the top and narrow at the bottom.
  g.fillStyle(t.color);
  g.fillPoints(
    [
      new Phaser.Math.Vector2(-w / 2, -h),
      new Phaser.Math.Vector2(w / 2, -h),
      new Phaser.Math.Vector2(w * 0.35, -h * 0.3),
      new Phaser.Math.Vector2(w * 0.12, 0),
      new Phaser.Math.Vector2(-w * 0.12, 0),
      new Phaser.Math.Vector2(-w * 0.35, -h * 0.3),
    ],
    true,
  );
  g.fillRect(-t.stemWidth / 2, 0, t.stemWidth, t.stemHeight);
  g.fillStyle(t.shade);
  g.fillRect(-t.baseWidth / 2, t.stemHeight, t.baseWidth, t.baseHeight);

  // A star on the cup.
  g.fillPoints(
    starPoints(0, -h * 0.6, t.starOuter, t.starInner).map((p) => new Phaser.Math.Vector2(p.x, p.y)),
    true,
  );

  g.setScale(0);
  scene.tweens.add({ targets: g, scale: 1, duration: t.popTime, ease: 'Back.easeOut' });
}
