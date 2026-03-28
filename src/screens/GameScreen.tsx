import { useNavigate } from "react-router-dom";
import { ConnectionBadge } from "../components/ConnectionBadge";
import { GameBoard } from "../components/GameBoard";
import { MatchTimer } from "../components/MatchTimer";
import { TurnIndicator } from "../components/TurnIndicator";
import { useGameStore } from "../state/useGameStore";

export const GameScreen = () => {
  const navigate = useNavigate();
  const match = useGameStore((state) => state.match);
  const sendMove = useGameStore((state) => state.sendMove);

  if (!match) return null;

  const localPlayer = match.players.find((player) => player.symbol === "X");
  const isPlayerTurn = match.turn === "X";

  if (match.status === "finished") {
    navigate("/result");
  }

  return (
    <section className="card">
      <ConnectionBadge />
      <h2>Game Room</h2>
      <p className="meta">Match: {match.matchId || "pending"}</p>
      <p className="meta">You: {localPlayer?.name ?? "Player"} (X)</p>
      <TurnIndicator turn={match.turn} />
      <MatchTimer enabled={match.mode === "timed"} seconds={match.timeLeftSeconds} />
      <GameBoard board={match.board} disabled={!isPlayerTurn || match.status !== "active"} onMove={sendMove} />
    </section>
  );
};
