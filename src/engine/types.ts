import type { ClassicPack, QuestionPack, QuestionPair } from '../data/packTypes';

export interface Player {
  id: string;
  name: string;
  seat: number;
}

export type GameMode = 'classic' | 'question' | 'mafia';

export interface ClassicHiddenCard {
  mode: 'classic';
  role: 'civilian' | 'impostor';
  display: string;
}

export interface QuestionHiddenCard {
  mode: 'question';
  role: 'civilian' | 'impostor';
  display: string;
}

export interface MafiaHiddenCard {
  mode: 'mafia';
  role: 'mafia' | 'doctor' | 'civilian';
  display: string;
}

export type HiddenCard = ClassicHiddenCard | QuestionHiddenCard | MafiaHiddenCard;

// Store already represents "no active round" as `round: null`, so a
// separate setup phase here would be redundant. Extend later if real
// screens need finer-grained phases (revealing/discussion/voting).
export type RoundPhase = 'dealt' | 'complete';
