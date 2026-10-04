import type { Point } from './stickFigure';

/**
 * True when `item` is inside the stick figure's area:
 * between its feet and the top of its head, and at most
 * `reach` pixels to the left or right of its middle.
 */
export function figureTouches(feet: Point, height: number, reach: number, item: Point): boolean {
  return Math.abs(item.x - feet.x) <= reach && item.y <= feet.y && item.y >= feet.y - height;
}
