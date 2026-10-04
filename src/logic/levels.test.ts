import { describe, expect, it } from 'vitest';
import { GAME_WIDTH } from '../config';
import { LEVELS } from '../levels';
import { nextLevel } from './levels';

describe('nextLevel', () => {
  it('goes to the next level', () => {
    expect(nextLevel(0, 3)).toBe(1);
  });

  it('starts over after the last level', () => {
    expect(nextLevel(2, 3)).toBe(0);
  });

  it('rejects zero levels', () => {
    expect(() => nextLevel(0, 0)).toThrow(RangeError);
  });
});

describe('LEVELS', () => {
  it.each(LEVELS.map((level, i) => [i + 1, level] as const))(
    'level %i points to rafts that exist and keeps the hat on screen',
    (_n, level) => {
      expect(level.rafts[level.startRaft]).toBeDefined();
      expect(level.rafts[level.friendRaft]).toBeDefined();
      expect(level.startRaft).not.toBe(level.friendRaft);
      expect(level.hat.x).toBeGreaterThan(0);
      expect(level.hat.x).toBeLessThan(GAME_WIDTH);
    },
  );
});
