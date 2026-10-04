import type { Point } from './stickFigure';

/** One drawn line: the points the mouse went through, in order. */
export type Stroke = Point[];

/**
 * Removes every point within `radius` of `center`. A stroke that
 * gets cut in the middle becomes two strokes. Pieces with fewer
 * than two points are dropped.
 */
export function eraseStrokes(strokes: readonly Stroke[], center: Point, radius: number): Stroke[] {
  const result: Stroke[] = [];
  for (const stroke of strokes) {
    let piece: Stroke = [];
    for (const p of stroke) {
      if (Math.hypot(p.x - center.x, p.y - center.y) <= radius) {
        if (piece.length >= 2) result.push(piece);
        piece = [];
      } else {
        piece.push(p);
      }
    }
    if (piece.length >= 2) result.push(piece);
  }
  return result;
}
