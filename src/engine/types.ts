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

export interface ClassicAssignConfig {
  impostorCount: number;
}

export interface QuestionAssignConfig {
  impostorCount: number;
}

export interface MafiaAssignConfig {
  mafiaCount: number;
  doctorCount: number;
}

interface BaseRound {
  players: Player[];
  phase: RoundPhase;
}

export interface ClassicRound extends BaseRound {
  mode: 'classic';
  selectedPack: ClassicPack;
  selectedItem: string;
  hiddenCards: Record<string, ClassicHiddenCard>;
  config: ClassicAssignConfig;
}

export interface QuestionRound extends BaseRound {
  mode: 'question';
  selectedPack: QuestionPack;
  selectedItem: QuestionPair;
  hiddenCards: Record<string, QuestionHiddenCard>;
  config: QuestionAssignConfig;
}

export interface MafiaRound extends BaseRound {
  mode: 'mafia';
  selectedPack: null;
  selectedItem: null;
  hiddenCards: Record<string, MafiaHiddenCard>;
  config: MafiaAssignConfig;
}

export type Round = ClassicRound | QuestionRound | MafiaRound;
