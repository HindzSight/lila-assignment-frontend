import { create } from "zustand";
import { MatchState, GameMode, createEmptyBoard } from "../models/game";
import { mockNakamaService } from "../services/mockNakamaService";

interface GameStore {
  mode: GameMode;
  match: MatchState | null;
  searching: boolean;
  setMode: (mode: GameMode) => void;
  startSearch: (playerName: string) => Promise<void>;
  sendMove: (index: number) => void;
  reset: () => void;
}

let unsubscribeMatch: (() => void) | null = null;

export const useGameStore = create<GameStore>((set, get) => ({
  mode: "classic",
  match: {
    matchId: "",
    board: createEmptyBoard(),
    turn: "X",
    status: "idle",
    mode: "classic",
    winner: null,
    timeLeftSeconds: 0,
    sequence: 0,
    players: []
  },
  searching: false,
  setMode: (mode) => set({ mode }),
  startSearch: async (playerName) => {
    set({ searching: true });
    const mode = get().mode;

    if (unsubscribeMatch) {
      unsubscribeMatch();
    }
    unsubscribeMatch = mockNakamaService.subscribe((nextState) => {
      set({ match: nextState, searching: false });
    });

    await mockNakamaService.findMatch(mode, playerName);
  },
  sendMove: (index) => {
    mockNakamaService.sendMove(index);
  },
  reset: () => {
    mockNakamaService.reset();
  }
}));
