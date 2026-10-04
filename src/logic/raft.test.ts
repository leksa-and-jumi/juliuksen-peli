import { describe, expect, it } from 'vitest';
import { raftPlanks } from './raft';

const raft = { width: 300, height: 20, bottomMargin: 50, offsetX: 0, plankCount: 3 };

describe('raftPlanks', () => {
  it('centers the raft and places it near the bottom', () => {
    const planks = raftPlanks(800, 600, raft);
    expect(planks[0]).toEqual({ x: 250, y: 530, width: 100, height: 20 });
    expect(planks[2]?.x).toBe(450);
  });

  it('moves the raft sideways by offsetX', () => {
    const planks = raftPlanks(800, 600, { ...raft, offsetX: -100 });
    expect(planks[0]?.x).toBe(150);
  });

  it('makes planks that cover the whole raft width', () => {
    const planks = raftPlanks(800, 600, raft);
    const total = planks.reduce((sum, p) => sum + p.width, 0);
    expect(planks).toHaveLength(3);
    expect(total).toBe(300);
  });

  it('rejects zero planks', () => {
    expect(() => raftPlanks(800, 600, { ...raft, plankCount: 0 })).toThrow(RangeError);
  });
});
