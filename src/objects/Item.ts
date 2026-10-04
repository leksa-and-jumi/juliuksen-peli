import Phaser from 'phaser';
import { ITEMS, ITEM_SLOT } from '../config';
import { itemShape, type ItemKind } from '../logic/items';
import type { Point } from '../logic/stickFigure';

const toVectors = (points: Point[]): Phaser.Math.Vector2[] =>
  points.map((p) => new Phaser.Math.Vector2(p.x, p.y));

/** Draws a colored thing (hat, crown...) whose bottom is at (x, bottom). */
export function drawItem(
  g: Phaser.GameObjects.Graphics,
  kind: ItemKind,
  x: number,
  bottom: number,
): void {
  for (const part of itemShape(kind, x, bottom, ITEMS)) {
    g.fillStyle(part.role === 'main' ? ITEMS[kind].color : ITEMS[kind].accent);
    g.fillPoints(toVectors(part.points), true);
  }
}

/** Draws the same thing as a gray outline with no colors: the empty picture. */
export function drawItemOutline(
  g: Phaser.GameObjects.Graphics,
  kind: ItemKind,
  x: number,
  bottom: number,
): void {
  g.lineStyle(ITEM_SLOT.outlineWidth, ITEM_SLOT.outline);
  for (const part of itemShape(kind, x, bottom, ITEMS)) {
    if (part.role === 'main') g.strokePoints(toVectors(part.points), true);
  }
}
