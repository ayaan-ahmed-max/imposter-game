export type PackMode = 'classic' | 'question';

export interface ClassicPack {
  id: string;
  name: string;
  mode: 'classic';
  words: string[];
}

export interface QuestionPair {
  real: string;
  decoy: string;
}

export interface QuestionPack {
  id: string;
  name: string;
  mode: 'question';
  pairs: QuestionPair[];
}

export type Pack = ClassicPack | QuestionPack;

export interface PacksFile {
  version: number;
  language: string;
  packs: Pack[];
}
