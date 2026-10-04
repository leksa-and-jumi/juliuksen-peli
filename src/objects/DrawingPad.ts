import Phaser from 'phaser';
import { DRAWING, GAME_HEIGHT, GAME_WIDTH, TOOL_BUTTONS } from '../config';
import { isFarEnough } from '../logic/drawing';
import type { Point } from '../logic/stickFigure';
import { toolAt, toolButtons, type Tool, type ToolButton } from '../logic/tools';

/**
 * Lets the player draw on the screen: hold the mouse button
 * (or a finger) down and move. The buttons in the top left corner
 * switch between the pencil and the eraser. The eraser only
 * removes drawn lines, never the rafts or the stick figure.
 */
export function addDrawingPad(scene: Phaser.Scene): void {
  const canvas = scene.add.renderTexture(0, 0, GAME_WIDTH, GAME_HEIGHT).setOrigin(0, 0);
  // An off-screen brush: each piece of line is drawn here first,
  // then copied onto (or erased from) the canvas.
  const brush = scene.make.graphics({}, false);
  const buttons = toolButtons(TOOL_BUTTONS.size, TOOL_BUTTONS.margin);
  const buttonsLayer = scene.add.graphics();

  let tool: Tool = 'pencil';
  let last: Point | null = null;

  const paint = (from: Point, to: Point): void => {
    const width = tool === 'eraser' ? DRAWING.eraserWidth : DRAWING.lineWidth;
    brush.clear();
    brush.lineStyle(width, DRAWING.color);
    brush.fillStyle(DRAWING.color);
    brush.lineBetween(from.x, from.y, to.x, to.y);
    // Dots at both ends keep the line corners round.
    brush.fillCircle(from.x, from.y, width / 2);
    brush.fillCircle(to.x, to.y, width / 2);
    if (tool === 'eraser') {
      canvas.erase(brush);
    } else {
      canvas.draw(brush);
    }
    canvas.render();
  };

  const drawButtons = (): void => {
    buttonsLayer.clear();
    for (const b of buttons) {
      drawButton(buttonsLayer, b, b.tool === tool);
    }
  };

  scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
    const point = { x: pointer.x, y: pointer.y };
    const picked = toolAt(point, buttons);
    if (picked) {
      tool = picked;
      drawButtons();
      return;
    }
    last = point;
    paint(point, point);
  });

  scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
    if (!last || !pointer.isDown) return;
    const next = { x: pointer.x, y: pointer.y };
    if (!isFarEnough(last, next, DRAWING.minStep)) return;
    paint(last, next);
    last = next;
  });

  const stop = (): void => {
    last = null;
  };
  scene.input.on('pointerup', stop);
  scene.input.on('pointerupoutside', stop);

  drawButtons();
}

/** A pencil button shows a black dot, the eraser button a pink block. */
function drawButton(g: Phaser.GameObjects.Graphics, b: ToolButton, selected: boolean): void {
  const { size, frameWidth } = TOOL_BUTTONS;
  const centerX = b.x + size / 2;
  const centerY = b.y + size / 2;

  g.fillStyle(TOOL_BUTTONS.background);
  g.fillRect(b.x, b.y, size, size);
  if (selected) {
    g.lineStyle(frameWidth, TOOL_BUTTONS.selectedFrame);
    g.strokeRect(b.x, b.y, size, size);
  }

  if (b.tool === 'pencil') {
    g.fillStyle(TOOL_BUTTONS.pencilColor);
    g.fillCircle(centerX, centerY, size / 6);
  } else {
    g.fillStyle(TOOL_BUTTONS.eraserColor);
    g.fillRect(b.x + size / 4, b.y + size / 3, size / 2, size / 3);
  }
}
