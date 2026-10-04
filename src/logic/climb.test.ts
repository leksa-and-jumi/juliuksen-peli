import { describe, expect, it } from 'vitest';
import { findRope, landingSpot, pointAlongPath, standsOn } from './climb';

const feet = { x: 100, y: 500 };
// A rope drawn from the figure's chest up to the right.
const rope = [
  { x: 100, y: 460 },
  { x: 150, y: 400 },
  { x: 200, y: 300 },
];

describe('findRope', () => {
  it('grabs a rope that touches the figure and goes up', () => {
    expect(findRope([rope], feet, 90, 20, 30)).toEqual(rope);
  });

  it('climbs the right way even if the rope was drawn top to bottom', () => {
    expect(findRope([[...rope].reverse()], feet, 90, 20, 30)).toEqual(rope);
  });

  it('ignores ropes that are far away', () => {
    const far = rope.map((p) => ({ x: p.x + 300, y: p.y }));
    expect(findRope([far], feet, 90, 20, 30)).toBeNull();
  });

  it('ignores flat lines that do not go up', () => {
    const flat = [
      { x: 100, y: 480 },
      { x: 200, y: 480 },
    ];
    expect(findRope([flat], feet, 90, 20, 30)).toBeNull();
  });
});

describe('pointAlongPath', () => {
  const path = [
    { x: 0, y: 0 },
    { x: 0, y: -100 },
  ];

  it('moves along the path', () => {
    expect(pointAlongPath(path, 40)).toEqual({ point: { x: 0, y: -40 }, done: false });
  });

  it('stops at the end', () => {
    expect(pointAlongPath(path, 500)).toEqual({ point: { x: 0, y: -100 }, done: true });
  });
});

describe('landingSpot', () => {
  const rafts = [{ left: 500, right: 700, y: 176 }];

  it('steps onto a raft near the top of the rope', () => {
    expect(landingSpot({ x: 480, y: 160 }, rafts, 40)).toEqual({ x: 500, y: 176 });
  });

  it('keeps hanging when no raft is near', () => {
    expect(landingSpot({ x: 200, y: 300 }, rafts, 40)).toBeNull();
  });
});

describe('standsOn', () => {
  const raft = { left: 500, right: 700, y: 176 };

  it('knows when the figure is on the raft', () => {
    expect(standsOn({ x: 550, y: 176 }, raft)).toBe(true);
  });

  it('knows when the figure is somewhere else', () => {
    expect(standsOn({ x: 550, y: 300 }, raft)).toBe(false);
    expect(standsOn({ x: 300, y: 176 }, raft)).toBe(false);
  });
});
