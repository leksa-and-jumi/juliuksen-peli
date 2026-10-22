import Phaser from 'phaser';
import { DEPTH, GAME_HEIGHT, GAME_WIDTH, RAFT } from '../config';
import { raftPlanks } from '../logic/raft';

/**
 * Draws a wooden raft with code: planks of slightly different wood,
 * light top edges, dark bottom edges, wood grain, nails, two ropes
 * tying it together and a soft shadow below.
 */
export function addRaft(
  scene: Phaser.Scene,
  place: { offsetX: number; bottomMargin: number },
): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics().setDepth(DEPTH.rafts);
  const planks = raftPlanks(GAME_WIDTH, GAME_HEIGHT, { ...RAFT, ...place });
  const first = planks[0];
  const last = planks.at(-1);
  if (!first || !last) return g;
  const left = first.x;
  const right = last.x + last.width;
  const top = first.y;
  const h = RAFT.height;

  // Soft shadow under the raft.
  g.fillStyle(RAFT.shadow, RAFT.shadowAlpha);
  g.fillEllipse((left + right) / 2, top + h + RAFT.shadowDrop, right - left, RAFT.shadowDrop);

  planks.forEach((plank, i) => {
    g.fillStyle(RAFT.woods[i % RAFT.woods.length] ?? RAFT.seam);
    g.fillRect(plank.x, plank.y, plank.width, plank.height);
    g.fillStyle(RAFT.highlight);
    g.fillRect(plank.x, plank.y, plank.width, RAFT.highlightHeight);
    g.fillStyle(RAFT.shade);
    g.fillRect(plank.x, plank.y + h - RAFT.shadeHeight, plank.width, RAFT.shadeHeight);

    // Two thin grain lines, placed a little differently on every plank.
    g.lineStyle(1, RAFT.grain, RAFT.grainAlpha);
    const shift = (i % 2) * 6;
    g.lineBetween(
      plank.x + 4 + shift,
      plank.y + h * 0.4,
      plank.x + plank.width - 10,
      plank.y + h * 0.45,
    );
    g.lineBetween(
      plank.x + 10,
      plank.y + h * 0.62,
      plank.x + plank.width - 4 - shift,
      plank.y + h * 0.58,
    );

    g.fillStyle(RAFT.nail);
    g.fillCircle(plank.x + RAFT.nailInset, plank.y + RAFT.nailInset, RAFT.nailRadius);
    g.fillCircle(plank.x + plank.width - RAFT.nailInset, plank.y + RAFT.nailInset, RAFT.nailRadius);

    g.lineStyle(RAFT.seamWidth, RAFT.seam);
    g.strokeRect(plank.x, plank.y, plank.width, plank.height);
  });

  // Two ropes wrapped around the planks.
  for (const share of [0.13, 0.87]) {
    const x = left + (right - left) * share - RAFT.ropeWidth / 2;
    g.fillStyle(RAFT.rope);
    g.fillRect(x, top - 1, RAFT.ropeWidth, h + 2);
    g.lineStyle(1.5, RAFT.ropeDark);
    for (let y = top + 2; y < top + h; y += 4) {
      g.lineBetween(x, y + 3, x + RAFT.ropeWidth, y);
    }
  }
  return g;
}
