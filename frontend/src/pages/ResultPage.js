import './ResultPage.css'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function ResultPage() {
    const score = sessionStorage.getItem("score")
    const username = sessionStorage.getItem("username")
    const isAuthorised = sessionStorage.getItem("isAuthorised")==="true";
    const [Data, setData] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5001/api/Quiz')
            .then(res => res.json())
            .then(data => {
                setData(data.data);
            })
            .catch(error => console.log(error));

    }, []);

    if (!isAuthorised) {
        return (
            <div>
                <h2 className="Question-Section">User not authorised!</h2>
            </div>
        );
    }

    return (
        <div className="Result-Section">
            <div>
                <h2 className={"Score-Text"}>{username}'s new score is: {score}!!!</h2>
                <button className={"Try-Button"} onClick={()=>navigate("/Home")}>Try Again</button>
                <div className="Leaderboard">
                    <h2 className={"Leaderboard-Header"}>Leaderboard:</h2>
                    {Data.map((item, index) => {
                        const date = new Date(item.createdAt).toLocaleDateString();
                        return (
                            <div key={index} className="Leaderboard-List">
                                <h3 className={"Leaderboard-Score"}>{item.score} </h3>
                                <h3 className="Leaderboard-Name">by {item.username}</h3>
                                <h4 className="Leaderboard-Sub-Propt">at {date}</h4>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ResultPage;