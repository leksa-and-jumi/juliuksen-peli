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
 * and the head sits on top. When climbing, the arms reach up.
 */
export function stickFigureShape(
  feet: Point,
  height: number,
  headRadius: number,
  pose: 'stand' | 'climb' = 'stand',
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
  const armDrop = pose === 'climb' ? -height * 0.25 : height * 0.2;

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

/**
 * A stick figure climbing along a rope. `up` is the direction up the
 * rope (any length), `phase` (0..1) is where it is in its climbing
 * moves. The body hangs just below the rope; the hands grab the rope
 * ahead and take turns reaching up, and the feet hook onto the rope
 * behind and take turns pulling up.
 */
export function climbingShape(
  feet: Point,
  up: Point,
  phase: number,
  height: number,
  headRadius: number,
): StickFigureShape {
  if (height <= headRadius * 2) {
    throw new RangeError(`height (${height}) must be bigger than the head (${headRadius * 2})`);
  }
  const length = Math.hypot(up.x, up.y);
  const u = length === 0 ? { x: 0, y: -1 } : { x: up.x / length, y: up.y / length };
  // Sideways from the rope. For a rope going up to the right this
  // points down, so the body hangs under the rope.
  const v = { x: -u.y, y: u.x };
  const at = (along: number, side = 0): Point => ({
    x: feet.x + u.x * along + v.x * side,
    y: feet.y + u.y * along + v.y * side,
  });

  const hang = height * 0.22; // how far the body hangs from the rope
  const hipAt = height * 0.3;
  const neckAt = height * 0.72;
  const shoulderAt = neckAt - (neckAt - hipAt) * 0.25;
  const reach = height * 0.28;
  const pull = height * 0.25;
  const swing = Math.sin(phase * Math.PI * 2);

  const hip = at(hipAt, hang);
  const shoulder = at(shoulderAt, hang);
  const headCenter = at(neckAt + headRadius, hang);
  return {
    head: { x: headCenter.x, y: headCenter.y, radius: headRadius },
    lines: [
      { from: at(neckAt, hang), to: hip },
      // Hands on the rope, taking turns reaching up.
      { from: shoulder, to: at(shoulderAt + reach * (0.6 + 0.4 * swing)) },
      { from: shoulder, to: at(shoulderAt + reach * (0.6 - 0.4 * swing)) },
      // Feet hooked on the rope, taking turns pulling up.
      { from: hip, to: at(hipAt - pull * (1 - 0.5 * swing)) },
      { from: hip, to: at(hipAt - pull * (1 + 0.5 * swing)) },
    ],
  };
}

/** The direction a path goes around `distance`, looking `window` pixels both ways. */
export function directionAlong(
  pointAt: (distance: number) => Point,
  distance: number,
  window: number,
): Point {
  const behind = pointAt(Math.max(0, distance - window));
  const ahead = pointAt(distance + window);
  return { x: ahead.x - behind.x, y: ahead.y - behind.y };
}
