import Phaser from 'phaser';
import { HAT } from '../config';

/** Draws a top hat whose brim bottom is at (x, bottom). */
export function drawHat(g: Phaser.GameObjects.Graphics, x: number, bottom: number): void {
  const crownTop = bottom - HAT.brimHeight - HAT.crownHeight;
  g.fillStyle(HAT.color);
  g.fillRect(x - HAT.brimWidth / 2, bottom - HAT.brimHeight, HAT.brimWidth, HAT.brimHeight);
  g.fillRect(x - HAT.crownWidth / 2, crownTop, HAT.crownWidth, HAT.crownHeight);
  g.fillStyle(HAT.band);
  g.fillRect(
    x - HAT.crownWidth / 2,
    bottom - HAT.brimHeight - HAT.bandHeight,
    HAT.crownWidth,
    HAT.bandHeight,
  );
}
