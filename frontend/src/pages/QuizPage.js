import './QuizPage.css';
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

function QuizPage() {
    const [data, setData] = useState([]);
    const [dataIndex, setDataIndex] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [answers, setAnswers] = useState([]);
    const hasFetched = useRef(false);
    localStorage.setItem("score", "0");

    const navigate = useNavigate();

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
        })})
            .then((res) => res.json())
            .then(result => {
                console.log(result); //
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

    if(data.length === 0){
        return <p className={"Load"}>Loading...</p>
    }

    const tempQuestion = data[dataIndex];

    return (
        <div>
            {sessionStorage.getItem("isAuthorised")==="true" ? (
                <div key={tempQuestion._id} className="Question-Section">
                    <h3>{dataIndex+1}) {decodeHtmlEntities(tempQuestion.question)}</h3>
                    <div className={"Question-Info"}>
                        <span>Difficulty: {tempQuestion.difficulty}</span>
                        <span>{tempQuestion.category}</span>
                    </div>
                    {tempQuestion.type === "boolean" ? (
                        <>
                            <button onClick={()=>AnswerFunc("True")}>True</button>
                            <button onClick={()=>AnswerFunc("False")}>False</button>
                        </>
                    ):(
                        shuffleAnswers([tempQuestion.correct_answer, ...tempQuestion.incorrect_answers]).map((answer, index) => (
                            <button key={index} onClick={() => AnswerFunc(answer)}>
                                {String.fromCharCode(65 + index)}: {decodeHtmlEntities(answer)}
                            </button>
                        ))
                    )}
                </div>
            ):(
                <h2 className={"Question-Section"}>User not authorised!</h2>
            )}

        </div>
    );
}

export default QuizPage;


//TODO password hashleme bakılacak