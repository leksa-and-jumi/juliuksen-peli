import type { Point } from './stickFigure';

export type ItemKind =
  | 'hat'
  | 'crown'
  | 'cap'
  | 'bow'
  | 'flower'
  | 'pipo'
  | 'partyHat'
  | 'wizardHat'
  | 'vikingHelmet'
  | 'star';

/** One filled piece of a thing, as a closed polygon. */
export interface ItemPart {
  points: Point[];
  role: 'main' | 'accent';
}

export interface ItemSizes {
  hat: {
    width: number;
    height: number;
    brimHeight: number;
    crownWidth: number;
    bandHeight: number;
  };
  crown: { width: number; height: number; bandHeight: number };
  cap: { domeRadius: number; visorLength: number; visorHeight: number };
  bow: { width: number; height: number; knotSize: number };
  flower: { petalRadius: number; petalDistance: number; centerRadius: number };
  pipo: { domeRadius: number; bandHeight: number; ballRadius: number };
  partyHat: { width: number; height: number; ballRadius: number };
  wizardHat: {
    brimWidth: number;
    brimHeight: number;
    coneWidth: number;
    coneHeight: number;
    starOuter: number;
    starInner: number;
  };
  vikingHelmet: { domeRadius: number; hornLength: number };
  star: { outerRadius: number; innerRadius: number; centerRadius: number };
}

/** Points around a circle; enough of them to look round when small. */
const CIRCLE_POINTS = 16;

function rect(left: number, top: number, width: number, height: number): Point[] {
  return [
    { x: left, y: top },
    { x: left + width, y: top },
    { x: left + width, y: top + height },
    { x: left, y: top + height },
  ];
}

/** The top half of a circle, from the left edge over the top to the right edge. */
function dome(cx: number, cy: number, r: number): Point[] {
  const steps = CIRCLE_POINTS / 2;
  return Array.from({ length: steps + 1 }, (_, i) => {
    const angle = Math.PI + (i / steps) * Math.PI;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });
}

/** A five-pointed star with its top point straight up. */
function starPoints(cx: number, cy: number, outer: number, inner: number): Point[] {
  return Array.from({ length: 10 }, (_, i) => {
    const angle = -Math.PI / 2 + (i / 10) * Math.PI * 2;
    const r = i % 2 === 0 ? outer : inner;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });
}

function circle(cx: number, cy: number, r: number): Point[] {
  return Array.from({ length: CIRCLE_POINTS }, (_, i) => {
    const angle = (i / CIRCLE_POINTS) * Math.PI * 2;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });
}

