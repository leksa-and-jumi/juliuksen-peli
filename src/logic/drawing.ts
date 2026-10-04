import type { Point } from './stickFigure';

/**
 * True when the pointer has moved far enough from the last drawn point
 * to draw the next piece of line. Skipping tiny moves keeps lines smooth.
 */
export function isFarEnough(last: Point, next: Point, minStep: number): boolean {
  if (minStep < 0) {
    throw new RangeError(`minStep must not be negative, got ${minStep}`);
  }
  return Math.hypot(next.x - last.x, next.y - last.y) >= minStep;
}
