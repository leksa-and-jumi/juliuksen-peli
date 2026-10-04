/** The level after `current`. After the last level comes the first again. */
export function nextLevel(current: number, levelCount: number): number {
  if (!Number.isInteger(levelCount) || levelCount < 1) {
    throw new RangeError(`levelCount must be a positive integer, got ${levelCount}`);
  }
  return (current + 1) % levelCount;
}
