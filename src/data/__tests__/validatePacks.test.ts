import { validatePacksFile } from '../validatePacks';

describe('validatePacksFile', () => {
  it('throws when a classic pack is missing words', () => {
    const bad = {
      version: 1,
      language: 'en',
      packs: [{ id: 'x', name: 'X', mode: 'classic' }],
    };
    expect(() => validatePacksFile(bad)).toThrow(/words/i);
  });

  it("throws when a question pack's pairs are missing real/decoy", () => {
    const bad = {
      version: 1,
      language: 'en',
      packs: [{ id: 'x', name: 'X', mode: 'question', pairs: [{ real: 'only real' }] }],
    };
    expect(() => validatePacksFile(bad)).toThrow();
  });
});
