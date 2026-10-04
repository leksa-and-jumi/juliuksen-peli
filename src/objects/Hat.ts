import Phaser from 'phaser';
import { HAT, HAT_SLOT } from '../config';

/** Draws a colored top hat whose brim bottom is at (x, bottom). */
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

/** Draws the same hat as a gray outline with no colors: the empty hat picture. */
export function drawHatOutline(g: Phaser.GameObjects.Graphics, x: number, bottom: number): void {
  const crownTop = bottom - HAT.brimHeight - HAT.crownHeight;
  g.lineStyle(HAT_SLOT.outlineWidth, HAT_SLOT.outline);
  g.strokeRect(x - HAT.brimWidth / 2, bottom - HAT.brimHeight, HAT.brimWidth, HAT.brimHeight);
  g.strokeRect(x - HAT.crownWidth / 2, crownTop, HAT.crownWidth, HAT.crownHeight);
}
