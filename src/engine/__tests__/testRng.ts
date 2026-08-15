// Deterministic RNG for tests: a simple LCG seeded per-call so the same
// seed always produces the same sequence, letting tests assert exact
// outcomes instead of just "it didn't crash".
export function makeTestRng(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}
