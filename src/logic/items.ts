import type { Point } from './stickFigure';

export type ItemKind = 'hat' | 'crown';

/** One filled piece of a thing, as a closed polygon. */
export interface ItemPart {
  points: Point[];
  role: 'main' | 'accent';
}

interface HatSize {
  width: number;
  height: number;
  brimHeight: number;
  crownWidth: number;
  bandHeight: number;
}

interface CrownSize {
  width: number;
  height: number;
  bandHeight: number;
}

export interface ItemSizes {
  hat: HatSize;
  crown: CrownSize;
}

function rect(left: number, top: number, width: number, height: number): Point[] {
  return [
    { x: left, y: top },
    { x: left + width, y: top },
    { x: left + width, y: top + height },
    { x: left, y: top + height },
  ];
}

/**
 * The pieces a thing is drawn from. `x` is its middle and `bottom`
 * its lowest edge, so it can sit on a head or in the picture.
 */
export function itemShape(kind: ItemKind, x: number, bottom: number, sizes: ItemSizes): ItemPart[] {
  if (kind === 'hat') {
    const h = sizes.hat;
    const crownHeight = h.height - h.brimHeight;
    return [
      { role: 'main', points: rect(x - h.width / 2, bottom - h.brimHeight, h.width, h.brimHeight) },
      {
        role: 'main',
        points: rect(x - h.crownWidth / 2, bottom - h.height, h.crownWidth, crownHeight),
      },
      {
        role: 'accent',
        points: rect(
          x - h.crownWidth / 2,
          bottom - h.brimHeight - h.bandHeight,
          h.crownWidth,
          h.bandHeight,
        ),
      },
    ];
  }

  const c = sizes.crown;
  const left = x - c.width / 2;
  const right = x + c.width / 2;
  const top = bottom - c.height;
  const dip = bottom - c.height / 2;
  return [
    {
      role: 'main',
      // Three spikes on top.
      points: [
        { x: left, y: bottom },
        { x: left, y: top },
        { x: x - c.width / 4, y: dip },
        { x, y: top },
        { x: x + c.width / 4, y: dip },
        { x: right, y: top },
        { x: right, y: bottom },
      ],
    },
    { role: 'accent', points: rect(left, bottom - c.bandHeight, c.width, c.bandHeight) },
  ];
}

/** The total height of a thing, so the figure can grab it by its middle. */
export function itemHeight(kind: ItemKind, sizes: ItemSizes): number {
  return sizes[kind].height;
}
