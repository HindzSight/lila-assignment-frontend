import { useNavigate } from "react-router-dom";
import { useGameStore } from "../state/useGameStore";

export const ResultScreen = () => {
  const navigate = useNavigate();
  const match = useGameStore((state) => state.match);
  const reset = useGameStore((state) => state.reset);

  if (!match) {
    navigate("/");
    return null;
  }

  const winnerLabel =
    match.winner === "draw"
      ? "Draw"
      : match.winner === "X"
      ? `${match.players.find((player) => player.symbol === "X")?.name ?? "You"} won`
      : `${match.players.find((player) => player.symbol === "O")?.name ?? "Opponent"} won`;

  return (
    <section className="card">
      <h2>Match Result</h2>
      <p className="winner">{winnerLabel}</p>
      <div className="row">
        <button onClick={() => { reset(); navigate("/game"); }}>Play Again</button>
        <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
      </div>
    </section>
  );
};
