import { createBrowserRouter } from "react-router-dom";
import { AuthScreen } from "../screens/AuthScreen";
import { MatchmakingScreen } from "../screens/MatchmakingScreen";
import { GameScreen } from "../screens/GameScreen";
import { ResultScreen } from "../screens/ResultScreen";
import { LeaderboardScreen } from "../screens/LeaderboardScreen";

export const router = createBrowserRouter([
  { path: "/", element: <AuthScreen /> },
  { path: "/matchmaking", element: <MatchmakingScreen /> },
  { path: "/game", element: <GameScreen /> },
  { path: "/result", element: <ResultScreen /> },
  { path: "/leaderboard", element: <LeaderboardScreen /> }
]);
