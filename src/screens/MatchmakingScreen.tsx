import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../state/useAuthStore";
import { useGameStore } from "../state/useGameStore";

export const MatchmakingScreen = () => {
  const navigate = useNavigate();
  const playerName = useAuthStore((state) => state.playerName);
  const mode = useGameStore((state) => state.mode);
  const setMode = useGameStore((state) => state.setMode);
  const searching = useGameStore((state) => state.searching);
  const startSearch = useGameStore((state) => state.startSearch);

  const queue = async () => {
    await startSearch(playerName || "Player");
    navigate("/game");
  };

  return (
    <section className="card">
      <h2>Matchmaking</h2>
      <p>Select a mode and find a game room.</p>
      <div className="row">
        <button className={mode === "classic" ? "active" : ""} onClick={() => setMode("classic")}>
          Classic
        </button>
        <button className={mode === "timed" ? "active" : ""} onClick={() => setMode("timed")}>
          Timed (30s)
        </button>
      </div>
      <button onClick={queue} disabled={searching}>{searching ? "Searching..." : "Find Match"}</button>
    </section>
  );
};
