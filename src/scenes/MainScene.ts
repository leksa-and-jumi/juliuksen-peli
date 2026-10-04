import Phaser from 'phaser';
import {
  CLIMB,
  FRIEND,
  GAME_HEIGHT,
  GAME_WIDTH,
  ITEM,
  ITEMS,
  ITEM_SLOT,
  RAFT,
  STICK_FIGURE,
} from '../config';
import { LEVEL_KEY, LEVELS, type Level } from '../levels';
import { figureTouches } from '../logic/collect';
import {
  findRope,
  landingSpot,
  pointAlongPath,
  raftMiddle,
  standsOn,
  type RaftTop,
} from '../logic/climb';
import { itemHeight } from '../logic/items';
import { nextLevel } from '../logic/levels';
import { raftTopCenter } from '../logic/raft';
import { stickFigureShape, type Point } from '../logic/stickFigure';
import type { Stroke } from '../logic/strokes';
import { addDrawingPad } from '../objects/DrawingPad';
import { addContinueButton } from '../objects/ContinueButton';
import { Fireworks } from '../objects/Fireworks';
import { drawItem, drawItemOutline } from '../objects/Item';
import { addRaft } from '../objects/Raft';
import { addRestartButton } from '../objects/RestartButton';
import { StickFigure } from '../objects/StickFigure';

type ItemState = 'floating' | 'collected' | 'given';

type FigureState = { mode: 'stand' } | { mode: 'climb'; path: Point[]; distance: number };

/**
 * The game screen. Draw a rope that touches the stick figure and
 * goes up: the figure climbs it, and steps onto a raft at the top.
 * A thing (a hat, a crown... a new one on every level) floats along
 * the way: touch it and it flies into the colorless picture at the
 * top. Bring it to the friend on the upper raft, and the friend puts
 * it on. Then: fireworks, and a continue button to the next level.
 */
export class MainScene extends Phaser.Scene {
  private level!: Level;
  private figure!: StickFigure;
  private strokes!: () => readonly Stroke[];
  private raftTops: RaftTop[] = [];
  private state: FigureState = { mode: 'stand' };
  private item!: Phaser.GameObjects.Graphics;
  private itemState: ItemState = 'floating';
  private friendHeadSpot: Point = { x: 0, y: 0 };
  private fireworks!: Fireworks;

  constructor() {
    super('MainScene');
  }

  create(): void {
    const levelIndex = (this.registry.get(LEVEL_KEY) as number | undefined) ?? 0;
    const level = LEVELS[levelIndex] ?? LEVELS[0];
    if (!level) throw new Error('The game needs at least one level');
    this.level = level;
    const { rafts } = this.level;

    this.raftTops = rafts.map((place) => {
      addRaft(this, place);
      const top = raftTopCenter(GAME_WIDTH, GAME_HEIGHT, { ...RAFT, ...place });
      return { left: top.x - RAFT.width / 2, right: top.x + RAFT.width / 2, y: top.y };
    });

    const start = this.raftTops[this.level.startRaft];
    const friendRaft = this.raftTops[this.level.friendRaft];
    if (!start || !friendRaft) throw new Error('A level points to a raft that does not exist');

    this.figure = new StickFigure(this, raftMiddle(start));
    this.state = { mode: 'stand' };

    const friendMiddle = raftMiddle(friendRaft);
    const friendFeet = { x: friendMiddle.x + this.level.friendOffsetX, y: friendMiddle.y };
    new StickFigure(this, friendFeet);
    // The thing sits a little below the top of the friend's head.
    const { head } = stickFigureShape(friendFeet, STICK_FIGURE.height, STICK_FIGURE.headRadius);
    this.friendHeadSpot = { x: head.x, y: head.y - head.radius / 2 };

    const { kind, x, y } = this.level.item;
    drawItemOutline(this.add.graphics(), kind, ITEM_SLOT.x, ITEM_SLOT.y);
    this.item = this.add.graphics();
    drawItem(this.item, kind, x, y);
    this.itemState = 'floating';

    this.strokes = addDrawingPad(this);
    this.fireworks = new Fireworks(this);
    addRestartButton(this, () => {
      // Start the whole game over, from the first level.
      this.registry.set(LEVEL_KEY, 0);
      this.scene.restart();
    });
  }

  update(_time: number, delta: number): void {
    this.moveFigure(delta);
    this.collectItem();
    this.giveItem();
    this.fireworks.update(delta);
  }

  private giveItem(): void {
    if (this.itemState !== 'collected' || this.state.mode !== 'stand') return;
    const friendRaft = this.raftTops[this.level.friendRaft];
    if (!friendRaft || !standsOn(this.figure.feet, friendRaft)) return;
    this.itemState = 'given';
    // The round is done when the thing lands on the friend's head.
    this.flyItemTo(this.friendHeadSpot, FRIEND.giveTime, () =>
      this.fireworks.start(() => addContinueButton(this, () => this.goToNextLevel())),
    );
  }

  private goToNextLevel(): void {
    const current = (this.registry.get(LEVEL_KEY) as number | undefined) ?? 0;
    this.registry.set(LEVEL_KEY, nextLevel(current, LEVELS.length));
    this.scene.restart();
  }

  /** The thing is drawn at its starting spot, so it moves by the difference. */
  private flyItemTo(spot: Point, duration: number, onArrive?: () => void): void {
    this.tweens.add({
      targets: this.item,
      x: spot.x - this.level.item.x,
      y: spot.y - this.level.item.y,
      duration,
      ease: 'Quad.easeInOut',
      onComplete: onArrive,
    });
  }

  private collectItem(): void {
    if (this.itemState !== 'floating') return;
    // The middle of the thing is what the figure has to touch.
    const { kind, x, y } = this.level.item;
    const middle = { x, y: y - itemHeight(kind, ITEMS) / 2 };
    if (figureTouches(this.figure.feet, STICK_FIGURE.height, ITEM.reach, middle)) {
      this.itemState = 'collected';
      this.flyItemTo(ITEM_SLOT, ITEM_SLOT.flyTime);
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
