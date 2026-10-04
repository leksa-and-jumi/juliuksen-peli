import { describe, expect, it } from 'vitest';
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  ITEMS,
  RAFT,
  RESTART_BUTTON,
  STICK_FIGURE,
  TOOL_BUTTONS,
} from '../config';
import { LEVELS } from '../levels';
import { itemShape } from './items';
import { levelFromQuery, nextLevel } from './levels';
import { raftTopCenter } from './raft';
import { stickFigureShape } from './stickFigure';

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

describe('levelFromQuery', () => {
  it('opens the level from the address', () => {
    expect(levelFromQuery('?level=3', 5)).toBe(2);
  });

  it('starts from the first level when the address has no good level', () => {
    expect(levelFromQuery('', 5)).toBe(0);
    expect(levelFromQuery('?level=9', 5)).toBe(0);
    expect(levelFromQuery('?level=abc', 5)).toBe(0);
  });
});

describe('LEVELS', () => {
  it('has at least ten levels', () => {
    expect(LEVELS.length).toBeGreaterThanOrEqual(10);
  });

  it('has a different thing to collect on every level', () => {
    const kinds = LEVELS.map((level) => level.item.kind);
    expect(new Set(kinds).size).toBe(kinds.length);
  });

  it.each(LEVELS.map((level, i) => [i + 1, level] as const))(
    'level %i points to rafts that exist and keeps the thing on screen',
    (_n, level) => {
      expect(level.rafts[level.startRaft]).toBeDefined();
      expect(level.rafts[level.friendRaft]).toBeDefined();
      expect(level.startRaft).not.toBe(level.friendRaft);
      expect(level.item.x).toBeGreaterThan(0);
      expect(level.item.x).toBeLessThan(GAME_WIDTH);
    },
  );
});

describe('the thing on the head of the friend', () => {
  // The pencil/eraser buttons (top left) and restart button (top right).
  const buttonsBottom = TOOL_BUTTONS.margin + TOOL_BUTTONS.size;
  const leftButtonsRight = TOOL_BUTTONS.margin * 2 + TOOL_BUTTONS.size * 2;
  const restartLeft = GAME_WIDTH - RESTART_BUTTON.margin - RESTART_BUTTON.size;

  it.each(LEVELS.map((level, i) => [i + 1, level] as const))(
    'level %i does not hide it under a button',
    (_n, level) => {
      const raft = level.rafts[level.friendRaft];
      if (!raft) throw new Error('missing raft');
      const top = raftTopCenter(GAME_WIDTH, GAME_HEIGHT, { ...RAFT, ...raft });
      const feet = { x: top.x + level.friendOffsetX, y: top.y };
      const { head } = stickFigureShape(feet, STICK_FIGURE.height, STICK_FIGURE.headRadius);
      const points = itemShape(level.item.kind, head.x, head.y - head.radius / 2, ITEMS).flatMap(
        (part) => part.points,
      );
      const left = Math.min(...points.map((p) => p.x));
      const right = Math.max(...points.map((p) => p.x));
      const highest = Math.min(...points.map((p) => p.y));
      if (highest < buttonsBottom) {
        expect(left).toBeGreaterThan(leftButtonsRight);
        expect(right).toBeLessThan(restartLeft);
      }
    },
  );
});
