import './HomePage.css';
import {useNavigate} from "react-router-dom";

function MainSitePage() {
    const navigate = useNavigate();

    return (
        <div className={"HomePage"}>
            {sessionStorage.getItem("isAuthorised")==="true" ? (
                <>
                    <h2>Hello {sessionStorage.getItem("username")}! Ready to take the quiss?</h2>
                    <h3>You have 10 random questions and only 1 answer will be correct. Think fast because time factor is important!</h3>
                    <button onClick={()=>navigate("/Quiz")}>Start Quiz</button>
                </>
            ):(
                <h3><strong>User not authorised</strong></h3>
            )}
        </div>
    );
}

export default MainSitePage;
