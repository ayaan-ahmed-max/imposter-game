// Fisher-Yates. `rng` is injectable so strategy tests can pass a fixed
// generator for deterministic assertions instead of relying on Math.random.
export function shuffle<T>(items: T[], rng: () => number = Math.random): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
