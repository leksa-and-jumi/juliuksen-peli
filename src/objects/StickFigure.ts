import Phaser from 'phaser';
import { STICK_FIGURE } from '../config';
import { stickFigureShape, type Point } from '../logic/stickFigure';
import { drawHat } from './Hat';

/** Julius's stick figure, drawn with code. Its position is its feet. */
export class StickFigure {
  private readonly g: Phaser.GameObjects.Graphics;
  feet: Point;
  wearsHat = false;
  private pose: 'stand' | 'climb' = 'stand';

  constructor(scene: Phaser.Scene, feet: Point) {
    this.g = scene.add.graphics();
    this.feet = feet;
    this.draw('stand');
  }

  moveTo(feet: Point, pose: 'stand' | 'climb'): void {
    this.feet = feet;
    this.draw(pose);
  }

  putOnHat(): void {
    this.wearsHat = true;
    this.draw(this.pose);
  }

  private draw(pose: 'stand' | 'climb'): void {
    this.pose = pose;
    const shape = stickFigureShape(this.feet, STICK_FIGURE.height, STICK_FIGURE.headRadius, pose);
    this.g.clear();
    this.g.lineStyle(STICK_FIGURE.lineWidth, STICK_FIGURE.color);
    this.g.strokeCircle(shape.head.x, shape.head.y, shape.head.radius);
    for (const line of shape.lines) {
      this.g.lineBetween(line.from.x, line.from.y, line.to.x, line.to.y);
    }
    if (this.wearsHat) {
      // The brim sits a little below the top of the head.
      drawHat(this.g, shape.head.x, shape.head.y - shape.head.radius / 2);
    }
  }
}
