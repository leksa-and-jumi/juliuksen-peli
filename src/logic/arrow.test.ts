import { describe, expect, it } from 'vitest';
import { arcArrowHead } from './arrow';

describe('arcArrowHead', () => {
  it('points down at the right side of a clockwise circle', () => {
    const [tip, a, b] = arcArrowHead(0, 0, 10, 0, 4);
    expect(tip.x).toBeCloseTo(10);
    expect(tip.y).toBeCloseTo(4);
    // The two back corners sit across the arc, one outside and one inside.
    expect(a.x).toBeCloseTo(13.2);
    expect(b.x).toBeCloseTo(6.8);
  });
});
