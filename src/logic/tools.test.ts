import { describe, expect, it } from 'vitest';
import { toolAt, toolButtons } from './tools';

describe('toolButtons', () => {
  it('puts the pencil first and the eraser next to it', () => {
    expect(toolButtons(40, 10)).toEqual([
      { tool: 'pencil', x: 10, y: 10, size: 40 },
      { tool: 'eraser', x: 60, y: 10, size: 40 },
    ]);
  });
});

describe('toolAt', () => {
  const buttons = toolButtons(40, 10);

  it('finds the button under the mouse', () => {
    expect(toolAt({ x: 20, y: 20 }, buttons)).toBe('pencil');
    expect(toolAt({ x: 80, y: 30 }, buttons)).toBe('eraser');
  });

  it('gives null when no button is there', () => {
    expect(toolAt({ x: 400, y: 300 }, buttons)).toBeNull();
  });
});
