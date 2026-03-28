import { MatchState, createEmptyBoard, GameMode } from "../models/game";

export type MatchListener = (state: MatchState) => void;

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const calculateWinner = (board: MatchState["board"]) => {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  return board.every(Boolean) ? "draw" : null;
};

class MockNakamaService {
  private listener?: MatchListener;
  private timer?: number;
  private state?: MatchState;

  authenticate(name: string) {
    return Promise.resolve({ userId: `u_${name.toLowerCase()}` });
  }

  findMatch(mode: GameMode, playerName: string) {
    const now = Date.now();
    this.state = {
      matchId: `m_${now}`,
      board: createEmptyBoard(),
      turn: "X",
      status: "active",
      mode,
      winner: null,
      timeLeftSeconds: mode === "timed" ? 30 : 0,
      sequence: 1,
      players: [
        { id: "local", name: playerName, symbol: "X" },
        { id: "bot", name: "Bot", symbol: "O" }
      ]
    };

    this.emit();
    this.startTimer();
    return Promise.resolve(this.state);
  }

  subscribe(listener: MatchListener) {
    this.listener = listener;
    if (this.state) {
      listener(this.state);
    }
    return () => {
      this.listener = undefined;
      if (this.timer) {
        window.clearInterval(this.timer);
      }
    };
  }

  sendMove(index: number) {
    if (!this.state || this.state.status !== "active" || this.state.turn !== "X") {
      return;
    }

    if (this.state.board[index]) return;

    this.state.board[index] = "X";
    this.state.sequence += 1;
    const winner = calculateWinner(this.state.board);
    if (winner) {
      this.state.winner = winner;
      this.state.status = "finished";
      this.emit();
      return;
    }

    this.state.turn = "O";
    this.state.timeLeftSeconds = this.state.mode === "timed" ? 30 : 0;
    this.emit();

    window.setTimeout(() => {
      if (!this.state || this.state.status !== "active") return;
      const emptyIndices = this.state.board
        .map((cell, i) => (cell ? null : i))
        .filter((i): i is number => i !== null);
      const choice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      if (choice === undefined) return;

      this.state.board[choice] = "O";
      this.state.sequence += 1;
      const nextWinner = calculateWinner(this.state.board);
      if (nextWinner) {
        this.state.winner = nextWinner;
        this.state.status = "finished";
      } else {
        this.state.turn = "X";
        this.state.timeLeftSeconds = this.state.mode === "timed" ? 30 : 0;
      }
      this.emit();
    }, 500);
  }

  reset() {
    if (!this.state) return;
    const mode = this.state.mode;
    const name = this.state.players[0]?.name ?? "Player";
    void this.findMatch(mode, name);
  }

  private startTimer() {
    if (this.timer) {
      window.clearInterval(this.timer);
    }
    if (!this.state || this.state.mode !== "timed") {
      return;
    }

    this.timer = window.setInterval(() => {
      if (!this.state || this.state.status !== "active" || this.state.mode !== "timed") {
        return;
      }

      this.state.timeLeftSeconds -= 1;
      if (this.state.timeLeftSeconds <= 0) {
        this.state.winner = this.state.turn === "X" ? "O" : "X";
        this.state.status = "finished";
      }
      this.state.sequence += 1;
      this.emit();
    }, 1000);
  }

  private emit() {
    if (this.listener && this.state) {
      this.listener({ ...this.state, board: [...this.state.board], players: [...this.state.players] });
    }
  }
}

export const mockNakamaService = new MockNakamaService();
