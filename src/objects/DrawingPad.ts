import Phaser from 'phaser';
import { DRAWING } from '../config';
import { isFarEnough } from '../logic/drawing';
import type { Point } from '../logic/stickFigure';

/**
 * Lets the player draw on the screen: hold the mouse button
 * (or a finger) down and move. Lines stay on the screen.
 */
export function addDrawingPad(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  g.lineStyle(DRAWING.lineWidth, DRAWING.color);
  g.fillStyle(DRAWING.color);
  let last: Point | null = null;

  // A dot at every point keeps the line corners round.
  const dot = (p: Point): void => {
    g.fillCircle(p.x, p.y, DRAWING.lineWidth / 2);
  };

  scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
    last = { x: pointer.x, y: pointer.y };
    dot(last);
  });

  scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
    if (!last || !pointer.isDown) return;
    const next = { x: pointer.x, y: pointer.y };
    if (!isFarEnough(last, next, DRAWING.minStep)) return;
    g.lineBetween(last.x, last.y, next.x, next.y);
    dot(next);
    last = next;
  });

  const stop = (): void => {
    last = null;
  };
  scene.input.on('pointerup', stop);
  scene.input.on('pointerupoutside', stop);

  return g;
}
