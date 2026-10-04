import Phaser from 'phaser';
import { addRaft } from '../objects/Raft';

/** The game screen. Julius designs everything on it. */
export class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  create(): void {
    addRaft(this);
  }
}
