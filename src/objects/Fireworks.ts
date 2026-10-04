import Phaser from 'phaser';
import { FIREWORKS } from '../config';
import { burst, randomSpot, stepSparks, type Spark } from '../logic/fireworks';

/** Colorful fireworks drawn with code. Call `update` every frame. */
export class Fireworks {
  private readonly g: Phaser.GameObjects.Graphics;
  private sparks: Spark[] = [];

  constructor(private readonly scene: Phaser.Scene) {
    this.g = scene.add.graphics();
  }

  /** Starts a show of several bursts, one after another. */
  start(): void {
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
}
