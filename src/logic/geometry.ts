import type { Point } from './stickFigure';

/** Turns points around (cx, cy) by `angle` radians (clockwise on screen). */
export function rotatePoints(points: readonly Point[], angle: number, cx = 0, cy = 0): Point[] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return points.map((p) => {
    const dx = p.x - cx;
    const dy = p.y - cy;
    return { x: cx + dx * cos - dy * sin, y: cy + dx * sin + dy * cos };
  });
}

/**
 * Where the dark twist stripes go on a piece of rope from `from` to `to`.
 * `carried` is how far along the rope we already were since the last
 * stripe, so stripes stay evenly spaced across many small pieces.
 * Returns the stripe spots and the new carried distance.
 */
export function ropeTwists(
  from: Point,
  to: Point,
  carried: number,
  spacing: number,
): { spots: Point[]; carried: number } {
  if (spacing <= 0) {
    throw new RangeError(`spacing must be positive, got ${spacing}`);
  }
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  const spots: Point[] = [];
  let next = spacing - carried;
  while (next <= length) {
    const t = length === 0 ? 0 : next / length;
    spots.push({ x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t });
    next += spacing;
  }
  return { spots, carried: length - (next - spacing) };
}
