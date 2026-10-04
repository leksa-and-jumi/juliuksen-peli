/** The level after `current`. After the last level comes the first again. */
export function nextLevel(current: number, levelCount: number): number {
  if (!Number.isInteger(levelCount) || levelCount < 1) {
    throw new RangeError(`levelCount must be a positive integer, got ${levelCount}`);
  }
  return (current + 1) % levelCount;
}

/**
 * Reads a starting level from the page address, like `?level=3`
 * (levels are counted from 1 there). Returns a level index, or 0.
 */
export function levelFromQuery(search: string, levelCount: number): number {
  const asked = Number(new URLSearchParams(search).get('level'));
  if (!Number.isInteger(asked) || asked < 1 || asked > levelCount) return 0;
  return asked - 1;
}
