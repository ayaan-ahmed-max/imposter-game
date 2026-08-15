import { create } from 'zustand';
import { assignRound } from '../engine';
import type { AssignRoundParams, Round } from '../engine';

interface RoundStore {
  round: Round | null;
  startRound: (params: AssignRoundParams) => void;
  advancePhase: () => void;
  resetRound: () => void;
}

// The only file that imports zustand — src/engine stays free of React/
// Zustand imports so its strategies can be tested as plain functions.
export const useRoundStore = create<RoundStore>((set) => ({
  round: null,
  startRound: (params) => set({ round: assignRound(params) }),
  advancePhase: () =>
    set((state) =>
      state.round ? { round: { ...state.round, phase: 'complete' } } : state
    ),
  resetRound: () => set({ round: null }),
}));
