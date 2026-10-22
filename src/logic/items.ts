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
  | 'star'
  | 'necklace'
  | 'ring'
  | 'tiara';

/**
 * One filled piece of a thing, as a closed polygon.
 * main/accent/gem use the thing's colors; shine is a soft light spot
 * and shade a soft shadow. `edge: false` skips the dark edge line.
 */
export interface ItemPart {
  points: Point[];
  role: 'main' | 'accent' | 'gem' | 'shine' | 'shade';
  edge?: false;
}

/** Makes a color darker: 0.6 keeps 60 % of the red, green and blue. */
export function darken(color: number, keep: number): number {
  const r = Math.round(((color >> 16) & 0xff) * keep);
  const g = Math.round(((color >> 8) & 0xff) * keep);
  const b = Math.round((color & 0xff) * keep);
  return (r << 16) | (g << 8) | b;
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
  necklace: { radius: number; beads: number; beadRadius: number; pendantRadius: number };
  ring: { outerRadius: number; innerRadius: number; gemSize: number };
  tiara: {
    width: number;
    bandHeight: number;
    spikes: number;
    spikeHeight: number;
    gemRadius: number;
  };
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
export function starPoints(cx: number, cy: number, outer: number, inner: number): Point[] {
  return Array.from({ length: 10 }, (_, i) => {
    const angle = -Math.PI / 2 + (i / 10) * Math.PI * 2;
    const r = i % 2 === 0 ? outer : inner;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });
}

function ellipse(cx: number, cy: number, rx: number, ry: number): Point[] {
  return circle(0, 0, 1).map((p) => ({ x: cx + p.x * rx, y: cy + p.y * ry }));
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
        // Shadow on the right of the crown and under the brim, light on the left.
        { role: 'shade', points: rect(h.crownWidth / 4, -h.height, h.crownWidth / 4, crownHeight) },
        { role: 'shade', points: rect(-h.width / 2, -2, h.width, 2) },
        { role: 'shine', points: rect(-h.crownWidth / 3, -h.height + 2, 3, crownHeight - 9) },
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
        // Three blue gems on the red band, and a shiny stripe.
        ...[-half / 2, 0, half / 2].map((gx): ItemPart => ({
          role: 'gem',
          points: circle(gx, -c.bandHeight / 2, c.bandHeight / 3),
        })),
        {
          role: 'shine',
          points: rect(-half + 3, -c.height * 0.75, 3, c.height * 0.4),
          edge: false,
        },
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
        // A seam down the middle, a button on top and a light spot.
        { role: 'shade', points: rect(-0.75, -c.domeRadius, 1.5, c.domeRadius - c.visorHeight) },
        { role: 'accent', points: circle(0, -c.domeRadius + 1, 1.8) },
        { role: 'shine', points: ellipse(-c.domeRadius * 0.45, -c.domeRadius * 0.6, 3, 2.5) },
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
        // Folds near the knot make the ribbon look soft.
        {
          role: 'shade',
          points: [
            { x: 0, y: middle },
            { x: -half * 0.5, y: middle - b.height * 0.25 },
            { x: -half * 0.5, y: middle + b.height * 0.25 },
          ],
        },
        {
          role: 'shade',
          points: [
            { x: 0, y: middle },
            { x: half * 0.5, y: middle - b.height * 0.25 },
            { x: half * 0.5, y: middle + b.height * 0.25 },
          ],
        },
        {
          role: 'accent',
          points: rect(-b.knotSize / 2, middle - b.knotSize / 2, b.knotSize, b.knotSize),
        },
        { role: 'shine', points: ellipse(-half * 0.65, top + 4, 3, 2), edge: false },
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
      // A light spot on every petal, and seeds in the middle.
      const petalShine: ItemPart[] = Array.from({ length: petalCount }, (_, i) => {
        const angle = -Math.PI / 2 + (i / petalCount) * Math.PI * 2;
        const d = f.petalDistance + f.petalRadius * 0.35;
        return {
          role: 'shine',
          points: circle(Math.cos(angle) * d, Math.sin(angle) * d, f.petalRadius * 0.3),
          edge: false,
        };
      });
      const seeds: ItemPart[] = [-1, 1].flatMap((sx) =>
        [-1, 1].map((sy): ItemPart => ({
          role: 'shade',
          points: circle((sx * f.centerRadius) / 3, (sy * f.centerRadius) / 3, 1),
          edge: false,
        })),
      );
      return [
        ...petals,
        ...petalShine,
        { role: 'accent', points: circle(0, 0, f.centerRadius) },
        ...seeds,
      ];
    }
    case 'pipo': {
      const p = sizes.pipo;
      const r = p.domeRadius;
      return [
        { role: 'main', points: dome(0, 0, r) },
        { role: 'shine', points: ellipse(-r * 0.45, -r * 0.55, 3, 2.5), edge: false },
        { role: 'accent', points: rect(-r, -p.bandHeight, r * 2, p.bandHeight) },
        // Knitted ribs on the band.
        ...Array.from({ length: 6 }, (_, i): ItemPart => ({
          role: 'shade',
          points: rect(-r + 2 + i * ((r * 2 - 4) / 5) - 0.5, -p.bandHeight, 1, p.bandHeight),
          edge: false,
        })),
        // A fluffy pom-pom made of little balls.
        { role: 'accent', points: circle(0, -r, p.ballRadius) },
        { role: 'accent', points: circle(-p.ballRadius * 0.6, -r + 1, p.ballRadius * 0.6) },
        { role: 'accent', points: circle(p.ballRadius * 0.6, -r + 1, p.ballRadius * 0.6) },
        { role: 'shine', points: circle(-1.5, -r - 1.5, 1.5), edge: false },
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
        // Shadow on the right side, colorful dots and a pom-pom.
        {
          role: 'shade',
          points: [
            { x: 0, y: -p.height },
            { x: p.width / 2, y: 0 },
            { x: p.width / 6, y: 0 },
          ],
          edge: false,
        },
        { role: 'gem', points: circle(-p.width * 0.15, -p.height * 0.25, 2) },
        { role: 'gem', points: circle(p.width * 0.12, -p.height * 0.45, 2) },
        { role: 'gem', points: circle(-p.width * 0.02, -p.height * 0.7, 1.6) },
        { role: 'accent', points: circle(0, -p.height, p.ballRadius) },
        { role: 'shine', points: circle(-1.5, -p.height - 1.5, 1.5), edge: false },
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
          role: 'shade',
          points: [
            { x: 0, y: -w.brimHeight - w.coneHeight },
            { x: w.coneWidth / 2, y: -w.brimHeight },
            { x: w.coneWidth / 6, y: -w.brimHeight },
          ],
          edge: false,
        },
        {
          role: 'accent',
          points: starPoints(0, -w.brimHeight - w.coneHeight / 3, w.starOuter, w.starInner),
        },
        // Two tiny stars more.
        {
          role: 'accent',
          points: starPoints(-w.coneWidth * 0.2, -w.brimHeight - w.coneHeight * 0.12, 2.5, 1),
          edge: false,
        },
        {
          role: 'accent',
          points: starPoints(w.coneWidth * 0.05, -w.brimHeight - w.coneHeight * 0.62, 2, 0.8),
          edge: false,
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
        // A metal band with rivets, a ridge on top and a shine.
        { role: 'shade', points: rect(-r, -4, r * 2, 4) },
        ...[-r * 0.6, 0, r * 0.6].map((rx): ItemPart => ({
          role: 'gem',
          points: circle(rx, -2, 1.2),
          edge: false,
        })),
        { role: 'shade', points: rect(-1, -r, 2, r - 4), edge: false },
        { role: 'shine', points: ellipse(-r * 0.5, -r * 0.55, 3, 2.5), edge: false },
      ];
    }
    case 'star': {
      const st = sizes.star;
      return [
        { role: 'main', points: starPoints(0, 0, st.outerRadius, st.innerRadius) },
        // A smaller, lighter star inside makes it glow.
        {
          role: 'shine',
          points: starPoints(-1, -1, st.outerRadius * 0.45, st.innerRadius * 0.45),
          edge: false,
        },
        { role: 'accent', points: circle(0, 0, st.centerRadius) },
      ];
    }
    case 'necklace': {
      const n = sizes.necklace;
      // Beads hang in a U shape, with a gem at the bottom.
      const beads: ItemPart[] = Array.from({ length: n.beads }, (_, i) => {
        const angle = (i / (n.beads - 1)) * Math.PI;
        return {
          role: 'main',
          points: circle(Math.cos(angle) * n.radius, Math.sin(angle) * n.radius, n.beadRadius),
        };
      });
      const beadShine: ItemPart[] = Array.from({ length: n.beads }, (_, i) => {
        const angle = (i / (n.beads - 1)) * Math.PI;
        return {
          role: 'shine',
          points: circle(Math.cos(angle) * n.radius - 1, Math.sin(angle) * n.radius - 1, 1),
          edge: false,
        };
      });
      const pendantY = n.radius + n.pendantRadius;
      return [
        ...beads,
        ...beadShine,
        { role: 'accent', points: circle(0, pendantY, n.pendantRadius) },
        { role: 'shine', points: circle(-1.5, pendantY - 1.5, 1.5), edge: false },
      ];
    }
    case 'ring': {
      const r = sizes.ring;
      // Around the outside, then back around the inside, leaves a hole.
      const outer = circle(0, 0, r.outerRadius);
      const inner = circle(0, 0, r.innerRadius).reverse();
      const first = outer[0];
      const innerFirst = inner.at(-1);
      const band = first && innerFirst ? [...outer, first, innerFirst, ...inner] : outer;
      const gemMiddle = -r.outerRadius - r.gemSize;
      return [
        { role: 'main', points: band, edge: false },
        {
          role: 'shine',
          points: circle(-r.outerRadius * 0.55, -r.outerRadius * 0.55, 1.5),
          edge: false,
        },
        {
          role: 'accent',
          points: [
            { x: 0, y: gemMiddle - r.gemSize },
            { x: r.gemSize, y: gemMiddle },
            { x: 0, y: gemMiddle + r.gemSize },
            { x: -r.gemSize, y: gemMiddle },
          ],
        },
        // A sparkle on the diamond.
        {
          role: 'shine',
          points: [
            { x: 0, y: gemMiddle - r.gemSize },
            { x: -r.gemSize, y: gemMiddle },
            { x: 0, y: gemMiddle },
          ],
          edge: false,
        },
      ];
    }
    case 'tiara': {
      const t = sizes.tiara;
      const half = t.width / 2;
      const step = t.width / (t.spikes - 1);
      const spikeTops = Array.from({ length: t.spikes }, (_, i) => ({
        x: -half + i * step,
        // The middle spike is the tallest.
        y: -t.bandHeight - t.spikeHeight * (i === Math.floor(t.spikes / 2) ? 1.4 : 1),
      }));
      const outline: Point[] = [{ x: -half, y: 0 }];
      spikeTops.forEach((top, i) => {
        outline.push(top);
        if (i < spikeTops.length - 1) outline.push({ x: top.x + step / 2, y: -t.bandHeight });
      });
      outline.push({ x: half, y: 0 });
      return [
        { role: 'main', points: outline },
        {
          role: 'shine',
          points: rect(-half + 2, -t.bandHeight + 1, t.width - 4, 1.5),
          edge: false,
        },
        ...spikeTops.map((top): ItemPart => ({
          role: 'accent',
          points: circle(top.x, top.y + t.gemRadius * 2, t.gemRadius),
        })),
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
