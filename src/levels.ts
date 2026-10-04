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
 * prize: true gives the big golden prize after this level.
 */
/** The game remembers the current level under this name while scenes restart. */
export const LEVEL_KEY = 'level';

export interface Level {
  rafts: readonly { offsetX: number; bottomMargin: number }[];
  startRaft: number;
  friendRaft: number;
  friendOffsetX: number;
  item: { kind: ItemKind; x: number; y: number };
  prize?: boolean;
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
  {
    // Level 3: straight up the middle. Collect a cap!
    rafts: [
      { offsetX: 0, bottomMargin: 70 },
      { offsetX: 0, bottomMargin: 430 },
    ],
    startRaft: 0,
    friendRaft: 1,
    friendOffsetX: 70,
    item: { kind: 'cap', x: 400, y: 330 },
  },
  {
    // Level 4: three rafts like stairs. Collect a bow!
    rafts: [
      { offsetX: -250, bottomMargin: 70 },
      { offsetX: 0, bottomMargin: 250 },
      { offsetX: 250, bottomMargin: 430 },
    ],
    startRaft: 0,
    friendRaft: 2,
    friendOffsetX: 60,
    item: { kind: 'bow', x: 475, y: 185 },
  },
  {
    // Level 5: zigzag up. Collect a flower!
    rafts: [
      { offsetX: 250, bottomMargin: 70 },
      { offsetX: -200, bottomMargin: 260 },
      { offsetX: 200, bottomMargin: 450 },
    ],
    startRaft: 0,
    friendRaft: 2,
    friendOffsetX: 60,
    item: { kind: 'flower', x: 475, y: 400 },
  },
  {
    // Level 6: up to the left, then over to the right. Collect a pipo!
    rafts: [
      { offsetX: 0, bottomMargin: 70 },
      { offsetX: -250, bottomMargin: 280 },
      { offsetX: 250, bottomMargin: 440 },
    ],
    startRaft: 0,
    friendRaft: 2,
    friendOffsetX: 60,
    item: { kind: 'pipo', x: 330, y: 410 },
  },
  {
    // Level 7: a long rope across the screen. Collect a party hat!
    rafts: [
      { offsetX: -280, bottomMargin: 70 },
      { offsetX: 280, bottomMargin: 300 },
    ],
    startRaft: 0,
    friendRaft: 1,
    friendOffsetX: 60,
    item: { kind: 'partyHat', x: 400, y: 330 },
  },
  {
    // Level 8: four rafts like a long staircase. Collect a wizard hat!
    rafts: [
      { offsetX: -300, bottomMargin: 70 },
      { offsetX: -100, bottomMargin: 190 },
      { offsetX: 100, bottomMargin: 310 },
      { offsetX: 280, bottomMargin: 430 },
    ],
    startRaft: 0,
    friendRaft: 3,
    friendOffsetX: 30, // not too far right, or the hat hides under the restart button
    item: { kind: 'wizardHat', x: 560, y: 175 },
  },
  {
    // Level 9: zigzag with four rafts. Collect a viking helmet!
    rafts: [
      { offsetX: 250, bottomMargin: 70 },
      { offsetX: -250, bottomMargin: 180 },
      { offsetX: 250, bottomMargin: 290 },
      { offsetX: -250, bottomMargin: 400 },
    ],
    startRaft: 0,
    friendRaft: 3,
    friendOffsetX: -60,
    item: { kind: 'vikingHelmet', x: 400, y: 300 },
  },
  {
    // Level 10: the big finale. Collect a star!
    rafts: [
      { offsetX: -300, bottomMargin: 70 },
      { offsetX: 300, bottomMargin: 250 },
      { offsetX: -150, bottomMargin: 440 },
    ],
    startRaft: 0,
    friendRaft: 2,
    friendOffsetX: -60,
    item: { kind: 'star', x: 470, y: 200 },
    prize: true,
  },
  {
    // Level 11: the first jewelry level 💎. Give a necklace!
    rafts: [
      { offsetX: 280, bottomMargin: 70 },
      { offsetX: -200, bottomMargin: 380 },
    ],
    startRaft: 0,
    friendRaft: 1,
    friendOffsetX: -60,
    item: { kind: 'necklace', x: 480, y: 330 },
  },
  {
    // Level 12: out to the right and back up left. Give a ring!
    rafts: [
      { offsetX: -280, bottomMargin: 70 },
      { offsetX: 100, bottomMargin: 230 },
      { offsetX: -200, bottomMargin: 420 },
    ],
    startRaft: 0,
    friendRaft: 2,
    friendOffsetX: -60,
    item: { kind: 'ring', x: 350, y: 235 },
  },
  {
    // Level 13: left, then all the way up right. Give a tiara!
    rafts: [
      { offsetX: 0, bottomMargin: 70 },
      { offsetX: -280, bottomMargin: 250 },
      { offsetX: 250, bottomMargin: 440 },
    ],
    startRaft: 0,
    friendRaft: 2,
    friendOffsetX: 60,
    item: { kind: 'tiara', x: 390, y: 210 },
  },
];
