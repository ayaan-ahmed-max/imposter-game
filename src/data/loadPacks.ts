import rawPacks from './packs.json';
import type { Pack, PacksFile, PackMode } from './packTypes';
import { validatePacksFile } from './validatePacks';

let cached: PacksFile | null = null;

/** Validates (once, cached) and returns the full packs file. Throws on a bad load. */
export function loadPacks(): PacksFile {
  if (!cached) {
    cached = validatePacksFile(rawPacks);
  }
  return cached;
}

export function getAllPacks(): Pack[] {
  return loadPacks().packs;
}

/** Mode-narrowed filter: getPacksByMode('classic') returns ClassicPack[]. */
export function getPacksByMode<M extends PackMode>(
  mode: M
): Extract<Pack, { mode: M }>[] {
  return getAllPacks().filter((p): p is Extract<Pack, { mode: M }> => p.mode === mode);
}

export function getPackById(id: string): Pack | undefined {
  return getAllPacks().find((p) => p.id === id);
}
