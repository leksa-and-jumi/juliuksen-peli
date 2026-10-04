import Phaser from 'phaser';
import { STICK_FIGURE } from '../config';
import { stickFigureShape, type Point } from '../logic/stickFigure';

/** Draws Julius's stick figure with its feet at `feet`. */
export function addStickFigure(scene: Phaser.Scene, feet: Point): Phaser.GameObjects.Graphics {
  const shape = stickFigureShape(feet, STICK_FIGURE.height, STICK_FIGURE.headRadius);
  const g = scene.add.graphics();
  g.lineStyle(STICK_FIGURE.lineWidth, STICK_FIGURE.color);
  g.strokeCircle(shape.head.x, shape.head.y, shape.head.radius);
  for (const line of shape.lines) {
    g.lineBetween(line.from.x, line.from.y, line.to.x, line.to.y);
  }
  return g;
}
