import Phaser from 'phaser';
import {
  CLIMB,
  GAME_HEIGHT,
  GAME_WIDTH,
  HAT,
  HAT_SLOT,
  RAFT,
  RAFT_PLACES,
  STICK_FIGURE,
} from '../config';
import { figureTouches } from '../logic/collect';
import { findRope, landingSpot, pointAlongPath, type RaftTop } from '../logic/climb';
import { raftTopCenter } from '../logic/raft';
import type { Point } from '../logic/stickFigure';
import type { Stroke } from '../logic/strokes';
import { addDrawingPad } from '../objects/DrawingPad';
import { drawHat, drawHatOutline } from '../objects/Hat';
import { addRaft } from '../objects/Raft';
import { addRestartButton } from '../objects/RestartButton';
import { StickFigure } from '../objects/StickFigure';

type FigureState = { mode: 'stand' } | { mode: 'climb'; path: Point[]; distance: number };

/**
 * The game screen. Draw a rope that touches the stick figure and
 * goes up: the figure climbs it, and steps onto a raft at the top.
 * A hat floats along the way: touch it and it flies into the
 * colorless hat picture at the top.
 */
export class MainScene extends Phaser.Scene {
  private figure!: StickFigure;
  private strokes!: () => readonly Stroke[];
  private raftTops: RaftTop[] = [];
  private state: FigureState = { mode: 'stand' };
  private hat!: Phaser.GameObjects.Graphics;
  private hatCollected = false;

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

    drawHatOutline(this.add.graphics(), HAT_SLOT.x, HAT_SLOT.y);
    this.hat = this.add.graphics();
    drawHat(this.hat, HAT.x, HAT.y);
    this.hatCollected = false;

    this.strokes = addDrawingPad(this);
    addRestartButton(this);
  }

  update(_time: number, delta: number): void {
    this.moveFigure(delta);
    this.collectHat();
  }

  private collectHat(): void {
    if (this.hatCollected) return;
    // The middle of the hat is what the figure has to touch.
    const hatMiddle = { x: HAT.x, y: HAT.y - HAT.crownHeight / 2 };
    if (figureTouches(this.figure.feet, STICK_FIGURE.height, HAT.reach, hatMiddle)) {
      this.hatCollected = true;
      // The hat is drawn at its starting spot, so moving the whole
      // drawing by the difference puts it right on top of the picture.
      this.tweens.add({
        targets: this.hat,
        x: HAT_SLOT.x - HAT.x,
        y: HAT_SLOT.y - HAT.y,
        duration: HAT_SLOT.flyTime,
        ease: 'Quad.easeInOut',
      });
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
