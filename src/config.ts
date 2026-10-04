/** Shared game constants. Tweak values here instead of inside scenes. */
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const COLORS = {
  background: 0xffffff,
} as const;

/** How every wooden raft looks. */
export const RAFT = {
  width: 200,
  height: 24,
  plankCount: 4,
  seamWidth: 2,
  wood: 0x9c6b3c,
  seam: 0x5d3a1a,
} as const;

/**
 * Where the rafts are.
 * offsetX: pixels from the middle (negative = left, positive = right).
 * bottomMargin: pixels from the bottom edge to the raft's bottom.
 */
export const RAFT_PLACES = [
  { offsetX: -150, bottomMargin: 70 },
  { offsetX: 250, bottomMargin: 400 },
] as const;

/** Julius's stick figure. Sizes are in pixels. */
export const STICK_FIGURE = {
  height: 90, // from feet to top of head
  headRadius: 12,
  lineWidth: 4,
  color: 0x000000,
  raftIndex: 0, // which raft it stands on (0 = the lower left raft)
} as const;
