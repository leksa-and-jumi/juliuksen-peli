import { describe, expect, it } from 'vitest';
import { ropeTwists, rotatePoints } from './geometry';

describe('rotatePoints', () => {
  it('turns a point a quarter turn clockwise on screen', () => {
    const [p] = rotatePoints([{ x: 10, y: 0 }], Math.PI / 2);
    expect(p?.x).toBeCloseTo(0);
    expect(p?.y).toBeCloseTo(10);
  });

  it('turns around the given middle point', () => {
    const [p] = rotatePoints([{ x: 20, y: 10 }], Math.PI, 10, 10);
    expect(p?.x).toBeCloseTo(0);
    expect(p?.y).toBeCloseTo(10);
  });
});

describe('ropeTwists', () => {
  it('puts stripes evenly along the rope', () => {
    const { spots, carried } = ropeTwists({ x: 0, y: 0 }, { x: 20, y: 0 }, 0, 7);
    expect(spots.map((s) => s.x)).toEqual([7, 14]);
    expect(carried).toBeCloseTo(6);
  });

  it('keeps the spacing across small pieces of rope', () => {
    const first = ropeTwists({ x: 0, y: 0 }, { x: 5, y: 0 }, 0, 7);
    expect(first.spots).toEqual([]);
    const second = ropeTwists({ x: 5, y: 0 }, { x: 10, y: 0 }, first.carried, 7);
    expect(second.spots.map((s) => s.x)).toEqual([7]);
  });

  it('rejects a spacing of zero', () => {
    expect(() => ropeTwists({ x: 0, y: 0 }, { x: 1, y: 0 }, 0, 0)).toThrow(RangeError);
  });
});
