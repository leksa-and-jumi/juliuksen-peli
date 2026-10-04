import type { Point } from './stickFigure';

export type Tool = 'pencil' | 'eraser';

/** The order of the buttons from left to right. */
export const TOOLS: readonly Tool[] = ['pencil', 'eraser'];

export interface ToolButton {
  tool: Tool;
  x: number; // top-left corner
  y: number;
  size: number;
}

/** Lays the tool buttons in a row in the top left corner. */
export function toolButtons(size: number, margin: number): ToolButton[] {
  return TOOLS.map((tool, i) => ({
    tool,
    x: margin + i * (size + margin),
    y: margin,
    size,
  }));
}

/** The tool whose button is under `point`, or null if none. */
export function toolAt(point: Point, buttons: readonly ToolButton[]): Tool | null {
  const hit = buttons.find(
    (b) => point.x >= b.x && point.x <= b.x + b.size && point.y >= b.y && point.y <= b.y + b.size,
  );
  return hit ? hit.tool : null;
}
