export type CellValue = "X" | "O" | null;
export type Board = CellValue[];
export type GameMode = "classic" | "timed";
export type MatchStatus = "idle" | "searching" | "active" | "finished";

export interface Player {
  id: string;
  name: string;
  symbol: "X" | "O";
}

export interface MatchState {
  matchId: string;
  board: Board;
  turn: "X" | "O";
  status: MatchStatus;
  mode: GameMode;
  winner: "X" | "O" | "draw" | null;
  timeLeftSeconds: number;
  sequence: number;
  players: Player[];
}

export const createEmptyBoard = (): Board => Array.from({ length: 9 }, () => null);
