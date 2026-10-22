import type { Point } from './stickFigure';

/**
 * The three corners of an arrow head at the end of a clockwise arc.
 * The arc is a circle around (cx, cy) with radius r, ending at
 * `angle` (radians). The tip points the way the arc is going.
 */
export function arcArrowHead(
  cx: number,
  cy: number,
  r: number,
  angle: number,
  size: number,
): [Point, Point, Point] {
  const end = { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  // Going clockwise on screen, the arc moves in this direction at its end.
  const forward = { x: -Math.sin(angle), y: Math.cos(angle) };
  // Pointing away from the middle of the circle.
  const out = { x: Math.cos(angle), y: Math.sin(angle) };
  return [
    { x: end.x + forward.x * size, y: end.y + forward.y * size },
    { x: end.x + out.x * size * 0.8, y: end.y + out.y * size * 0.8 },
    { x: end.x - out.x * size * 0.8, y: end.y - out.y * size * 0.8 },
  ];
}
