import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Quiz from "./components/Quiz";
import Leaderboard from "./components/Leaderboard";

export default function App() {
  const [page, setPage] = useState("login");
  const [finalScore, setFinalScore] = useState(null);

  const handleFinish = (score) => {
    setFinalScore(score);
    setPage("leaderboard");
  };

  return (
    <div>
      <h1>Quiz App</h1>
      {page === "login" && <Login onLogin={() => setPage("quiz")} onSwitch={() => setPage("register")} />}
      {page === "register" && <Register onSwitch={() => setPage("login")} />}
      {page === "quiz" && <Quiz onFinish={handleFinish} />}
      {page === "leaderboard" && (
        <>
          <p>Your Final Score: {finalScore}</p>
          <Leaderboard />
          <button onClick={() => setPage("quiz")}>Retry</button>
        </>
      )}
    </div>
  );
}
