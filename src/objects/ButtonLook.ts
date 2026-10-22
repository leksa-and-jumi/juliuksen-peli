import Phaser from 'phaser';
import { BUTTON_STYLE } from '../config';

/**
 * Draws a raised, rounded button around (cx, cy): a soft shadow,
 * a white face and a border (blue and thicker when selected).
 * Pass `shadow` to draw the shadow on another layer.
 */
export function drawButtonLook(
  g: Phaser.GameObjects.Graphics,
  cx: number,
  cy: number,
  size: number,
  selected = false,
  shadow: Phaser.GameObjects.Graphics = g,
): void {
  const s = BUTTON_STYLE;
  const half = size / 2;
  shadow.fillStyle(s.shadow, s.shadowAlpha);
  shadow.fillRoundedRect(cx - half, cy - half + s.shadowOffset, size, size, s.cornerRadius);

  g.fillStyle(s.background);
  g.fillRoundedRect(cx - half, cy - half, size, size, s.cornerRadius);
  g.lineStyle(
    selected ? s.selectedBorderWidth : s.borderWidth,
    selected ? s.selectedBorder : s.border,
  );
  g.strokeRoundedRect(cx - half, cy - half, size, size, s.cornerRadius);
}
