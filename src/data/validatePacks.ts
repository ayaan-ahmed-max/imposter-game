import type { Pack, PacksFile, ClassicPack, QuestionPack } from './packTypes';

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.length > 0;
}

export function isClassicPack(p: any): p is ClassicPack {
  return (
    p?.mode === 'classic' &&
    isNonEmptyString(p.id) &&
    isNonEmptyString(p.name) &&
    Array.isArray(p.words) &&
    p.words.length > 0 &&
    p.words.every(isNonEmptyString)
  );
}

export function isQuestionPack(p: any): p is QuestionPack {
  return (
    p?.mode === 'question' &&
    isNonEmptyString(p.id) &&
    isNonEmptyString(p.name) &&
    Array.isArray(p.pairs) &&
    p.pairs.length > 0 &&
    p.pairs.every(
      (pair: any) => isNonEmptyString(pair?.real) && isNonEmptyString(pair?.decoy)
    )
  );
}

export function isValidPack(p: any): p is Pack {
  if (p?.mode === 'classic') return isClassicPack(p);
  if (p?.mode === 'question') return isQuestionPack(p);
  return false;
}

/**
 * Validates the whole packs file shape, collecting every error in one pass
 * (not just the first) so a bad packs.json edit surfaces everything at once.
 */
export function validatePacksFile(raw: unknown): PacksFile {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('packs.json: root is not an object');
  }
  const file = raw as any;
  const errors: string[] = [];

  if (typeof file.version !== 'number') errors.push('version must be a number');
  if (typeof file.language !== 'string') errors.push('language must be a string');
  if (!Array.isArray(file.packs)) errors.push('packs must be an array');

  const seenIds = new Set<string>();
  if (Array.isArray(file.packs)) {
    file.packs.forEach((p: any, i: number) => {
      const label = p?.id ?? `index ${i}`;
      if (!isNonEmptyString(p?.mode) || (p.mode !== 'classic' && p.mode !== 'question')) {
        errors.push(`pack "${label}": mode must be "classic" or "question"`);
        return;
      }
      if (!isValidPack(p)) {
        errors.push(`pack "${label}": does not match required shape for mode "${p.mode}"`);
        return;
      }
      if (seenIds.has(p.id)) errors.push(`pack "${label}": duplicate id`);
      seenIds.add(p.id);
    });
  }

  if (errors.length > 0) {
    throw new Error(`Invalid packs.json:\n- ${errors.join('\n- ')}`);
  }

  return file as PacksFile;
}
