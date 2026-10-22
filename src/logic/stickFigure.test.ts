import { describe, expect, it } from 'vitest';
import { climbingShape, directionAlong, stickFigureShape } from './stickFigure';

describe('stickFigureShape', () => {
  const shape = stickFigureShape({ x: 100, y: 500 }, 100, 10);

  it('puts the top of the head at the full height', () => {
    expect(shape.head.y - shape.head.radius).toBe(400);
    expect(shape.head.x).toBe(100);
  });

  it('has a body, two arms and two legs', () => {
    expect(shape.lines).toHaveLength(5);
  });

  it('stands with both feet on the ground', () => {
    const feetY = shape.lines.slice(3).map((leg) => leg.to.y);
    expect(feetY).toEqual([500, 500]);
  });

  it('rejects a figure smaller than its head', () => {
    expect(() => stickFigureShape({ x: 0, y: 0 }, 20, 10)).toThrow(RangeError);
  });

  it('reaches the arms up when climbing', () => {
    const climbing = stickFigureShape({ x: 100, y: 500 }, 100, 10, 'climb');
    const hands = climbing.lines.slice(1, 3).map((arm) => arm.to.y);
    const shoulder = climbing.lines[1]?.from.y ?? 0;
    expect(hands.every((y) => y < shoulder)).toBe(true);
  });
});

describe('climbingShape', () => {
  const feet = { x: 100, y: 500 };
  const upRope = { x: 0, y: -1 };

  it('puts the head up the rope from the feet', () => {
    const { head } = climbingShape(feet, upRope, 0, 100, 10);
    expect(head.y).toBeLessThan(430);
  });

  it('grabs the rope with both hands and both feet', () => {
    const ends = climbingShape(feet, upRope, 0.3, 100, 10)
      .lines.slice(1)
      .map((line) => line.to.x);
    ends.forEach((x) => expect(x).toBeCloseTo(100));
  });

  it('hangs the body below a slanted rope', () => {
    // Rope going up to the right: the body is lower than the rope line.
    const shape = climbingShape(feet, { x: 1, y: -1 }, 0, 100, 10);
    const hip = shape.lines[0]?.to ?? feet;
    const ropeYAtHip = feet.y - (hip.x - feet.x);
    expect(hip.y).toBeGreaterThan(ropeYAtHip);
  });

  it('lets the hands take turns reaching up', () => {
    const handY = (phase: number): number[] =>
      climbingShape(feet, upRope, phase, 100, 10)
        .lines.slice(1, 3)
        .map((arm) => arm.to.y);
    const [leftUp, rightUp] = handY(0.25);
    const [leftDown, rightDown] = handY(0.75);
    expect(leftUp).toBeLessThan(rightUp ?? 0);
    expect(leftDown).toBeGreaterThan(rightDown ?? 0);
  });
});

describe('directionAlong', () => {
  it('finds which way a path goes', () => {
    const line = (d: number) => ({ x: d, y: -d });
    expect(directionAlong(line, 50, 10)).toEqual({ x: 20, y: -20 });
  });
});
