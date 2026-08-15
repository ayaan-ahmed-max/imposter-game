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

  it('throws on an unknown mode value', () => {
    const bad = {
      version: 1,
      language: 'en',
      packs: [{ id: 'x', name: 'X', mode: 'weird', words: ['a'] }],
    };
    expect(() => validatePacksFile(bad)).toThrow(/mode/i);
  });

  it('throws on duplicate pack ids', () => {
    const bad = {
      version: 1,
      language: 'en',
      packs: [
        { id: 'dup', name: 'A', mode: 'classic', words: ['a'] },
        { id: 'dup', name: 'B', mode: 'classic', words: ['b'] },
      ],
    };
    expect(() => validatePacksFile(bad)).toThrow(/duplicate/i);
  });

  it('accepts a well-formed minimal file', () => {
    const good = {
      version: 1,
      language: 'en',
      packs: [{ id: 'ok', name: 'OK', mode: 'classic', words: ['a', 'b'] }],
    };
    expect(() => validatePacksFile(good)).not.toThrow();
  });
});
