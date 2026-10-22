import Phaser from 'phaser';
import { ITEMS, ITEM_LOOK, ITEM_SLOT } from '../config';
import { darken, itemShape, type ItemKind, type ItemPart } from '../logic/items';
import type { Point } from '../logic/stickFigure';

const toVectors = (points: Point[]): Phaser.Math.Vector2[] =>
  points.map((p) => new Phaser.Math.Vector2(p.x, p.y));

/** The color and see-through amount for one piece of a thing. */
function partFill(kind: ItemKind, role: ItemPart['role']): { color: number; alpha: number } {
  const colors = ITEMS[kind];
  switch (role) {
    case 'main':
      return { color: colors.color, alpha: 1 };
    case 'accent':
      return { color: colors.accent, alpha: 1 };
    case 'gem':
      return { color: 'gem' in colors ? colors.gem : colors.accent, alpha: 1 };
    case 'shine':
      return { color: ITEM_LOOK.shine, alpha: ITEM_LOOK.shineAlpha };
    case 'shade':
      return { color: ITEM_LOOK.shade, alpha: ITEM_LOOK.shadeAlpha };
  }
}

/**
 * Draws a colored thing (hat, crown...) whose bottom is at (x, bottom),
 * with light spots, shadows and darker edges so it looks real.
 */
export function drawItem(
  g: Phaser.GameObjects.Graphics,
  kind: ItemKind,
  x: number,
  bottom: number,
): void {
  for (const part of itemShape(kind, x, bottom, ITEMS)) {
    const { color, alpha } = partFill(kind, part.role);
    const points = toVectors(part.points);
    g.fillStyle(color, alpha);
    g.fillPoints(points, true);
    const solid = part.role === 'main' || part.role === 'accent' || part.role === 'gem';
    if (solid && part.edge !== false) {
      g.lineStyle(ITEM_LOOK.edgeWidth, darken(color, ITEM_LOOK.edgeDarken));
      g.strokePoints(points, true);
    }
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
