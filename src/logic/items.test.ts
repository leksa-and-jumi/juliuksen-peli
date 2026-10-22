import { describe, expect, it } from 'vitest';
import { ITEMS } from '../config';
import { darken, itemHeight, itemShape, type ItemKind } from './items';

const kinds: ItemKind[] = [
  'hat',
  'crown',
  'cap',
  'bow',
  'flower',
  'pipo',
  'partyHat',
  'wizardHat',
  'vikingHelmet',
  'star',
  'necklace',
  'ring',
  'tiara',
];

describe('itemShape', () => {
  it.each(kinds)('the %s sits exactly on its bottom line and fits its height', (kind) => {
    const ys = itemShape(kind, 100, 300, ITEMS).flatMap((part) => part.points.map((p) => p.y));
    expect(Math.max(...ys)).toBeCloseTo(300);
    expect(Math.min(...ys)).toBeCloseTo(300 - itemHeight(kind, ITEMS));
  });

  it.each(kinds)('the %s is centered on x', (kind) => {
    const xs = itemShape(kind, 100, 300, ITEMS).flatMap((part) => part.points.map((p) => p.x));
    expect((Math.max(...xs) + Math.min(...xs)) / 2).toBeCloseTo(100);
  });

  it('gives the crown three spikes', () => {
    const [crown] = itemShape('crown', 0, 0, ITEMS);
    const tops = crown?.points.filter((p) => p.y === -ITEMS.crown.height) ?? [];
    expect(tops).toHaveLength(3);
  });

  it('gives the flower five petals and a middle', () => {
    const parts = itemShape('flower', 0, 0, ITEMS);
    expect(parts.filter((p) => p.role === 'main')).toHaveLength(5);
    expect(parts.filter((p) => p.role === 'accent')).toHaveLength(1);
  });

  it('gives the star five points', () => {
    const [star] = itemShape('star', 0, 0, ITEMS);
    expect(star?.points).toHaveLength(10);
  });
});

describe('darken', () => {
  it('makes a color darker', () => {
    expect(darken(0xffffff, 0.5)).toBe(0x808080);
    expect(darken(0xff0000, 0.5)).toBe(0x800000);
  });

  it('keeps black black', () => {
    expect(darken(0x000000, 0.6)).toBe(0x000000);
  });
});

describe('real look', () => {
  it.each(kinds)('the %s has light or shadow on it', (kind) => {
    const roles = itemShape(kind, 0, 0, ITEMS).map((p) => p.role);
    expect(roles.some((r) => r === 'shine' || r === 'shade')).toBe(true);
  });
});
