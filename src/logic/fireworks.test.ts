import { describe, expect, it } from 'vitest';
import { burst, randomSpot, stepSparks } from './fireworks';

describe('burst', () => {
  it('makes sparks that fly out in every direction', () => {
    const sparks = burst({ x: 100, y: 100 }, 4, 10, 0xff0000, 1);
    expect(sparks).toHaveLength(4);
    expect(sparks[0]?.vx).toBeCloseTo(10);
    expect(sparks[2]?.vx).toBeCloseTo(-10);
  });

  it('gives sparks different speeds so the burst is filled', () => {
    const [slow] = burst({ x: 0, y: 0 }, 1, 10, 0, 1, 0.5, () => 0);
    const [fast] = burst({ x: 0, y: 0 }, 1, 10, 0, 1, 0.5, () => 1);
    expect(slow?.vx).toBeCloseTo(5);
    expect(fast?.vx).toBeCloseTo(10);
  });
});

describe('stepSparks', () => {
  const spark = { x: 0, y: 0, vx: 10, vy: 0, color: 0, life: 1 };

  it('moves sparks and lets gravity pull them down', () => {
    const [moved] = stepSparks([spark], 0.5, 20);
    expect(moved?.x).toBe(5);
    expect(moved?.vy).toBe(10);
  });

  it('removes sparks that have burnt out', () => {
    expect(stepSparks([spark], 2, 20)).toEqual([]);
  });
});

describe('randomSpot', () => {
  it('stays inside the area', () => {
    const area = { left: 10, right: 20, top: 30, bottom: 50 };
    expect(randomSpot(area, () => 0)).toEqual({ x: 10, y: 30 });
    expect(randomSpot(area, () => 1)).toEqual({ x: 20, y: 50 });
  });
});
