import type { ItemKind } from './logic/items';

/**
 * The levels of the game, in order. Julius designs them!
 *
 * rafts: where the rafts are.
 *   offsetX: pixels from the middle (negative = left, positive = right).
 *   bottomMargin: pixels from the bottom edge to the raft's bottom.
 * startRaft: the raft Julius's stick figure starts on (0 = the first raft).
 * friendRaft: the raft where the other stick figure waits for the thing.
 * friendOffsetX: where on its raft the friend stands, from the raft's middle.
 * item: the thing to collect on this level, and where it floats
 *   (x, and y = the bottom of the thing).
 */
export interface Level {
  rafts: readonly { offsetX: number; bottomMargin: number }[];
  startRaft: number;
  friendRaft: number;
  friendOffsetX: number;
  item: { kind: ItemKind; x: number; y: number };
}

export const LEVELS: readonly Level[] = [
  {
    rafts: [
      { offsetX: -150, bottomMargin: 70 },
      { offsetX: 250, bottomMargin: 400 },
    ],
    startRaft: 0,
    friendRaft: 1,
    friendOffsetX: 60,
    item: { kind: 'hat', x: 400, y: 300 },
  },
  {
    // Level 2: the other way around, from the right up to the left. Collect a crown!
    rafts: [
      { offsetX: 150, bottomMargin: 70 },
      { offsetX: -250, bottomMargin: 400 },
    ],
    startRaft: 0,
    friendRaft: 1,
    friendOffsetX: -60,
    item: { kind: 'crown', x: 400, y: 280 },
  },
];
