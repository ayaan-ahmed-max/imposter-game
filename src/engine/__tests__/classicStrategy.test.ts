import { assignClassic } from '../classicStrategy';
import { makeTestRng } from './testRng';
import type { ClassicPack } from '../../data/packTypes';
import type { Player } from '../types';

const pack: ClassicPack = { id: 'p', name: 'P', mode: 'classic', words: ['Pizza', 'Banana'] };

function makePlayers(n: number): Player[] {
  return Array.from({ length: n }, (_, i) => ({ id: `p${i}`, name: `Player ${i}`, seat: i }));
}

describe('assignClassic', () => {
  it('assigns exactly impostorCount impostors and the rest civilians', () => {
    const players = makePlayers(5);
    const { hiddenCards } = assignClassic(players, pack, { impostorCount: 2 }, makeTestRng(1));
    const roles = Object.values(hiddenCards).map((c) => c.role);
    expect(roles.filter((r) => r === 'impostor').length).toBe(2);
    expect(roles.filter((r) => r === 'civilian').length).toBe(3);
  });

  it('every player id appears exactly once', () => {
    const players = makePlayers(4);
    const { hiddenCards } = assignClassic(players, pack, { impostorCount: 1 }, makeTestRng(2));
    expect(Object.keys(hiddenCards).sort()).toEqual(players.map((p) => p.id).sort());
  });
});
