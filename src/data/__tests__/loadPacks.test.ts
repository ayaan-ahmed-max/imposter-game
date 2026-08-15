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

describe('getPacksByMode', () => {
  it('returns only classic packs, each with a non-empty words array', () => {
    const classic = getPacksByMode('classic');
    expect(classic.length).toBeGreaterThan(0);
    for (const pack of classic) {
      expect(pack.mode).toBe('classic');
      expect(pack.words.length).toBeGreaterThan(0);
    }
  });

  it('returns only question packs, each with non-empty real/decoy pairs', () => {
    const question = getPacksByMode('question');
    expect(question.length).toBeGreaterThan(0);
    for (const pack of question) {
      expect(pack.mode).toBe('question');
      expect(pack.pairs.length).toBeGreaterThan(0);
      for (const pair of pack.pairs) {
        expect(typeof pair.real).toBe('string');
        expect(typeof pair.decoy).toBe('string');
      }
    }
  });
});

describe('getPackById', () => {
  it('returns the matching pack for a known id', () => {
    const pack = getPackById('classic-food');
    expect(pack?.mode).toBe('classic');
  });

  it('returns undefined for an unknown id', () => {
    expect(getPackById('does-not-exist')).toBeUndefined();
  });
});
