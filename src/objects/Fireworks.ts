import Phaser from 'phaser';
import { FIREWORKS, GAME_HEIGHT, GAME_WIDTH } from '../config';
import { burst, randomSpot, stepSparks, type Spark } from '../logic/fireworks';

/**
 * Colorful fireworks drawn with code. The screen gets dark while
 * they are on, and light again when the show is over.
 * Call `update` every frame.
 */
export class Fireworks {
  private readonly dark: Phaser.GameObjects.Rectangle;
  private readonly g: Phaser.GameObjects.Graphics;
  private sparks: Spark[] = [];
  private fade: Phaser.Tweens.Tween | null = null;

  constructor(private readonly scene: Phaser.Scene) {
    this.dark = scene.add
      .rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, FIREWORKS.darkColor)
      .setOrigin(0, 0)
      .setAlpha(0);
    this.g = scene.add.graphics();
  }

  /** Starts a show of many bursts, one after another. Calls `onDone` at the end. */
  start(onDone?: () => void): void {
    this.fadeTo(FIREWORKS.darkness);

    let count = 0;
    this.scene.time.addEvent({
      delay: FIREWORKS.burstInterval,
      repeat: FIREWORKS.bursts - 1,
      callback: () => {
        const color = FIREWORKS.colors[count % FIREWORKS.colors.length] ?? 0;
        count++;
        this.sparks.push(
          ...burst(
            randomSpot(FIREWORKS.area),
            FIREWORKS.particlesPerBurst,
            FIREWORKS.speed,
            color,
            FIREWORKS.life,
            FIREWORKS.minSpeedShare,
          ),
        );
      },
    });

    // Get light again when the last sparks have burnt out.
    const showTime = FIREWORKS.bursts * FIREWORKS.burstInterval + FIREWORKS.life * 1000;
    this.scene.time.delayedCall(showTime, () => {
      this.fadeTo(0);
      onDone?.();
    });
  }

  update(delta: number): void {
    if (this.sparks.length === 0) return;
    this.sparks = stepSparks(this.sparks, delta / 1000, FIREWORKS.gravity);
    this.g.clear();
    for (const s of this.sparks) {
      // Sparks fade out as they burn.
      this.g.fillStyle(s.color, Math.min(1, s.life / FIREWORKS.life + 0.2));
      this.g.fillCircle(s.x, s.y, FIREWORKS.sparkRadius);
    }
  }

  private fadeTo(alpha: number): void {
    // Stop an earlier fade, so a new show right after the last one stays dark.
    this.fade?.stop();
    this.fade = this.scene.tweens.add({
      targets: this.dark,
      alpha,
      duration: FIREWORKS.darkenTime,
    });
  }
}