/** The thing drawn around (0, 0), before it is moved into place. */
function rawShape(kind: ItemKind, sizes: ItemSizes): ItemPart[] {
  switch (kind) {
    case 'hat': {
      const h = sizes.hat;
      const crownHeight = h.height - h.brimHeight;
      return [
        { role: 'main', points: rect(-h.width / 2, -h.brimHeight, h.width, h.brimHeight) },
        { role: 'main', points: rect(-h.crownWidth / 2, -h.height, h.crownWidth, crownHeight) },
        {
          role: 'accent',
          points: rect(-h.crownWidth / 2, -h.brimHeight - h.bandHeight, h.crownWidth, h.bandHeight),
        },
      ];
    }
    case 'crown': {
      const c = sizes.crown;
      const half = c.width / 2;
      return [
        {
          role: 'main',
          // Three spikes on top.
          points: [
            { x: -half, y: 0 },
            { x: -half, y: -c.height },
            { x: -half / 2, y: -c.height / 2 },
            { x: 0, y: -c.height },
            { x: half / 2, y: -c.height / 2 },
            { x: half, y: -c.height },
            { x: half, y: 0 },
          ],
        },
        { role: 'accent', points: rect(-half, -c.bandHeight, c.width, c.bandHeight) },
      ];
    }
    case 'cap': {
      const c = sizes.cap;
      return [
        { role: 'main', points: dome(0, 0, c.domeRadius) },
        // The visor sticks out to the right.
        {
          role: 'accent',
          points: rect(0, -c.visorHeight, c.domeRadius + c.visorLength, c.visorHeight),
        },
      ];
    }
    case 'bow': {
      const b = sizes.bow;
      const half = b.width / 2;
      const top = -b.height;
      const middle = -b.height / 2;
      return [
        {
          role: 'main',
          points: [
            { x: 0, y: middle },
            { x: -half, y: top },
            { x: -half, y: 0 },
          ],
        },
        {
          role: 'main',
          points: [
            { x: 0, y: middle },
            { x: half, y: top },
            { x: half, y: 0 },
          ],
        },
        {
          role: 'accent',
          points: rect(-b.knotSize / 2, middle - b.knotSize / 2, b.knotSize, b.knotSize),
        },
      ];
    }
    case 'flower': {
      const f = sizes.flower;
      const petalCount = 5;
      const petals: ItemPart[] = Array.from({ length: petalCount }, (_, i) => {
        // The first petal points straight up.
        const angle = -Math.PI / 2 + (i / petalCount) * Math.PI * 2;
        return {
          role: 'main',
          points: circle(
            Math.cos(angle) * f.petalDistance,
            Math.sin(angle) * f.petalDistance,
            f.petalRadius,
          ),
        };
      });
      return [...petals, { role: 'accent', points: circle(0, 0, f.centerRadius) }];
    }
    case 'pipo': {
      const p = sizes.pipo;
      const r = p.domeRadius;
      return [
        { role: 'main', points: dome(0, 0, r) },
        { role: 'accent', points: rect(-r, -p.bandHeight, r * 2, p.bandHeight) },
        { role: 'accent', points: circle(0, -r, p.ballRadius) },
      ];
    }
    case 'partyHat': {
      const p = sizes.partyHat;
      return [
        {
          role: 'main',
          points: [
            { x: -p.width / 2, y: 0 },
            { x: 0, y: -p.height },
            { x: p.width / 2, y: 0 },
          ],
        },
        { role: 'accent', points: circle(0, -p.height, p.ballRadius) },
      ];
    }
    case 'wizardHat': {
      const w = sizes.wizardHat;
      return [
        { role: 'main', points: rect(-w.brimWidth / 2, -w.brimHeight, w.brimWidth, w.brimHeight) },
        {
          role: 'main',
          points: [
            { x: -w.coneWidth / 2, y: -w.brimHeight },
            { x: 0, y: -w.brimHeight - w.coneHeight },
            { x: w.coneWidth / 2, y: -w.brimHeight },
          ],
        },
        {
          role: 'accent',
          points: starPoints(0, -w.brimHeight - w.coneHeight / 3, w.starOuter, w.starInner),
        },
      ];
    }
    case 'vikingHelmet': {
      const v = sizes.vikingHelmet;
      const r = v.domeRadius;
      // A horn starts at the side of the helmet and curls up and out.
      const horn = (side: 1 | -1): Point[] => [
        { x: side * (r - 1), y: -2 },
        { x: side * (r - 4), y: -r / 2 - 2 },
        { x: side * (r + v.hornLength / 2), y: -r - v.hornLength / 2 },
      ];
      return [
        { role: 'accent', points: horn(-1) },
        { role: 'accent', points: horn(1) },
        { role: 'main', points: dome(0, 0, r) },
      ];
    }
    case 'star': {
      const st = sizes.star;
      return [
        { role: 'main', points: starPoints(0, 0, st.outerRadius, st.innerRadius) },
        { role: 'accent', points: circle(0, 0, st.centerRadius) },
      ];
    }
  }
}

function bounds(parts: readonly ItemPart[]): {
  left: number;
  right: number;
  top: number;
  bottom: number;
} {
  const xs = parts.flatMap((part) => part.points.map((p) => p.x));
  const ys = parts.flatMap((part) => part.points.map((p) => p.y));
  return {
    left: Math.min(...xs),
    right: Math.max(...xs),
    top: Math.min(...ys),
    bottom: Math.max(...ys),
  };
}

/**
 * The pieces a thing is drawn from. `x` is its middle and `bottom`
 * its lowest edge, so it can sit on a head or in the picture.
 */
export function itemShape(kind: ItemKind, x: number, bottom: number, sizes: ItemSizes): ItemPart[] {
  const raw = rawShape(kind, sizes);
  const box = bounds(raw);
  const dx = x - (box.left + box.right) / 2;
  const dy = bottom - box.bottom;
  return raw.map((part) => ({
    role: part.role,
    points: part.points.map((p) => ({ x: p.x + dx, y: p.y + dy })),
  }));
}

/** The total height of a thing, so the figure can grab it by its middle. */
export function itemHeight(kind: ItemKind, sizes: ItemSizes): number {
  const box = bounds(rawShape(kind, sizes));
  return box.bottom - box.top;
}
