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
  raftIndex: 0, // which raft it starts on (0 = the lower left raft)
} as const;

/** Drawing with the mouse (or a finger on a phone). */
export const DRAWING = {
  lineWidth: 4,
  color: 0x000000,
  eraserWidth: 28,
  minStep: 2, // pixels the mouse must move before a new piece of line is drawn
} as const;

/** The pencil and eraser buttons in the top left corner. */
export const TOOL_BUTTONS = {
  size: 48,
  margin: 12, // gap from the screen edge and between the buttons
  background: 0xeeeeee,
  selectedFrame: 0x2196f3,
  frameWidth: 4,
  pencilColor: 0x000000,
  eraserColor: 0xf48fb1,
} as const;

/** Climbing up a rope that Julius draws. */
export const CLIMB = {
  speed: 120, // pixels per second along the rope
  grabWidth: 20, // how close (left/right) a rope must be for the figure to grab it
  minRise: 30, // the rope's top must be at least this much higher than the feet
  landingSnap: 40, // how close to a raft the rope's top must be to step onto it
} as const;

/** The round arrow button in the top right corner that starts the game over. */
export const RESTART_BUTTON = {
  size: 48,
  margin: 12, // gap from the screen edge
  background: 0xeeeeee,
  arrowColor: 0x000000,
  arrowWidth: 4,
  arrowRadius: 13,
  arrowHeadSize: 8,
} as const;

/** The hat floating along the way. Collect it and the stick figure wears it! */
export const HAT = {
  x: 400,
  y: 300, // the bottom of the brim
  brimWidth: 34,
  brimHeight: 5,
  crownWidth: 22,
  crownHeight: 22,
  bandHeight: 5,
  color: 0x000000,
  band: 0xe53935,
  reach: 20, // how close (left/right) the figure must come to grab it
} as const;

/** The colorless hat picture at the top. A collected hat flies into it. */
export const HAT_SLOT = {
  x: GAME_WIDTH / 2,
  y: 50, // the bottom of the brim
  outline: 0xbdbdbd,
  outlineWidth: 2,
  flyTime: 600, // milliseconds for the hat to fly up into the picture
} as const;

/** The other stick figure waiting on the upper raft. Bring it the hat! */
export const FRIEND = {
  raftIndex: 1, // the upper right raft
  offsetX: 60, // pixels right of the raft's middle
  giveTime: 800, // milliseconds for the hat to fly onto its head
} as const;

/** Fireworks when a round is done (the friend has put on the hat). */
export const FIREWORKS = {
  bursts: 30,
  burstInterval: 180, // milliseconds between bursts
  particlesPerBurst: 70,
  speed: 170, // pixels per second when a burst explodes
  minSpeedShare: 0.3, // the slowest sparks fly at 30 % of the speed
  gravity: 140, // pixels per second², pulls the sparks down
  life: 1.3, // seconds a spark is visible
  sparkRadius: 3,
  // Bursts appear somewhere in this area of the sky.
  area: { left: 120, right: GAME_WIDTH - 120, top: 80, bottom: 320 },
  colors: [0xe53935, 0xfdd835, 0x43a047, 0x1e88e5, 0x8e24aa, 0xfb8c00],
  // The screen gets dark while the fireworks are on.
  darkColor: 0x000000,
  darkness: 0.85, // 0 = not dark at all, 1 = completely black
  darkenTime: 700, // milliseconds to get dark, and to get light again
} as const;
