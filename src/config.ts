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

/** Julius's stick figure. Sizes are in pixels. */
export const STICK_FIGURE = {
  height: 90, // from feet to top of head
  headRadius: 12,
  lineWidth: 4,
  color: 0x000000,
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

/**
 * The things to collect. Every level has its own thing.
 * Sizes are in pixels, colors are main + accent (band, jewel...).
 */
export const ITEMS = {
  hat: {
    width: 34, // the brim
    height: 27,
    brimHeight: 5,
    crownWidth: 22,
    bandHeight: 5,
    color: 0x000000,
    accent: 0xe53935,
  },
  crown: {
    width: 34,
    height: 26,
    bandHeight: 7,
    color: 0xfdd835,
    accent: 0xe53935,
  },
  cap: {
    domeRadius: 13,
    visorLength: 14, // how far the visor sticks out past the dome
    visorHeight: 4,
    color: 0xe53935,
    accent: 0xb71c1c,
  },
  bow: {
    width: 36,
    height: 20,
    knotSize: 8,
    color: 0xec407a,
    accent: 0xad1457,
  },
  flower: {
    petalRadius: 7,
    petalDistance: 8, // from the middle of the flower to the middle of a petal
    centerRadius: 6,
    color: 0xab47bc,
    accent: 0xfdd835,
  },
  pipo: {
    domeRadius: 13,
    bandHeight: 6,
    ballRadius: 5, // the pom-pom on top
    color: 0x43a047,
    accent: 0xfdd835,
  },
  partyHat: {
    width: 26,
    height: 30, // the cone, without the ball on top
    ballRadius: 5,
    color: 0x1e88e5,
    accent: 0xfdd835,
  },
  wizardHat: {
    brimWidth: 36,
    brimHeight: 4,
    coneWidth: 24,
    coneHeight: 34,
    starOuter: 5, // the little star on the cone
    starInner: 2,
    color: 0x5e35b1,
    accent: 0xfdd835,
  },
  vikingHelmet: {
    domeRadius: 13,
    hornLength: 12,
    color: 0x9e9e9e,
    accent: 0xbcaaa4,
  },
  star: {
    outerRadius: 15,
    innerRadius: 6,
    centerRadius: 3,
    color: 0xffc107,
    accent: 0xff8f00,
  },
  // Jewelry 💎
  necklace: {
    radius: 11, // how wide the string of beads hangs
    beads: 9,
    beadRadius: 3,
    pendantRadius: 5, // the gem hanging in the middle
    color: 0xffb300,
    accent: 0xd81b60,
  },
  ring: {
    outerRadius: 9,
    innerRadius: 6,
    gemSize: 5, // half the height of the diamond on top
    color: 0xffb300,
    accent: 0x29b6f6,
  },
  tiara: {
    width: 32,
    bandHeight: 5,
    spikes: 5,
    spikeHeight: 9,
    gemRadius: 2.5,
    color: 0x90a4ae,
    accent: 0x29b6f6,
  },
} as const;

/** Rules shared by every thing to collect. */
export const ITEM = {
  reach: 20, // how close (left/right) the figure must come to grab it
} as const;

/** The colorless picture at the top. A collected thing flies into it. */
export const ITEM_SLOT = {
  x: GAME_WIDTH / 2,
  y: 50, // the bottom of the brim
  outline: 0xbdbdbd,
  outlineWidth: 2,
  flyTime: 600, // milliseconds for the thing to fly up into the picture
} as const;

/** The other stick figure waiting for the thing. Where it stands is set in each level. */
export const FRIEND = {
  giveTime: 800, // milliseconds for the thing to fly onto its head
} as const;

/** Fireworks when a round is done (the friend has got the thing). */
export const FIREWORKS = {
  bursts: 15,
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

/** The round green "continue" button that appears after the fireworks. */
export const CONTINUE_BUTTON = {
  radius: 50,
  color: 0x43a047,
  arrowColor: 0xffffff,
  arrowSize: 22, // half the height of the white play arrow
  pulseScale: 1.12, // grows and shrinks a little so it is easy to notice
  pulseTime: 500,
  prizeY: GAME_HEIGHT - 110, // lower down when the big prize is on the screen
} as const;

/** The big golden prize after level 10. Sizes in pixels. */
export const TROPHY = {
  x: GAME_WIDTH / 2,
  y: 230, // where the bottom of the cup is
  cupWidth: 120,
  cupHeight: 90,
  handleRadius: 24,
  handleWidth: 10,
  stemWidth: 24,
  stemHeight: 36,
  baseWidth: 110,
  baseHeight: 22,
  starOuter: 22,
  starInner: 9,
  color: 0xffc107,
  shade: 0xff8f00,
  popTime: 700, // milliseconds to grow from nothing to full size
} as const;
