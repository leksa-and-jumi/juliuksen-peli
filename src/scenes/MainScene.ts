import Phaser from 'phaser';
import { CLIMB, GAME_HEIGHT, GAME_WIDTH, RAFT, RAFT_PLACES, STICK_FIGURE } from '../config';
import { findRope, landingSpot, pointAlongPath, type RaftTop } from '../logic/climb';
import { raftTopCenter } from '../logic/raft';
import type { Point } from '../logic/stickFigure';
import type { Stroke } from '../logic/strokes';
import { addDrawingPad } from '../objects/DrawingPad';
import { addRaft } from '../objects/Raft';
import { StickFigure } from '../objects/StickFigure';

type FigureState = { mode: 'stand' } | { mode: 'climb'; path: Point[]; distance: number };

/**
 * The game screen. Draw a rope that touches the stick figure and
 * goes up: the figure climbs it, and steps onto a raft at the top.
 */
export class MainScene extends Phaser.Scene {
  private figure!: StickFigure;
  private strokes!: () => readonly Stroke[];
  private raftTops: RaftTop[] = [];
  private state: FigureState = { mode: 'stand' };

  constructor() {
    super('MainScene');
  }

  create(): void {
    this.raftTops = RAFT_PLACES.map((place) => {
      addRaft(this, place);
      const top = raftTopCenter(GAME_WIDTH, GAME_HEIGHT, { ...RAFT, ...place });
      return { left: top.x - RAFT.width / 2, right: top.x + RAFT.width / 2, y: top.y };
    });

    const start = RAFT_PLACES[STICK_FIGURE.raftIndex];
    this.figure = new StickFigure(
      this,
      raftTopCenter(GAME_WIDTH, GAME_HEIGHT, { ...RAFT, ...start }),
    );
    this.state = { mode: 'stand' };

    this.strokes = addDrawingPad(this);
  }

  update(_time: number, delta: number): void {
    if (this.state.mode === 'stand') {
      const path = findRope(
        this.strokes(),
        this.figure.feet,
        STICK_FIGURE.height,
        CLIMB.grabWidth,
        CLIMB.minRise,
      );
      if (path) {
        this.state = { mode: 'climb', path, distance: 0 };
      }
      return;
    }

    this.state.distance += (CLIMB.speed * delta) / 1000;
    const { point, done } = pointAlongPath(this.state.path, this.state.distance);
    if (!done) {
      this.figure.moveTo(point, 'climb');
      return;
    }
    const landing = landingSpot(point, this.raftTops, CLIMB.landingSnap);
    this.figure.moveTo(landing ?? point, landing ? 'stand' : 'climb');
    this.state = { mode: 'stand' };
  }
}
