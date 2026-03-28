import { create } from "zustand";
import { mockNakamaService } from "../services/mockNakamaService";

interface AuthState {
  playerName: string;
  userId: string | null;
  setPlayerName: (name: string) => void;
  login: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  playerName: "",
  userId: null,
  setPlayerName: (name) => set({ playerName: name }),
  login: async () => {
    const { playerName } = get();
    const trimmedName = playerName.trim() || "Player";
    const result = await mockNakamaService.authenticate(trimmedName);
    set({ userId: result.userId, playerName: trimmedName });
  }
}));
