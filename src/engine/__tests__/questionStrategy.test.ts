import { assignQuestion } from '../questionStrategy';
import { makeTestRng } from '../testRng';
import type { QuestionPack } from '../../data/packTypes';
import type { Player } from '../types';

const pack: QuestionPack = {
  id: 'p',
  name: 'P',
  mode: 'question',
  pairs: [
    { real: 'Best film?', decoy: 'Name a film.' },
    { real: 'Best song?', decoy: 'Name a song.' },
  ],
};

function makePlayers(n: number): Player[] {
  return Array.from({ length: n }, (_, i) => ({ id: `p${i}`, name: `Player ${i}`, seat: i }));
}

describe('assignQuestion', () => {
  it('assigns exactly impostorCount impostors and the rest civilians', () => {
    const players = makePlayers(5);
    const { hiddenCards } = assignQuestion(players, pack, { impostorCount: 2 }, makeTestRng(1));
    const roles = Object.values(hiddenCards).map((c) => c.role);
    expect(roles.filter((r) => r === 'impostor').length).toBe(2);
    expect(roles.filter((r) => r === 'civilian').length).toBe(3);
  });

  it('civilians get selectedPair.real, impostors get selectedPair.decoy', () => {
    const players = makePlayers(6);
    const { selectedPair, hiddenCards } = assignQuestion(
      players,
      pack,
      { impostorCount: 2 },
      makeTestRng(3)
    );
    for (const card of Object.values(hiddenCards)) {
      if (card.role === 'civilian') expect(card.display).toBe(selectedPair.real);
      else expect(card.display).toBe(selectedPair.decoy);
    }
  });

  it('throws when fewer than 3 players', () => {
    expect(() =>
      assignQuestion(makePlayers(2), pack, { impostorCount: 1 }, makeTestRng(1))
    ).toThrow(/3 players/);
  });

  it('throws when impostorCount is out of bounds', () => {
    const players = makePlayers(4);
    expect(() => assignQuestion(players, pack, { impostorCount: 0 }, makeTestRng(1))).toThrow();
    expect(() => assignQuestion(players, pack, { impostorCount: 4 }, makeTestRng(1))).toThrow();
  });
});
