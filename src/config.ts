/** Shared game constants. Tweak values here instead of inside scenes. */
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const COLORS = {
  background: 0xffffff,
} as const;

/** The wooden raft near the bottom of the screen. */
export const RAFT = {
  width: 320,
  height: 24,
  bottomMargin: 70, // pixels from the bottom edge to the raft's bottom
  plankCount: 5,
  seamWidth: 2,
  wood: 0x9c6b3c,
  seam: 0x5d3a1a,
} as const;
