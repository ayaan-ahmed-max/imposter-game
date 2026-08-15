import type { ClassicPack } from '../data/packTypes';
import type { ClassicAssignConfig, ClassicHiddenCard, Player } from './types';
import { shuffle } from './shuffle';

export interface AssignClassicResult {
  selectedWord: string;
  hiddenCards: Record<string, ClassicHiddenCard>;
}

export function assignClassic(
  players: Player[],
  pack: ClassicPack,
  config: ClassicAssignConfig,
  rng: () => number = Math.random
): AssignClassicResult {
  if (players.length < 3) {
    throw new Error('Classic mode requires at least 3 players');
  }
  if (config.impostorCount < 1 || config.impostorCount >= players.length) {
    throw new Error('impostorCount must be between 1 and players.length - 1');
  }
  if (pack.words.length === 0) {
    throw new Error('Pack has no words to select from');
  }

  const selectedWord = pack.words[Math.floor(rng() * pack.words.length)];
  const shuffled = shuffle(players, rng);
  const impostorIds = new Set(shuffled.slice(0, config.impostorCount).map((p) => p.id));

  const hiddenCards: Record<string, ClassicHiddenCard> = {};
  for (const player of players) {
    const isImpostor = impostorIds.has(player.id);
    hiddenCards[player.id] = {
      mode: 'classic',
      role: isImpostor ? 'impostor' : 'civilian',
      display: isImpostor ? 'Impostor' : selectedWord,
    };
  }
  return { selectedWord, hiddenCards };
}
