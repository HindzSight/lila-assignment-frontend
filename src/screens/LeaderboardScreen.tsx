import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../state/useAuthStore";

const mockLeaders = [
  { rank: 1, name: "Bot", wins: 11, losses: 2, streak: 5 },
  { rank: 2, name: "Ace", wins: 9, losses: 4, streak: 3 },
  { rank: 3, name: "Nova", wins: 8, losses: 4, streak: 1 }
];

export const LeaderboardScreen = () => {
  const navigate = useNavigate();
  const playerName = useAuthStore((state) => state.playerName || "Player");

  return (
    <section className="card">
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>W</th>
            <th>L</th>
            <th>Streak</th>
          </tr>
        </thead>
        <tbody>
          {mockLeaders.map((leader) => (
            <tr key={leader.rank}>
              <td>{leader.rank}</td>
              <td>{leader.name}</td>
              <td>{leader.wins}</td>
              <td>{leader.losses}</td>
              <td>{leader.streak}</td>
            </tr>
          ))}
          <tr className="self-row">
            <td>-</td>
            <td>{playerName}</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
      <button onClick={() => navigate("/matchmaking")}>Back to Lobby</button>
    </section>
  );
};
