import type { ItemKind } from './items';
import type { Point, StickFigureShape } from './stickFigure';

/** Where on the friend a thing goes. */
export type WearSpot = 'head' | 'neck' | 'hand';

export const WEAR_SPOT: Record<ItemKind, WearSpot> = {
  hat: 'head',
  crown: 'head',
  cap: 'head',
  bow: 'head',
  flower: 'head',
  pipo: 'head',
  partyHat: 'head',
  wizardHat: 'head',
  vikingHelmet: 'head',
  star: 'head',
  necklace: 'neck',
  ring: 'hand',
  tiara: 'head',
};

/**
 * Where to draw a thing on the friend: the middle of its bottom edge.
 * Head things sit on top of the head, a necklace hangs from the neck,
 * and a ring goes around the hand.
 */
export function wearPoint(figure: StickFigureShape, spot: WearSpot, itemHeight: number): Point {
  const { head, lines } = figure;
  if (spot === 'neck') {
    const neck = lines[0]?.from ?? head;
    return { x: neck.x, y: neck.y + itemHeight };
  }
  if (spot === 'hand') {
    const hand = lines[2]?.to ?? head;
    return { x: hand.x, y: hand.y + itemHeight / 2 };
  }
  return { x: head.x, y: head.y - head.radius / 2 };
}
