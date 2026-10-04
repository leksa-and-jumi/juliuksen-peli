import { describe, expect, it } from 'vitest';
import { stickFigureShape } from './stickFigure';

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
