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
