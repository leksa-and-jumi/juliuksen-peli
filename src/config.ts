/** Shared game constants. Tweak values here instead of inside scenes. */
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

/**
 * What is drawn on top of what (bigger = closer to you).
 * The stick figures are in front of the ropes, so you see them grip the rope.
 */
export const DEPTH = {
  rafts: 0,
  ropes: 1,
  figures: 2,
  items: 3,
  fireworks: 4,
  prize: 5,
  buttons: 6,
} as const;

export const COLORS = {
  background: 0xffffff,
} as const;

/** How every wooden raft looks. */
export const RAFT = {
  width: 200,
  height: 24,
  plankCount: 4,
  seamWidth: 2,
  // Every plank gets a slightly different wood color, like real wood.
  woods: [0x9c6b3c, 0xa8774a, 0x936236, 0xa16f40],
  seam: 0x5d3a1a,
  highlight: 0xc9965f, // light top edge where the sun hits
  highlightHeight: 4,
  shade: 0x6d4524, // dark bottom edge
  shadeHeight: 5,
  grain: 0x6d4524, // the thin lines in the wood
  grainAlpha: 0.5,
  nail: 0x3e2a17,
  nailRadius: 1.6,
  nailInset: 6, // how far the nails are from the plank edges
  rope: 0xd2b48c, // the ropes that tie the planks together
  ropeDark: 0x8d6e3f,
  ropeWidth: 10,
  shadow: 0x000000, // soft shadow under the raft
  shadowAlpha: 0.12,
  shadowDrop: 8,
} as const;

/** Julius's stick figure. Sizes are in pixels. */
export const STICK_FIGURE = {
  height: 90, // from feet to top of head
  headRadius: 12,
  lineWidth: 4,
  color: 0x000000,
  face: 0xffffff, // the head is filled, so lines behind it do not show through
  eyeRadius: 1.8,
  smileWidth: 2,
  tongue: 0xef5350, // the friend sticks its tongue out
  tongueLine: 0xb71c1c,
  tongueWidth: 8,
  tongueLength: 12, // long enough to hang out over the chin
} as const;

/** Drawing with the mouse (or a finger on a phone). */
export const DRAWING = {
  lineWidth: 7,
  color: 0xc8a165, // the rope you draw is tan, like a real rope
  twistColor: 0x8d6e3f, // dark stripes make the rope look twisted
  twistSpacing: 7, // pixels between the stripes
  twistWidth: 2,
  eraserWidth: 28,
  minStep: 2, // pixels the mouse must move before a new piece of line is drawn
} as const;

/** How every small button looks: raised, rounded, with a shadow. */
export const BUTTON_STYLE = {
  cornerRadius: 12,
  background: 0xffffff,
  border: 0xbdbdbd,
  borderWidth: 2,
  selectedBorder: 0x1e88e5,
  selectedBorderWidth: 4,
  shadow: 0x000000,
  shadowAlpha: 0.25,
  shadowOffset: 3, // the shadow sits a little lower, so the button looks raised
} as const;

/** The pencil and eraser buttons in the top left corner. */
export const TOOL_BUTTONS = {
  size: 48,
  margin: 12, // gap from the screen edge and between the buttons
  // The pencil, drawn lying from the bottom left to the top right.
  pencilLength: 34,
  pencilWidth: 8,
  pencilTip: 8, // length of the sharpened wooden tip
  pencilBody: 0xfdd835,
  pencilWood: 0xf5deb3,
  pencilLead: 0x424242,
  pencilMetal: 0xb0bec5,
  pencilEraser: 0xf48fb1,
  // The eraser block, tilted a little.
  eraserLength: 30,
  eraserHeight: 14,
  eraserTiltDeg: -20,
  eraserPink: 0xf48fb1,
  eraserSleeve: 0x1e88e5,
} as const;

/** Climbing up a rope that Julius draws. */
export const CLIMB = {
  speed: 120, // pixels per second along the rope
  grabWidth: 20, // how close (left/right) a rope must be for the figure to grab it
  minRise: 30, // the rope's top must be at least this much higher than the feet
  landingSnap: 40, // how close to a raft the rope's top must be to step onto it
  stepLength: 36, // pixels of rope for one full round of hand-over-hand moves
  directionWindow: 15, // pixels to look back and ahead when finding the rope's direction
} as const;

/** The round arrow button in the top right corner that starts the level over. */
export const RESTART_BUTTON = {
  size: 48,
  margin: 12, // gap from the screen edge
  arrowColor: 0x1e88e5,
  arrowWidth: 5,
  arrowRadius: 12,
  arrowStartDeg: -70, // the arrow goes clockwise from here...
  arrowEndDeg: 220, // ...to here, where the arrow head is
  arrowHeadSize: 8,
  pressScale: 0.85, // shrinks a little when pressed, like a real button
  pressTime: 80,
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
    gem: 0x29b6f6,
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
    gem: 0xec407a, // the dots on the cone
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
    gem: 0x616161, // the rivets
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

/** Light, shadow and edges that make every thing look more real. */
export const ITEM_LOOK = {
  shine: 0xffffff,
  shineAlpha: 0.5,
  shade: 0x000000,
  shadeAlpha: 0.22,
  edgeDarken: 0.6, // edges are the part's own color, this much darker
  edgeWidth: 1.2,
} as const;

/** Rules shared by every thing to collect. */
export const ITEM = {
  reach: 20, // how close (left/right) the figure must come to grab it
  floatHeight: 5, // the floating thing bobs up and down this much
  floatTime: 900, // milliseconds for one bob
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
  glowRadius: 7, // a soft light around every spark
  glowAlpha: 0.25,
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
  ring: 0xffffff, // white edge around the button
  ringWidth: 4,
  shine: 0xffffff, // a soft light spot on the top
  shineAlpha: 0.25,
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
  shine: 0xffffff, // a light stripe makes the gold look shiny
  shineAlpha: 0.45,
  popTime: 700, // milliseconds to grow from nothing to full size
} as const;
