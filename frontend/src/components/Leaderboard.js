import { useEffect, useState } from "react";
import API from "../api";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get("/quiz/leaderboard");
      setLeaders(res.data);
    };
    fetch();
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <ol>
        {leaders.map((u, i) => (
          <li key={i}>{u.username} - {u.bestScore}</li>
        ))}
      </ol>
    </div>
  );
}
