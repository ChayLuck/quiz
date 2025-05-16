import './GetPromoPage.css';
import { useNavigate } from "react-router-dom";
import { FaBrain, FaTrophy, FaRegClock, FaChartLine } from "react-icons/fa";

function GetPromoPage() {
    const navigate = useNavigate();

    return (
        <div className="promo-page animated">
            <div className="promo-hero">
                <h1>Boost Your Knowledge with Interactive Quizzes</h1>
                <p>Challenge yourself, learn new facts, and compete with others in our fun and engaging quiz platform</p>
            </div>

            <div className="promo-features">
                <div className="promo-feature-card animated">
                    <FaBrain className="feature-icon" />
                    <h3>Diverse Categories</h3>
                    <p>Explore hundreds of questions across multiple categories - from science and history to pop culture and sports.</p>
                </div>
                
                <div className="promo-feature-card animated">
                    <FaRegClock className="feature-icon" />
                    <h3>Time-Based Scoring</h3>
                    <p>Answer quickly for higher scores! Our unique time-based scoring system rewards both accuracy and speed.</p>
                </div>
                
                <div className="promo-feature-card animated">
                    <FaTrophy className="feature-icon" />
                    <h3>Global Leaderboard</h3>
                    <p>Compete with friends and other players worldwide. Can you make it to the top of our global leaderboard?</p>
                </div>
                
                <div className="promo-feature-card animated">
                    <FaChartLine className="feature-icon" />
                    <h3>Track Your Progress</h3>
                    <p>See your improvement over time and identify your strengths and areas for growth.</p>
                </div>
            </div>

            <div className="promo-cta">
                <p className="promo-cta-text">Ready to put your knowledge to the test?</p>
                <div className="promo-buttons">
                    <button onClick={() => navigate("/SignUp")} className="btn btn-promo">
                        Get Started Now
                    </button>
                    <button onClick={() => navigate("/SignUp")} className="btn-promo-secondary">
                        Already have an account? Log in
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GetPromoPage;