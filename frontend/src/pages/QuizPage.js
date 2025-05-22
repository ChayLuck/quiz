import './QuizPage.css';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTag, FaLayerGroup, FaClock, FaExclamationTriangle } from "react-icons/fa";

function QuizPage() {
    const [data, setData] = useState([]);
    const [dataIndex, setDataIndex] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [answers, setAnswers] = useState([]);
    const hasFetched = useRef(false);
    const navigate = useNavigate();

    // Clear score at start
    sessionStorage.setItem("score", "0");

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetch('http://localhost:5001/api/Questions/StartQuiz')
                .then(res => res.json())
                .then(data => {
                    setData(data.questions);
                    setStartTime(Date.now());
                })
                .catch(error => console.log(error));
        }
    }, []);

    const AnswerFunc = (selectedAnswer) => {
        const endTime = Date.now();
        const questionTime = (endTime - startTime) / 1000;

        const currentQuestion = data[dataIndex];

        const answerData = {
            questionId: currentQuestion._id,
            selectedAnswer: selectedAnswer,
            correctAnswer: currentQuestion.correct_answer,
            timeTaken: questionTime
        };

        const newAnswers = [...answers, answerData];
        setAnswers(newAnswers);

        if (dataIndex + 1 < data.length) {
            setDataIndex(dataIndex + 1);
            setStartTime(Date.now());
        } else {
            submitAnswers(newAnswers);
        }
    };

    const submitAnswers = (answersToSend) => {
        fetch('http://localhost:5001/api/Quiz/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: sessionStorage.getItem("username"),
                data: answersToSend
            })
        })
            .then((res) => res.json())
            .then(result => {
                sessionStorage.setItem('score', result.score);
                navigate('/result');
            })
            .catch(error => {
                console.error("Error:", error);
            });
    };

    function decodeHtmlEntities(text) {
        const txt = document.createElement("textarea");
        txt.innerHTML = text;
        return txt.value;
    }

    function shuffleAnswers(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    const getDifficultyIcon = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return '🟢';
            case 'medium':
                return '🟡';
            case 'hard':
                return '🔴';
            default:
                return '⚪';
        }
    };

    if (!sessionStorage.getItem("isAuthorised") || sessionStorage.getItem("isAuthorised") !== "true") {
        return (
            <div className="quiz-page">
                <div className="quiz-container">
                    <div className="unauthorized-quiz">
                        <FaExclamationTriangle style={{ fontSize: '3rem', color: '#e74c3c', marginBottom: '1rem' }} />
                        <h2>Access Restricted</h2>
                        <p>Please log in to access the quiz and test your knowledge!</p>
                        <button 
                            className="unauthorized-btn" 
                            onClick={() => navigate("/SignUp")}
                        >
                            Login / Sign Up
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="quiz-page">
                <div className="quiz-container">
                    <div className="quiz-loading">
                        <div className="loading-spinner"></div>
                        <p>Preparing your quiz questions...</p>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = data[dataIndex];
    const progress = ((dataIndex + 1) / data.length) * 100;

    return (
        <div className="quiz-page">
            <div className="quiz-container">
                <div className="question-card">
                    <div className="question-header">
                        <div className="question-number">
                            Question {dataIndex + 1} of {data.length}
                        </div>
                        
                        <div style={{ 
                            width: '100%', 
                            height: '6px', 
                            background: '#e9ecef', 
                            borderRadius: '3px', 
                            marginBottom: '2rem',
                            overflow: 'hidden'
                        }}>
                            <div style={{ 
                                width: `${progress}%`, 
                                height: '100%', 
                                background: 'linear-gradient(90deg, #4d61fc, #54e6af)',
                                transition: 'width 0.3s ease'
                            }}></div>
                        </div>

                        <h2 className="question-text">
                            {decodeHtmlEntities(currentQuestion.question)}
                        </h2>

                        <div className="question-meta">
                            <div className="question-meta-item">
                                <FaLayerGroup />
                                <span>{getDifficultyIcon(currentQuestion.difficulty)} {currentQuestion.difficulty}</span>
                            </div>
                            <div className="question-meta-item">
                                <FaTag />
                                <span>{currentQuestion.category}</span>
                            </div>
                            <div className="question-meta-item">
                                <FaClock />
                                <span>Time matters!</span>
                            </div>
                        </div>
                    </div>

                    <div className="answers-container">
                        {currentQuestion.type === "boolean" ? (
                            <div className="boolean-answers">
                                <button 
                                    className="boolean-option true-option"
                                    onClick={() => AnswerFunc("True")}
                                >
                                    ✓ True
                                </button>
                                <button 
                                    className="boolean-option false-option"
                                    onClick={() => AnswerFunc("False")}
                                >
                                    ✗ False
                                </button>
                            </div>
                        ) : (
                            <div className="answers-grid">
                                {shuffleAnswers([currentQuestion.correct_answer, ...currentQuestion.incorrect_answers])
                                    .map((answer, index) => (
                                        <button 
                                            key={index} 
                                            className="answer-option"
                                            onClick={() => AnswerFunc(answer)}
                                        >
                                            <div className="answer-letter">
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                            <div className="answer-text">
                                                {decodeHtmlEntities(answer)}
                                            </div>
                                        </button>
                                    ))
                                }
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuizPage;