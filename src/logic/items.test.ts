import { describe, expect, it } from 'vitest';
import { ITEMS } from '../config';
import { itemHeight, itemShape, type ItemKind } from './items';

const kinds: ItemKind[] = ['hat', 'crown'];

describe('itemShape', () => {
  it.each(kinds)('the %s sits exactly on its bottom line and fits its height', (kind) => {
    const ys = itemShape(kind, 100, 300, ITEMS).flatMap((part) => part.points.map((p) => p.y));
    expect(Math.max(...ys)).toBe(300);
    expect(Math.min(...ys)).toBe(300 - itemHeight(kind, ITEMS));
  });

  it.each(kinds)('the %s is centered on x', (kind) => {
    const xs = itemShape(kind, 100, 300, ITEMS).flatMap((part) => part.points.map((p) => p.x));
    expect((Math.max(...xs) + Math.min(...xs)) / 2).toBe(100);
  });

  it('gives the crown three spikes', () => {
    const [crown] = itemShape('crown', 0, 0, ITEMS);
    const tops = crown?.points.filter((p) => p.y === -ITEMS.crown.height) ?? [];
    expect(tops).toHaveLength(3);
  });
});
