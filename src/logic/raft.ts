export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Splits the raft into planks lying side by side.
 * The raft sits `offsetX` pixels from the middle (negative = left).
 * Returns each plank as a rectangle (top-left corner + size).
 */
export function raftPlanks(
  gameWidth: number,
  gameHeight: number,
  raft: {
    width: number;
    height: number;
    bottomMargin: number;
    offsetX: number;
    plankCount: number;
  },
): Rect[] {
  if (!Number.isInteger(raft.plankCount) || raft.plankCount < 1) {
    throw new RangeError(`plankCount must be a positive integer, got ${raft.plankCount}`);
  }
  const left = (gameWidth - raft.width) / 2 + raft.offsetX;
  const top = gameHeight - raft.bottomMargin - raft.height;
  const plankWidth = raft.width / raft.plankCount;
  return Array.from({ length: raft.plankCount }, (_, i) => ({
    x: left + i * plankWidth,
    y: top,
    width: plankWidth,
    height: raft.height,
  }));
}

/** The middle point of the raft's top edge, where things can stand. */
export function raftTopCenter(
  gameWidth: number,
  gameHeight: number,
  raft: { height: number; bottomMargin: number; offsetX: number },
): { x: number; y: number } {
  return {
    x: gameWidth / 2 + raft.offsetX,
    y: gameHeight - raft.bottomMargin - raft.height,
  };
}
