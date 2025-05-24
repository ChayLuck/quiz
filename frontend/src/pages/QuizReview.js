import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCheck, FaTimes, FaClock, FaArrowLeft, FaRedo, FaHome } from 'react-icons/fa';
import './QuizReview.css';

function QuizReview() {
    const [quizData, setQuizData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { quizId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/Quiz/${quizId}`);
                const data = await response.json();
                
                if (data.success) {
                    setQuizData(data.data);
                } else {
                    setError('Quiz not found');
                }
            } catch (err) {
                setError('Failed to load quiz details');
                console.error('Error fetching quiz details:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (quizId) {
            fetchQuizDetails();
        } else {
            setError('No quiz ID provided');
            setIsLoading(false);
        }
    }, [quizId]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getScoreColor = (isCorrect) => {
        return isCorrect ? '#10b981' : '#ef4444';
    };

    const calculateStats = () => {
        if (!quizData?.questions) return { correct: 0, incorrect: 0, totalTime: 0 };
        
        const correct = quizData.questions.filter(q => q.isCorrect).length;
        const incorrect = quizData.questions.length - correct;
        const totalTime = quizData.questions.reduce((sum, q) => sum + q.timeTaken, 0);
        
        return { correct, incorrect, totalTime };
    };

    if (isLoading) {
        return (
            <div className="quiz-review-page">
                <div className="quiz-review-container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading quiz review...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !quizData) {
        return (
            <div className="quiz-review-page">
                <div className="quiz-review-container">
                    <div className="error-state">
                        <h2>❌ {error || 'Quiz not found'}</h2>
                        <p>The quiz review could not be loaded.</p>
                        <button 
                            className="error-btn"
                            onClick={() => navigate('/results')}
                        >
                            <FaArrowLeft />
                            Back to Results
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const stats = calculateStats();

    return (
        <div className="quiz-review-page">
            <div className="quiz-review-container">
                {/* Header Section */}
                <div className="review-header">
                    <button 
                        className="back-btn"
                        onClick={() => navigate('/results')}
                    >
                        <FaArrowLeft />
                        Back to Results
                    </button>
                    
                    <div className="review-title">
                        <h1>Quiz Review</h1>
                        <p>Review your answers and see detailed explanations</p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="stats-overview">
                    <div className="stat-card">
                        <div className="stat-icon correct">
                            <FaCheck />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.correct}</h3>
                            <p>Correct</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon incorrect">
                            <FaTimes />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.incorrect}</h3>
                            <p>Incorrect</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon time">
                            <FaClock />
                        </div>
                        <div className="stat-info">
                            <h3>{formatTime(stats.totalTime)}</h3>
                            <p>Total Time</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon score">
                            🏆
                        </div>
                        <div className="stat-info">
                            <h3>{Math.round(quizData.score)}</h3>
                            <p>Final Score</p>
                        </div>
                    </div>
                </div>

                {/* Questions Review */}
                <div className="questions-review">
                    <h2>Question by Question Review</h2>
                    
                    {quizData.questions.map((question, index) => (
                        <div key={index} className={`question-card ${question.isCorrect ? 'correct' : 'incorrect'}`}>
                            <div className="question-header">
                                <div className="question-number">
                                    Question {index + 1}
                                </div>
                                <div className={`question-result ${question.isCorrect ? 'correct' : 'incorrect'}`}>
                                    {question.isCorrect ? <FaCheck /> : <FaTimes />}
                                    <span>{question.isCorrect ? 'Correct' : 'Incorrect'}</span>
                                </div>
                                <div className="question-time">
                                    <FaClock />
                                    {formatTime(question.timeTaken)}
                                </div>
                            </div>
                            
                            <div className="question-content">
                                <h3 className="question-text">
                                    {question.questionText}
                                </h3>
                                
                                <div className="answers-section">
                                    {question.allOptions.map((option, optIndex) => {
                                        const isCorrect = option === question.correctAnswer;
                                        const isSelected = option === question.selectedAnswer;
                                        
                                        let className = 'answer-option';
                                        if (isCorrect) {
                                            className += ' correct-answer';
                                        }
                                        if (isSelected && !isCorrect) {
                                            className += ' selected-wrong';
                                        }
                                        if (isSelected && isCorrect) {
                                            className += ' selected-correct';
                                        }
                                        
                                        return (
                                            <div key={optIndex} className={className}>
                                                <div className="option-content">
                                                    <span className="option-letter">
                                                        {String.fromCharCode(65 + optIndex)}
                                                    </span>
                                                    <span className="option-text">{option}</span>
                                                </div>
                                                <div className="option-indicators">
                                                    {isSelected && (
                                                        <span className="selected-indicator">
                                                            Your Answer
                                                        </span>
                                                    )}
                                                    {isCorrect && (
                                                        <span className="correct-indicator">
                                                            <FaCheck />
                                                            Correct
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                <div className="explanation-section">
                                    <div className="explanation-header">
                                        <strong>Explanation:</strong>
                                    </div>
                                    <div className="explanation-content">
                                        {question.isCorrect ? (
                                            <p className="correct-explanation">
                                                ✅ Excellent! You correctly identified that "{question.correctAnswer}" is the right answer.
                                            </p>
                                        ) : (
                                            <p className="incorrect-explanation">
                                                ❌ You selected "{question.selectedAnswer}", but the correct answer is "{question.correctAnswer}".
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="review-actions">
                    <button 
                        className="action-btn primary"
                        onClick={() => navigate('/Home')}
                    >
                        <FaRedo />
                        Take Another Quiz
                    </button>
                    <button 
                        className="action-btn secondary"
                        onClick={() => navigate('/Home')}
                    >
                        <FaHome />
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuizReview;