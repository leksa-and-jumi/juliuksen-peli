export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Splits the raft into planks lying side by side.
 * Returns each plank as a rectangle (top-left corner + size).
 */
export function raftPlanks(
  gameWidth: number,
  gameHeight: number,
  raft: { width: number; height: number; bottomMargin: number; plankCount: number },
): Rect[] {
  if (!Number.isInteger(raft.plankCount) || raft.plankCount < 1) {
    throw new RangeError(`plankCount must be a positive integer, got ${raft.plankCount}`);
  }
  const left = (gameWidth - raft.width) / 2;
  const top = gameHeight - raft.bottomMargin - raft.height;
  const plankWidth = raft.width / raft.plankCount;
  return Array.from({ length: raft.plankCount }, (_, i) => ({
    x: left + i * plankWidth,
    y: top,
    width: plankWidth,
    height: raft.height,
  }));
}
