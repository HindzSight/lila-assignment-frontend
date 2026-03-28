import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../state/useAuthStore";

export const AuthScreen = () => {
  const navigate = useNavigate();
  const playerName = useAuthStore((state) => state.playerName);
  const setPlayerName = useAuthStore((state) => state.setPlayerName);
  const login = useAuthStore((state) => state.login);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await login();
    navigate("/matchmaking");
  };

  return (
    <section className="card">
      <h1>Multiplayer Tic-Tac-Toe</h1>
      <p>Enter a nickname to connect to the Nakama-compatible client flow.</p>
      <form onSubmit={submit} className="form">
        <input
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          placeholder="Nickname"
          maxLength={20}
        />
        <button type="submit">Continue</button>
      </form>
    </section>
  );
};
