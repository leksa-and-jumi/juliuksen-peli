export interface Point {
  x: number;
  y: number;
}

export interface Line {
  from: Point;
  to: Point;
}

export interface StickFigureShape {
  head: { x: number; y: number; radius: number };
  lines: Line[]; // body, two arms, two legs
}

/**
 * Builds a standing stick figure whose feet touch `feet`.
 * Proportions: legs take the lower 40 %, the body above them,
 * and the head sits on top.
 */
export function stickFigureShape(
  feet: Point,
  height: number,
  headRadius: number,
): StickFigureShape {
  if (height <= headRadius * 2) {
    throw new RangeError(`height (${height}) must be bigger than the head (${headRadius * 2})`);
  }
  const { x } = feet;
  const hip = feet.y - height * 0.4;
  const neck = feet.y - height + headRadius * 2;
  const shoulder = neck + (hip - neck) * 0.25;
  const legSpread = height * 0.15;
  const armSpread = height * 0.2;
  const armDrop = height * 0.2;

  return {
    head: { x, y: feet.y - height + headRadius, radius: headRadius },
    lines: [
      { from: { x, y: neck }, to: { x, y: hip } },
      { from: { x, y: shoulder }, to: { x: x - armSpread, y: shoulder + armDrop } },
      { from: { x, y: shoulder }, to: { x: x + armSpread, y: shoulder + armDrop } },
      { from: { x, y: hip }, to: { x: x - legSpread, y: feet.y } },
      { from: { x, y: hip }, to: { x: x + legSpread, y: feet.y } },
    ],
  };
}
