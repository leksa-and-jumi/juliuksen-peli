import Phaser from 'phaser';
import { CLIMB, GAME_HEIGHT, HAT, GAME_WIDTH, RAFT, RAFT_PLACES, STICK_FIGURE } from '../config';
import { figureTouches } from '../logic/collect';
import { findRope, landingSpot, pointAlongPath, type RaftTop } from '../logic/climb';
import { raftTopCenter } from '../logic/raft';
import type { Point } from '../logic/stickFigure';
import type { Stroke } from '../logic/strokes';
import { addDrawingPad } from '../objects/DrawingPad';
import { drawHat } from '../objects/Hat';
import { addRaft } from '../objects/Raft';
import { addRestartButton } from '../objects/RestartButton';
import { StickFigure } from '../objects/StickFigure';

type FigureState = { mode: 'stand' } | { mode: 'climb'; path: Point[]; distance: number };

/**
 * The game screen. Draw a rope that touches the stick figure and
 * goes up: the figure climbs it, and steps onto a raft at the top.
 * A hat floats along the way: touch it and the figure wears it.
 */
export class MainScene extends Phaser.Scene {
  private figure!: StickFigure;
  private strokes!: () => readonly Stroke[];
  private raftTops: RaftTop[] = [];
  private state: FigureState = { mode: 'stand' };
  private hat: Phaser.GameObjects.Graphics | null = null;

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

    this.hat = this.add.graphics();
    drawHat(this.hat, HAT.x, HAT.y);

    this.strokes = addDrawingPad(this);
    addRestartButton(this);
  }

  update(_time: number, delta: number): void {
    this.moveFigure(delta);
    this.collectHat();
  }

  private collectHat(): void {
    if (!this.hat) return;
    // The middle of the hat is what the figure has to touch.
    const hatMiddle = { x: HAT.x, y: HAT.y - HAT.crownHeight / 2 };
    if (figureTouches(this.figure.feet, STICK_FIGURE.height, HAT.reach, hatMiddle)) {
      this.hat.destroy();
      this.hat = null;
      this.figure.putOnHat();
    }
  }

  private moveFigure(delta: number): void {
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
