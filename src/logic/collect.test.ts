import { describe, expect, it } from 'vitest';
import { figureTouches } from './collect';

const feet = { x: 100, y: 500 };

describe('figureTouches', () => {
  it('grabs an item at the figure', () => {
    expect(figureTouches(feet, 90, 20, { x: 110, y: 450 })).toBe(true);
  });

  it('misses an item to the side', () => {
    expect(figureTouches(feet, 90, 20, { x: 150, y: 450 })).toBe(false);
  });

  it('misses an item above the head', () => {
    expect(figureTouches(feet, 90, 20, { x: 100, y: 380 })).toBe(false);
  });
});
