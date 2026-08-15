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

  it('all civilians share the selected word; all impostors see literal "Impostor"', () => {
    const players = makePlayers(6);
    const { selectedWord, hiddenCards } = assignClassic(
      players,
      pack,
      { impostorCount: 2 },
      makeTestRng(3)
    );
    for (const card of Object.values(hiddenCards)) {
      if (card.role === 'civilian') expect(card.display).toBe(selectedWord);
      else expect(card.display).toBe('Impostor');
    }
  });

  it('is deterministic for a fixed rng seed', () => {
    const players = makePlayers(5);
    const a = assignClassic(players, pack, { impostorCount: 2 }, makeTestRng(42));
    const b = assignClassic(players, pack, { impostorCount: 2 }, makeTestRng(42));
    expect(a).toEqual(b);
  });

  it('throws when fewer than 3 players', () => {
    expect(() =>
      assignClassic(makePlayers(2), pack, { impostorCount: 1 }, makeTestRng(1))
    ).toThrow(/3 players/);
  });

  it('throws when impostorCount is out of bounds', () => {
    const players = makePlayers(4);
    expect(() => assignClassic(players, pack, { impostorCount: 0 }, makeTestRng(1))).toThrow();
    expect(() => assignClassic(players, pack, { impostorCount: 4 }, makeTestRng(1))).toThrow();
  });
});
