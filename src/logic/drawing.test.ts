import { describe, expect, it } from 'vitest';
import { isFarEnough } from './drawing';

describe('isFarEnough', () => {
  it('draws when the mouse has moved enough', () => {
    expect(isFarEnough({ x: 0, y: 0 }, { x: 3, y: 4 }, 5)).toBe(true);
  });

  it('waits when the mouse has barely moved', () => {
    expect(isFarEnough({ x: 0, y: 0 }, { x: 1, y: 1 }, 5)).toBe(false);
  });

  it('rejects a negative step', () => {
    expect(() => isFarEnough({ x: 0, y: 0 }, { x: 1, y: 1 }, -1)).toThrow(RangeError);
  });
});
