/**
 * The levels of the game, in order. Julius designs them!
 *
 * rafts: where the rafts are.
 *   offsetX: pixels from the middle (negative = left, positive = right).
 *   bottomMargin: pixels from the bottom edge to the raft's bottom.
 * startRaft: the raft Julius's stick figure starts on (0 = the first raft).
 * friendRaft: the raft where the other stick figure waits for the hat.
 * friendOffsetX: where on its raft the friend stands, from the raft's middle.
 * hat: where the hat floats (x, and y = the bottom of the brim).
 */
export interface Level {
  rafts: readonly { offsetX: number; bottomMargin: number }[];
  startRaft: number;
  friendRaft: number;
  friendOffsetX: number;
  hat: { x: number; y: number };
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
    hat: { x: 400, y: 300 },
  },
  {
    // Level 2: the other way around, from the right up to the left.
    rafts: [
      { offsetX: 150, bottomMargin: 70 },
      { offsetX: -250, bottomMargin: 400 },
    ],
    startRaft: 0,
    friendRaft: 1,
    friendOffsetX: -60,
    hat: { x: 400, y: 280 },
  },
];
