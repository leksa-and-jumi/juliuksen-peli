import { describe, expect, it } from 'vitest';
import { stickFigureShape } from './stickFigure';
import { wearPoint } from './wear';

const figure = stickFigureShape({ x: 100, y: 500 }, 100, 10);

describe('wearPoint', () => {
  it('puts head things a little below the top of the head', () => {
    expect(wearPoint(figure, 'head', 20)).toEqual({ x: 100, y: 405 });
  });

  it('hangs a necklace down from the neck', () => {
    const neck = figure.lines[0]?.from;
    expect(wearPoint(figure, 'neck', 20)).toEqual({ x: neck?.x, y: (neck?.y ?? 0) + 20 });
  });

  it('puts a ring around the right hand', () => {
    const hand = figure.lines[2]?.to;
    expect(wearPoint(figure, 'hand', 20)).toEqual({ x: hand?.x, y: (hand?.y ?? 0) + 10 });
  });
});
