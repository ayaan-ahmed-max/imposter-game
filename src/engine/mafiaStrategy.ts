import type { MafiaAssignConfig, MafiaHiddenCard, Player } from './types';
import { shuffle } from './shuffle';

export function assignMafia(
  players: Player[],
  config: MafiaAssignConfig,
  rng: () => number = Math.random
): Record<string, MafiaHiddenCard> {
  if (players.length < 3) {
    throw new Error('Mafia mode requires at least 3 players');
  }
  if (config.mafiaCount < 1) {
    throw new Error('mafiaCount must be at least 1');
  }
  if (config.doctorCount < 0) {
    throw new Error('doctorCount cannot be negative');
  }
  if (config.mafiaCount + config.doctorCount >= players.length) {
    throw new Error('mafiaCount + doctorCount must leave at least 1 civilian');
  }

  const shuffled = shuffle(players, rng);
  const mafiaIds = new Set(shuffled.slice(0, config.mafiaCount).map((p) => p.id));
  const doctorIds = new Set(
    shuffled.slice(config.mafiaCount, config.mafiaCount + config.doctorCount).map((p) => p.id)
  );

  const hiddenCards: Record<string, MafiaHiddenCard> = {};
  for (const player of players) {
    const role = mafiaIds.has(player.id) ? 'mafia' : doctorIds.has(player.id) ? 'doctor' : 'civilian';
    hiddenCards[player.id] = {
      mode: 'mafia',
      role,
      display: role.charAt(0).toUpperCase() + role.slice(1),
    };
  }
  return hiddenCards;
}
