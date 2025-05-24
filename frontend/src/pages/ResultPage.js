import './ResultPage.css'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { FaTrophy, FaRedo, FaHome } from "react-icons/fa";

function ResultPage() {
    const score = sessionStorage.getItem("score")
    const username = sessionStorage.getItem("username")
    const quizId = sessionStorage.getItem("quizId");
    const isAuthorised = sessionStorage.getItem("isAuthorised") === "true";
    const [quizData, setQuizData] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch specific quiz by ID
        if (quizId) {
            fetch(`http://localhost:5001/api/Quiz/${quizId}`)
                .then(res => res.json())
                .then(result => {
                    setQuizData(result.data);
                })
                .catch(error => console.log(error));
        }

        // Fetch leaderboard
        fetch('http://localhost:5001/api/Quiz')
            .then(res => res.json())
            .then(data => {
                const sortedData = data.data.sort((a, b) => {
                    if (b.score !== a.score) {
                        return b.score - a.score;
                    }
                    return new Date(a.createdAt) - new Date(b.createdAt);
                });
                setLeaderboard(sortedData);
                setIsLoading(false);
            })
            .catch(error => {
                console.log(error);
                setIsLoading(false);
            });
    }, [quizId]);

    if (!isAuthorised) {
        return (
            <div className="result-page">
                <div className="result-container">
                    <div className="unauthorized-result">
                        <h2>🚫 Access Denied</h2>
                        <p>You need to be logged in to view quiz results.</p>
                        <button 
                            className="unauthorized-btn"
                            onClick={() => navigate("/signup")}
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const getScoreEmoji = (score) => {
        if (score >= 90) return "🏆";
        if (score >= 80) return "🥇";
        if (score >= 70) return "🥈";
        if (score >= 60) return "🥉";
        return "🎯";
    };

    const getScoreMessage = (score) => {
        if (score >= 90) return "Outstanding Performance!";
        if (score >= 80) return "Excellent Work!";
        if (score >= 70) return "Great Job!";
        if (score >= 60) return "Good Effort!";
        return "Keep Practicing!";
    };

    return (
        <div className="result-page">
            <div className="result-container">
                <div className="result-hero">
                    <div className="score-celebration">{getScoreEmoji(score)}</div>
                    <h1 className="result-title">Well Done, <span className="result-username">{username}</span>!</h1>
                    <div className="result-score">{parseInt(score)} pts</div>
                    <p className="result-description">{getScoreMessage(score)}</p>
                    <div className="result-actions">
                        <button className="result-btn" onClick={() => navigate("/Quiz")}> <FaRedo /> Try Again </button>
                        <button className="result-btn result-btn-secondary" onClick={() => navigate("/Home")}> <FaHome /> Home </button>
                    </div>
                </div>

                <div className="result-questions">
                    <h2 style={{ textAlign: 'center', margin: '2rem 0', color: '#fff' }}>📋 Answer Summary</h2>
                    {quizData ? (
                        quizData.questions && quizData.questions.length > 0 ? (
                            quizData.questions.map((question, index) => (
                                <div key={index} style={{
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    padding: '1rem 1.5rem',
                                    marginBottom: '1rem',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                    <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>
                                        {index + 1}. {question.questionText}
                                    </h4>
                                    <p>
                                        <strong>Your Answer:</strong>{" "}
                                        <span style={{ color: question.isCorrect ? 'green' : 'red' }}>
                                            {question.selectedAnswer}
                                        </span>
                                    </p>
                                    {!question.isCorrect && (
                                        <p><strong>Correct Answer:</strong> {question.correctAnswer}</p>
                                    )}
                                    <p><strong>Time Taken:</strong> {question.timeTaken.toFixed(1)}s</p>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: 'white' }}>❗ No questions recorded for your quiz.</p>
                        )
                    ) : (
                        <p style={{ textAlign: 'center', color: 'white' }}>❗ Quiz data not found.</p>
                    )}
                </div>

                <div className="leaderboard-section">
                    <div className="leaderboard-header">
                        <h2 className="leaderboard-title"><FaTrophy /> Leaderboard</h2>
                        <p className="leaderboard-subtitle">Top Scorers</p>
                    </div>
                    {isLoading ? (
                        <div className="leaderboard-loading">Loading leaderboard...</div>
                    ) : (
                        <div className="leaderboard-list">
                            {leaderboard.map((user, index) => (
                                <div
                                    key={user._id}
                                    className={`leaderboard-item ${index < 3 ? "top-three" : ""} ${user.username === username ? "current-user" : ""}`}
                                >
                                    <div className={`leaderboard-rank rank-${index + 1}`}>{index + 1}</div>
                                    <div className="leaderboard-info">
                                        <div className="leaderboard-username">{user.username}</div>
                                        <div className="leaderboard-date">{new Date(user.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="leaderboard-score">{user.score.toFixed(0)}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResultPage;