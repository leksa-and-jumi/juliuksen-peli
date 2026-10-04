import type { Point } from './stickFigure';
import type { Stroke } from './strokes';

/**
 * Looks for a drawn rope that touches the stick figure and goes up.
 * Returns the path to climb: from where the figure grabs the rope
 * to the rope's highest end. Returns null if no rope fits.
 */
export function findRope(
  strokes: readonly Stroke[],
  feet: Point,
  figureHeight: number,
  grabWidth: number,
  minRise: number,
): Point[] | null {
  const touches = (p: Point): boolean =>
    Math.abs(p.x - feet.x) <= grabWidth && p.y <= feet.y && p.y >= feet.y - figureHeight;

  for (const stroke of strokes) {
    const first = stroke[0];
    const last = stroke.at(-1);
    if (!first || !last) continue;
    const grab = stroke.findIndex(touches);
    if (grab < 0) continue;

    const path = last.y < first.y ? stroke.slice(grab) : stroke.slice(0, grab + 1).reverse();
    const top = path.at(-1);
    if (top && feet.y - top.y >= minRise) {
      return path;
    }
  }
  return null;
}

/** The point `distance` pixels along the path, and whether the end was reached. */
export function pointAlongPath(
  path: readonly Point[],
  distance: number,
): { point: Point; done: boolean } {
  const start = path[0];
  if (!start) {
    throw new RangeError('path must have at least one point');
  }
  let left = Math.max(0, distance);
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1] ?? start;
    const b = path[i] ?? start;
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    if (left <= length) {
      const t = length === 0 ? 0 : left / length;
      return { point: { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }, done: false };
    }
    left -= length;
  }
  return { point: path.at(-1) ?? start, done: true };
}

export interface RaftTop {
  left: number;
  right: number;
  y: number;
}

/**
 * Where the figure steps when it reaches the top of the rope:
 * onto a raft if one is close enough, otherwise null (it hangs on).
 */
export function landingSpot(end: Point, rafts: readonly RaftTop[], snap: number): Point | null {
  for (const r of rafts) {
    const nearX = end.x >= r.left - snap && end.x <= r.right + snap;
    const nearY = Math.abs(end.y - r.y) <= snap;
    if (nearX && nearY) {
      return { x: Math.min(Math.max(end.x, r.left), r.right), y: r.y };
    }
  }
  return null;
}
