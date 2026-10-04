import { describe, expect, it } from 'vitest';
import { eraseStrokes, type Stroke } from './strokes';

const line: Stroke = [0, 10, 20, 30, 40, 50, 60].map((x) => ({ x, y: 0 }));

describe('eraseStrokes', () => {
  it('cuts a line in two when erasing the middle', () => {
    const pieces = eraseStrokes([line], { x: 30, y: 0 }, 5);
    expect(pieces).toHaveLength(2);
    expect(pieces[0]?.at(-1)).toEqual({ x: 20, y: 0 });
    expect(pieces[1]?.[0]).toEqual({ x: 40, y: 0 });
  });

  it('leaves lines far away alone', () => {
    expect(eraseStrokes([line], { x: 30, y: 100 }, 5)).toEqual([line]);
  });

  it('drops tiny leftovers', () => {
    expect(eraseStrokes([line], { x: 25, y: 0 }, 30)).toEqual([]);
  });
});
