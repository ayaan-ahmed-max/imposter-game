import { loadPacks, getAllPacks, getPacksByMode, getPackById } from '../loadPacks';

describe('loadPacks', () => {
  it('loads the bundled packs.json without throwing', () => {
    expect(() => loadPacks()).not.toThrow();
  });

  it('returns version, language, and a non-empty packs array', () => {
    const file = loadPacks();
    expect(typeof file.version).toBe('number');
    expect(typeof file.language).toBe('string');
    expect(file.packs.length).toBeGreaterThan(0);
  });

  it('has no duplicate pack ids', () => {
    const ids = getAllPacks().map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
