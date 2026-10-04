import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, RAFT, RAFT_PLACES, STICK_FIGURE } from '../config';
import { raftTopCenter } from '../logic/raft';
import { addRaft } from '../objects/Raft';
import { addStickFigure } from '../objects/StickFigure';

/** The game screen. Julius designs everything on it. */
export class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  create(): void {
    for (const place of RAFT_PLACES) {
      addRaft(this, place);
    }

    const raft = RAFT_PLACES[STICK_FIGURE.raftIndex];
    addStickFigure(this, raftTopCenter(GAME_WIDTH, GAME_HEIGHT, { ...RAFT, ...raft }));
  }
}
