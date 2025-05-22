import './HomePage.css';
import { useNavigate } from "react-router-dom";
import { FaPlay, FaTrophy, FaClock, FaUsers } from "react-icons/fa";

function MainSitePage() {
    const navigate = useNavigate();
    const username = sessionStorage.getItem("username");
    const isAuthorized = sessionStorage.getItem("isAuthorised") === "true";

    return (
        <div className="home-page">
            <div className="home-container">
                {isAuthorized ? (
                    <>
                        <div className="home-welcome">
                            <div className="welcome-pattern"></div>
                            <h1 className="welcome-title">
                                Welcome back, <span>{username}</span>!
                            </h1>
                            <p className="welcome-description">
                                Ready to challenge your knowledge? Test yourself with 10 carefully selected questions. 
                                Remember, speed matters - the faster you answer correctly, the higher your score!
                            </p>
                        </div>

                        <div className="quiz-card">
                            <FaPlay className="quiz-icon" />
                            <h2 className="quiz-title">Start Your Quiz Challenge</h2>
                            <p className="quiz-description">
                                Put your knowledge to the test with our time-based scoring system. 
                                Answer quickly and accurately to maximize your points!
                            </p>
                            <button 
                                className="quiz-btn" 
                                onClick={() => navigate("/Quiz")}
                            >
                                Start Quiz Now
                                <FaPlay />
                            </button>
                        </div>

                        <div className="home-stats">
                            <div className="stat-card">
                                <div className="stat-value">10</div>
                                <div className="stat-label">Questions</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">⚡</div>
                                <div className="stat-label">Time Matters</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">🏆</div>
                                <div className="stat-label">Compete</div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="unauthorized-message">
                        <h3>Access Restricted</h3>
                        <p>Please log in to access the quiz platform and start your learning journey.</p>
                        <button 
                            className="unauthorized-btn" 
                            onClick={() => navigate("/SignUp")}
                        >
                            Login / Sign Up
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MainSitePage;