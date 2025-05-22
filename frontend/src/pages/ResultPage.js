import './ResultPage.css'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { FaTrophy, FaMedal, FaRedo, FaHome, FaCrown } from "react-icons/fa";

function ResultPage() {
    const score = sessionStorage.getItem("score")
    const username = sessionStorage.getItem("username")
    const isAuthorised = sessionStorage.getItem("isAuthorised")==="true";
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5001/api/Quiz')
            .then(res => res.json())
            .then(data => {
                // Sort by score descending, then by date ascending
                const sortedData = data.data.sort((a, b) => {
                    if (b.score !== a.score) {
                        return b.score - a.score;
                    }
                    return new Date(a.createdAt) - new Date(b.createdAt);
                });
                setData(sortedData);
                setIsLoading(false);
            })
            .catch(error => {
                console.log(error);
                setIsLoading(false);
            });
    }, []);

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

    const getRankEmoji = (rank) => {
        switch(rank) {
            case 1: return "🥇";
            case 2: return "🥈";
            case 3: return "🥉";
            default: return "🎯";
        }
    };

    const getRankClass = (rank) => {
        switch(rank) {
            case 1: return "rank-1";
            case 2: return "rank-2";
            case 3: return "rank-3";
            default: return "";
        }
    };

    return (
        <div className="result-page">
            <div className="result-container">
                {/* Result Hero Section */}
                <div className="result-hero">
                    <div className="score-celebration">
                        {getScoreEmoji(parseInt(score))}
                    </div>
                    <h1 className="result-title">
                        Congratulations, <span className="result-username">{username}</span>!
                    </h1>
                    <div className="result-score">{score}</div>
                    <p className="result-description">
                        {getScoreMessage(parseInt(score))} You've completed the quiz and your score has been recorded on the leaderboard.
                    </p>
                    <div className="result-actions">
                        <button 
                            className="result-btn"
                            onClick={() => navigate("/Home")}
                        >
                            <FaRedo />
                            Try Again
                        </button>
                        <button 
                            className="result-btn result-btn-secondary"
                            onClick={() => navigate("/Home")}
                        >
                            <FaHome />
                            Back to Home
                        </button>
                    </div>
                </div>

                {/* Leaderboard Section */}
                <div className="leaderboard-section">
                    <div className="leaderboard-header">
                        <h2 className="leaderboard-title">
                            <FaTrophy />
                            Leaderboard
                        </h2>
                        <p className="leaderboard-subtitle">
                            See how you rank among all quiz takers
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="leaderboard-loading">
                            <p>Loading leaderboard...</p>
                        </div>
                    ) : (
                        <div className="leaderboard-list">
                            {data.map((item, index) => {
                                const rank = index + 1;
                                const date = new Date(item.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                });
                                const isCurrentUser = item.username === username && 
                                                    new Date(item.createdAt).toDateString() === new Date().toDateString();
                                
                                return (
                                    <div 
                                        key={index} 
                                        className={`leaderboard-item ${rank <= 3 ? 'top-three' : ''} ${isCurrentUser ? 'current-user' : ''}`}
                                    >
                                        <div className="leaderboard-medal">
                                            {getRankEmoji(rank)}
                                        </div>
                                        <div className={`leaderboard-rank ${getRankClass(rank)}`}>
                                            #{rank}
                                        </div>
                                        <div className="leaderboard-info">
                                            <div className="leaderboard-username">
                                                {item.username}
                                                {isCurrentUser && <span> (You)</span>}
                                            </div>
                                            <div className="leaderboard-date">
                                                {date}
                                            </div>
                                        </div>
                                        <div className="leaderboard-score">
                                            {item.score}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {data.length === 0 && !isLoading && (
                        <div className="leaderboard-loading">
                            <p>No scores yet. Be the first to complete the quiz!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResultPage;