import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, RAFT } from '../config';
import { raftPlanks } from '../logic/raft';

/** Draws a wooden raft with code: brown planks with dark seams. */
export function addRaft(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  for (const plank of raftPlanks(GAME_WIDTH, GAME_HEIGHT, RAFT)) {
    g.fillStyle(RAFT.wood);
    g.fillRect(plank.x, plank.y, plank.width, plank.height);
    g.lineStyle(RAFT.seamWidth, RAFT.seam);
    g.strokeRect(plank.x, plank.y, plank.width, plank.height);
  }
  return g;
}
