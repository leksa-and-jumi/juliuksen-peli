import Phaser from 'phaser';
import { DEPTH, DRAWING, GAME_HEIGHT, GAME_WIDTH, TOOL_BUTTONS } from '../config';
import { isFarEnough } from '../logic/drawing';
import { ropeTwists, rotatePoints } from '../logic/geometry';
import type { Point } from '../logic/stickFigure';
import { eraseStrokes, type Stroke } from '../logic/strokes';
import { toolAt, toolButtons, type Tool, type ToolButton } from '../logic/tools';
import { drawButtonLook } from './ButtonLook';

/**
 * Lets the player draw ropes on the screen: hold the mouse button
 * (or a finger) down and move. The rope is tan with dark twist stripes. The buttons in the top left corner
 * switch between the pencil and the eraser. The eraser only
 * removes drawn lines, never the rafts or the stick figure.
 *
 * Returns a function that gives the finished lines, so the
 * stick figure can climb them like ropes.
 */
export function addDrawingPad(scene: Phaser.Scene): () => readonly Stroke[] {
  const canvas = scene.add
    .renderTexture(0, 0, GAME_WIDTH, GAME_HEIGHT)
    .setOrigin(0, 0)
    .setDepth(DEPTH.ropes);
  // An off-screen brush: each piece of line is drawn here first,
  // then copied onto (or erased from) the canvas.
  const brush = scene.make.graphics({}, false);
  const buttons = toolButtons(TOOL_BUTTONS.size, TOOL_BUTTONS.margin);
  const buttonsLayer = scene.add.graphics().setDepth(DEPTH.buttons);

  let tool: Tool = 'pencil';
  let last: Point | null = null;
  let strokes: Stroke[] = [];
  let current: Stroke = [];
  let twistCarry = 0; // keeps the rope stripes evenly spaced

  const paint = (from: Point, to: Point): void => {
    const width = tool === 'eraser' ? DRAWING.eraserWidth : DRAWING.lineWidth;
    brush.clear();
    brush.lineStyle(width, DRAWING.color);
    brush.fillStyle(DRAWING.color);
    brush.lineBetween(from.x, from.y, to.x, to.y);
    // Dots at both ends keep the line corners round.
    brush.fillCircle(from.x, from.y, width / 2);
    brush.fillCircle(to.x, to.y, width / 2);
    if (tool === 'pencil') {
      const twists = ropeTwists(from, to, twistCarry, DRAWING.twistSpacing);
      twistCarry = twists.carried;
      // Each stripe crosses the rope at a slant.
      const length = Math.hypot(to.x - from.x, to.y - from.y) || 1;
      const along = { x: (to.x - from.x) / length, y: (to.y - from.y) / length };
      const across = { x: -along.y, y: along.x };
      const half = width / 2;
      brush.lineStyle(DRAWING.twistWidth, DRAWING.twistColor);
      for (const spot of twists.spots) {
        brush.lineBetween(
          spot.x - across.x * half - along.x * half * 0.6,
          spot.y - across.y * half - along.y * half * 0.6,
          spot.x + across.x * half + along.x * half * 0.6,
          spot.y + across.y * half + along.y * half * 0.6,
        );
      }
    }
    if (tool === 'eraser') {
      canvas.erase(brush);
      strokes = eraseStrokes(strokes, to, width / 2);
    } else {
      current.push(to);
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

  scene.input.on(
    'pointerdown',
    (pointer: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) => {
      // Pressing another button (like restart) must not draw.
      if (over.length > 0) return;
      const point = { x: pointer.x, y: pointer.y };
      const picked = toolAt(point, buttons);
      if (picked) {
        tool = picked;
        drawButtons();
        return;
      }
      last = point;
      current = [];
      twistCarry = 0;
      paint(point, point);
    },
  );

  scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
    if (!last || !pointer.isDown) return;
    const next = { x: pointer.x, y: pointer.y };
    if (!isFarEnough(last, next, DRAWING.minStep)) return;
    paint(last, next);
    last = next;
  });

  const stop = (): void => {
    if (current.length >= 2) strokes.push(current);
    current = [];
    last = null;
  };
  scene.input.on('pointerup', stop);
  scene.input.on('pointerupoutside', stop);

  drawButtons();
  return () => strokes;
}

/** A real-looking pencil and a real-looking eraser on raised buttons. */
function drawButton(g: Phaser.GameObjects.Graphics, b: ToolButton, selected: boolean): void {
  const t = TOOL_BUTTONS;
  const cx = b.x + t.size / 2;
  const cy = b.y + t.size / 2;
  drawButtonLook(g, cx, cy, t.size, selected);

  // Shapes are made lying flat around (0, 0), then turned and moved.
  const place = (points: Point[], angle: number): Phaser.Math.Vector2[] =>
    rotatePoints(points, angle).map((p) => new Phaser.Math.Vector2(cx + p.x, cy + p.y));
  const box = (x0: number, x1: number, h: number): Point[] => [
    { x: x0, y: -h / 2 },
    { x: x1, y: -h / 2 },
    { x: x1, y: h / 2 },
    { x: x0, y: h / 2 },
  ];

  if (b.tool === 'pencil') {
    // Tip on the left, eraser on the right, then turned to point down-left.
    const angle = -Math.PI / 4;
    const half = t.pencilLength / 2;
    const w = t.pencilWidth;
    const tipEnd = -half + t.pencilTip;
    const leadEnd = -half + t.pencilTip * 0.4;
    const metalStart = half - 7;
    const rubberStart = half - 4;
    g.fillStyle(t.pencilWood);
    g.fillPoints(
      place(
        [
          { x: -half, y: 0 },
          { x: tipEnd, y: -w / 2 },
          { x: tipEnd, y: w / 2 },
        ],
        angle,
      ),
      true,
    );
    g.fillStyle(t.pencilLead);
    g.fillPoints(
      place(
        [
          { x: -half, y: 0 },
          { x: leadEnd, y: -w * 0.2 },
          { x: leadEnd, y: w * 0.2 },
        ],
        angle,
      ),
      true,
    );
    g.fillStyle(t.pencilBody);
    g.fillPoints(place(box(tipEnd, metalStart, w), angle), true);
    g.fillStyle(t.pencilMetal);
    g.fillPoints(place(box(metalStart, rubberStart, w), angle), true);
    g.fillStyle(t.pencilEraser);
    g.fillPoints(place(box(rubberStart, half, w), angle), true);
  } else {
    const angle = Phaser.Math.DegToRad(t.eraserTiltDeg);
    const half = t.eraserLength / 2;
    g.fillStyle(t.eraserPink);
    g.fillPoints(place(box(-half, half, t.eraserHeight), angle), true);
    g.fillStyle(t.eraserSleeve);
    g.fillPoints(place(box(0, half, t.eraserHeight), angle), true);
  }
}
