import Phaser from 'phaser';
import { RAFT_PLACES } from '../config';
import { addRaft } from '../objects/Raft';

/** The game screen. Julius designs everything on it. */
export class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  create(): void {
    for (const place of RAFT_PLACES) {
      addRaft(this, place);
    }
  }
}
