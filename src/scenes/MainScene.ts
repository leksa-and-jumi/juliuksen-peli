import Phaser from 'phaser';
import {
  CLIMB,
  FRIEND,
  GAME_HEIGHT,
  GAME_WIDTH,
  HAT,
  HAT_SLOT,
  RAFT,
  RAFT_PLACES,
  STICK_FIGURE,
} from '../config';
import { figureTouches } from '../logic/collect';
import { findRope, landingSpot, pointAlongPath, standsOn, type RaftTop } from '../logic/climb';
import { raftTopCenter } from '../logic/raft';
import { stickFigureShape, type Point } from '../logic/stickFigure';
import type { Stroke } from '../logic/strokes';
import { addDrawingPad } from '../objects/DrawingPad';
import { drawHat, drawHatOutline } from '../objects/Hat';
import { addRaft } from '../objects/Raft';
import { addRestartButton } from '../objects/RestartButton';
import { StickFigure } from '../objects/StickFigure';

type HatState = 'floating' | 'collected' | 'given';

type FigureState = { mode: 'stand' } | { mode: 'climb'; path: Point[]; distance: number };

/**
 * The game screen. Draw a rope that touches the stick figure and
 * goes up: the figure climbs it, and steps onto a raft at the top.
 * A hat floats along the way: touch it and it flies into the
 * colorless hat picture at the top. Bring it to the friend on the
 * upper raft, and the friend puts the hat on.
 */
export class MainScene extends Phaser.Scene {
  private figure!: StickFigure;
  private strokes!: () => readonly Stroke[];
  private raftTops: RaftTop[] = [];
  private state: FigureState = { mode: 'stand' };
  private hat!: Phaser.GameObjects.Graphics;
  private hatState: HatState = 'floating';
  private friendHatSpot: Point = { x: 0, y: 0 };

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

    const friendRaft = RAFT_PLACES[FRIEND.raftIndex];
    const friendRaftTop = raftTopCenter(GAME_WIDTH, GAME_HEIGHT, { ...RAFT, ...friendRaft });
    const friendFeet = { x: friendRaftTop.x + FRIEND.offsetX, y: friendRaftTop.y };
    new StickFigure(this, friendFeet);
    // The hat's brim sits a little below the top of the friend's head.
    const { head } = stickFigureShape(friendFeet, STICK_FIGURE.height, STICK_FIGURE.headRadius);
    this.friendHatSpot = { x: head.x, y: head.y - head.radius / 2 };

    drawHatOutline(this.add.graphics(), HAT_SLOT.x, HAT_SLOT.y);
    this.hat = this.add.graphics();
    drawHat(this.hat, HAT.x, HAT.y);
    this.hatState = 'floating';

    this.strokes = addDrawingPad(this);
    addRestartButton(this);
  }

  update(_time: number, delta: number): void {
    this.moveFigure(delta);
    this.collectHat();
    this.giveHat();
  }

  private giveHat(): void {
    if (this.hatState !== 'collected' || this.state.mode !== 'stand') return;
    const friendRaft = this.raftTops[FRIEND.raftIndex];
    if (!friendRaft || !standsOn(this.figure.feet, friendRaft)) return;
    this.hatState = 'given';
    this.flyHatTo(this.friendHatSpot, FRIEND.giveTime);
  }

  /** The hat is drawn at its starting spot, so it moves by the difference. */
  private flyHatTo(spot: Point, duration: number): void {
    this.tweens.add({
      targets: this.hat,
      x: spot.x - HAT.x,
      y: spot.y - HAT.y,
      duration,
      ease: 'Quad.easeInOut',
    });
  }

  private collectHat(): void {
    if (this.hatState !== 'floating') return;
    // The middle of the hat is what the figure has to touch.
    const hatMiddle = { x: HAT.x, y: HAT.y - HAT.crownHeight / 2 };
    if (figureTouches(this.figure.feet, STICK_FIGURE.height, HAT.reach, hatMiddle)) {
      this.hatState = 'collected';
      this.flyHatTo(HAT_SLOT, HAT_SLOT.flyTime);
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
