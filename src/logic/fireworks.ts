import type { Point } from './stickFigure';

export interface Spark {
  x: number;
  y: number;
  vx: number; // pixels per second
  vy: number;
  color: number;
  life: number; // seconds left
}

/**
 * One firework explosion: sparks flying out in every direction from
 * `center`. Each spark gets a speed between `minSpeedShare` × speed and
 * the full speed, so the burst is filled instead of a thin ring.
 */
export function burst(
  center: Point,
  count: number,
  speed: number,
  color: number,
  life: number,
  minSpeedShare = 1,
  random: () => number = Math.random,
): Spark[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const sparkSpeed = speed * (minSpeedShare + random() * (1 - minSpeedShare));
    return {
      x: center.x,
      y: center.y,
      vx: Math.cos(angle) * sparkSpeed,
      vy: Math.sin(angle) * sparkSpeed,
      color,
      life,
    };
  });
}

/** Moves every spark forward by `dt` seconds. Burnt-out sparks disappear. */
export function stepSparks(sparks: readonly Spark[], dt: number, gravity: number): Spark[] {
  return sparks
    .map((s) => ({
      ...s,
      x: s.x + s.vx * dt,
      y: s.y + s.vy * dt,
      vy: s.vy + gravity * dt,
      life: s.life - dt,
    }))
    .filter((s) => s.life > 0);
}

/** A random spot inside the area, using `random` (0..1) so tests can choose. */
export function randomSpot(
  area: { left: number; right: number; top: number; bottom: number },
  random: () => number = Math.random,
): Point {
  return {
    x: area.left + random() * (area.right - area.left),
    y: area.top + random() * (area.bottom - area.top),
  };
}
