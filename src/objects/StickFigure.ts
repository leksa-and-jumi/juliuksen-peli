import Phaser from 'phaser';
import { STICK_FIGURE } from '../config';
import { stickFigureShape, type Point } from '../logic/stickFigure';

/** Julius's figure smiles; the friend sticks its tongue out. */
export type Face = 'smile' | 'tongue';

/**
 * A stick figure drawn with code: round joints, a filled head,
 * eyes and a smile (or a tongue). Its position is its feet.
 */
export class StickFigure {
  private readonly g: Phaser.GameObjects.Graphics;
  feet: Point;

  constructor(
    scene: Phaser.Scene,
    feet: Point,
    private readonly face: Face = 'smile',
  ) {
    this.g = scene.add.graphics();
    this.feet = feet;
    this.draw('stand');
  }

  moveTo(feet: Point, pose: 'stand' | 'climb'): void {
    this.feet = feet;
    this.draw(pose);
  }

  private draw(pose: 'stand' | 'climb'): void {
    const f = STICK_FIGURE;
    const { head, lines } = stickFigureShape(this.feet, f.height, f.headRadius, pose);
    const g = this.g;
    g.clear();

    g.lineStyle(f.lineWidth, f.color);
    g.fillStyle(f.color);
    for (const line of lines) {
      g.lineBetween(line.from.x, line.from.y, line.to.x, line.to.y);
      // Round ends, so hands, feet and joints are not square.
      g.fillCircle(line.from.x, line.from.y, f.lineWidth / 2);
      g.fillCircle(line.to.x, line.to.y, f.lineWidth / 2);
    }

    g.fillStyle(f.face);
    g.fillCircle(head.x, head.y, head.radius);
    g.strokeCircle(head.x, head.y, head.radius);

    // Eyes and a smile.
    const r = head.radius;
    if (this.face === 'tongue') {
      // The tongue hangs out from the middle of the smile.
      const mouthY = head.y + r * 0.55;
      g.fillStyle(f.tongue);
      g.fillRoundedRect(head.x - f.tongueWidth / 2, mouthY - 1, f.tongueWidth, f.tongueLength, {
        tl: 0,
        tr: 0,
        bl: f.tongueWidth / 2,
        br: f.tongueWidth / 2,
      });
      g.lineStyle(1, f.tongueLine);
      g.lineBetween(head.x, mouthY, head.x, mouthY + f.tongueLength * 0.6);
    }
    g.fillStyle(f.color);
    g.fillCircle(head.x - r * 0.38, head.y - r * 0.15, f.eyeRadius);
    g.fillCircle(head.x + r * 0.38, head.y - r * 0.15, f.eyeRadius);
    g.lineStyle(f.smileWidth, f.color);
    g.beginPath();
    g.arc(head.x, head.y + r * 0.05, r * 0.5, Phaser.Math.DegToRad(25), Phaser.Math.DegToRad(155));
    g.strokePath();
  }
}
