import type { ClassicPack, QuestionPack } from '../data/packTypes';
import type {
  ClassicAssignConfig,
  MafiaAssignConfig,
  Player,
  QuestionAssignConfig,
  Round,
} from './types';
import { assignClassic } from './classicStrategy';
import { assignQuestion } from './questionStrategy';
import { assignMafia } from './mafiaStrategy';

export type AssignRoundParams =
  | { mode: 'classic'; players: Player[]; pack: ClassicPack; config: ClassicAssignConfig }
  | { mode: 'question'; players: Player[]; pack: QuestionPack; config: QuestionAssignConfig }
  | { mode: 'mafia'; players: Player[]; config: MafiaAssignConfig };

/** Dispatches to the mode-specific pure strategy and builds a full Round. */
export function assignRound(params: AssignRoundParams, rng: () => number = Math.random): Round {
  if (params.mode === 'classic') {
    const { selectedWord, hiddenCards } = assignClassic(params.players, params.pack, params.config, rng);
    return {
      mode: 'classic',
      players: params.players,
      phase: 'dealt',
      selectedPack: params.pack,
      selectedItem: selectedWord,
      hiddenCards,
      config: params.config,
    };
  }
  if (params.mode === 'question') {
    const { selectedPair, hiddenCards } = assignQuestion(params.players, params.pack, params.config, rng);
    return {
      mode: 'question',
      players: params.players,
      phase: 'dealt',
      selectedPack: params.pack,
      selectedItem: selectedPair,
      hiddenCards,
      config: params.config,
    };
  }
  return {
    mode: 'mafia',
    players: params.players,
    phase: 'dealt',
    selectedPack: null,
    selectedItem: null,
    hiddenCards: assignMafia(params.players, params.config, rng),
    config: params.config,
  };
}

export * from './types';
export { assignClassic } from './classicStrategy';
export { assignQuestion } from './questionStrategy';
export { assignMafia } from './mafiaStrategy';
export { shuffle } from './shuffle';
