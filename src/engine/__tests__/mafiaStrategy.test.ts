import { assignMafia } from '../mafiaStrategy';
import { makeTestRng } from '../testRng';
import type { Player } from '../types';

function makePlayers(n: number): Player[] {
  return Array.from({ length: n }, (_, i) => ({ id: `p${i}`, name: `Player ${i}`, seat: i }));
}

describe('assignMafia', () => {
  it('assigns exactly mafiaCount mafia, doctorCount doctors, remainder civilian', () => {
    const players = makePlayers(6);
    const hiddenCards = assignMafia(players, { mafiaCount: 2, doctorCount: 1 }, makeTestRng(1));
    const roles = Object.values(hiddenCards).map((c) => c.role);
    expect(roles.filter((r) => r === 'mafia').length).toBe(2);
    expect(roles.filter((r) => r === 'doctor').length).toBe(1);
    expect(roles.filter((r) => r === 'civilian').length).toBe(3);
  });

  it('every player id appears exactly once', () => {
    const players = makePlayers(5);
    const hiddenCards = assignMafia(players, { mafiaCount: 1, doctorCount: 1 }, makeTestRng(2));
    expect(Object.keys(hiddenCards).sort()).toEqual(players.map((p) => p.id).sort());
  });

  it('allows doctorCount of 0', () => {
    const players = makePlayers(4);
    const hiddenCards = assignMafia(players, { mafiaCount: 1, doctorCount: 0 }, makeTestRng(1));
    expect(Object.values(hiddenCards).filter((c) => c.role === 'doctor').length).toBe(0);
  });

  it('throws when fewer than 3 players', () => {
    expect(() =>
      assignMafia(makePlayers(2), { mafiaCount: 1, doctorCount: 0 }, makeTestRng(1))
    ).toThrow(/3 players/);
  });

  it('throws when mafiaCount + doctorCount leaves no civilians', () => {
    const players = makePlayers(4);
    expect(() =>
      assignMafia(players, { mafiaCount: 2, doctorCount: 2 }, makeTestRng(1))
    ).toThrow();
  });

  it('throws on negative doctorCount', () => {
    const players = makePlayers(4);
    expect(() =>
      assignMafia(players, { mafiaCount: 1, doctorCount: -1 }, makeTestRng(1))
    ).toThrow();
  });
});
