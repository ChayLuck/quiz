import { useEffect, useState } from "react";
import API from "../api";

export default function Quiz({ onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await API.get("/quiz/start");
      setQuestions(res.data);
    };
    fetchQuiz();
  }, []);

  const answer = async (option) => {
    const res = await API.post("/quiz/answer", { index: current, answer: option });
    setScore(prev => prev + res.data.score);
    if (current < 9) setCurrent(current + 1);
    else onFinish(score + res.data.score);
  };

  if (questions.length === 0) return <div>Loading...</div>;

  const q = questions[current];

  return (
    <div>
      <h3>Question {current + 1}</h3>
      <p>{q.question}</p>
      {q.options.map((opt, i) => (
        <button key={i} onClick={() => answer(opt)}>{opt}</button>
      ))}
    </div>
  );
}
