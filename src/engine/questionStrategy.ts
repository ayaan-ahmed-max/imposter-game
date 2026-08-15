import type { QuestionPack, QuestionPair } from '../data/packTypes';
import type { QuestionAssignConfig, QuestionHiddenCard, Player } from './types';
import { shuffle } from './shuffle';

export interface AssignQuestionResult {
  selectedPair: QuestionPair;
  hiddenCards: Record<string, QuestionHiddenCard>;
}

export function assignQuestion(
  players: Player[],
  pack: QuestionPack,
  config: QuestionAssignConfig,
  rng: () => number = Math.random
): AssignQuestionResult {
  if (players.length < 3) {
    throw new Error('Question mode requires at least 3 players');
  }
  if (config.impostorCount < 1 || config.impostorCount >= players.length) {
    throw new Error('impostorCount must be between 1 and players.length - 1');
  }
  if (pack.pairs.length === 0) {
    throw new Error('Pack has no pairs to select from');
  }

  const selectedPair = pack.pairs[Math.floor(rng() * pack.pairs.length)];
  const shuffled = shuffle(players, rng);
  const impostorIds = new Set(shuffled.slice(0, config.impostorCount).map((p) => p.id));

  const hiddenCards: Record<string, QuestionHiddenCard> = {};
  for (const player of players) {
    const isImpostor = impostorIds.has(player.id);
    hiddenCards[player.id] = {
      mode: 'question',
      role: isImpostor ? 'impostor' : 'civilian',
      display: isImpostor ? selectedPair.decoy : selectedPair.real,
    };
  }
  return { selectedPair, hiddenCards };
}
